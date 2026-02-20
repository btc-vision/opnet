import { Network } from '@btc-vision/bitcoin';
import Long from 'long';
import { Root, Type } from 'protobufjs';

import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JSONRpcMethods } from './interfaces/JSONRpcMethods.js';
import { JsonRpcCallResult, JsonRpcResult } from './interfaces/JSONRpcResult.js';
import { METHOD_MAPPINGS } from './websocket/MethodMapping.js';
import { OPNetError } from './websocket/OPNetError.js';
import {
    clearProtobufCache,
    getProtobufType,
    loadProtobufSchema,
} from './websocket/ProtobufLoader.js';
import { ConnectionState, getConnectionStateName } from './websocket/types/ConnectionState.js';
import { SubscriptionType } from './websocket/types/SubscriptionType.js';
import { DEFAULT_CONFIG, WebSocketClientConfig } from './websocket/types/WebSocketClientConfig.js';
import { InternalError, WebSocketErrorCode } from './websocket/types/WebSocketErrorCodes.js';
import {
    WebSocketRequestOpcode,
    WebSocketResponseOpcode,
} from './websocket/types/WebSocketOpcodes.js';
import {
    BlockNotification,
    EpochNotification,
    EventHandler,
    InternalPendingRequest,
    MempoolNotification,
    SubscriptionHandler,
    WebSocketClientEvent,
} from './websocket/types/WebSocketProviderTypes.js';

export interface WebSocketRpcProviderConfig {
    readonly url: string;
    readonly network: Network;
    readonly websocketConfig?: Partial<Omit<WebSocketClientConfig, 'url'>>;
}

/**
 * @description WebSocket RPC provider that extends AbstractRpcProvider.
 * Uses binary protobuf protocol over WebSocket for efficient communication.
 * @class WebSocketRpcProvider
 * @category Providers
 */
export class WebSocketRpcProvider extends AbstractRpcProvider {
    private readonly config: Required<WebSocketClientConfig>;
    private readonly pendingRequests: Map<number, InternalPendingRequest> = new Map();
    private readonly subscriptions: Map<SubscriptionType, SubscriptionHandler> = new Map();
    private readonly eventHandlers: Map<WebSocketClientEvent, Set<EventHandler>> = new Map();

    private socket: WebSocket | null = null;
    private state: ConnectionState = ConnectionState.DISCONNECTED;
    private requestId: number = 0;
    private reconnectAttempt: number = 0;
    private pingTimeout: ReturnType<typeof setTimeout> | null = null;
    private sessionId: Uint8Array | null = null;
    private userRequestedDisconnect: boolean = false;

    private protoRoot: Root | null = null;
    private protoTypes: Map<string, Type> = new Map();

    constructor(providerConfig: WebSocketRpcProviderConfig) {
        super(providerConfig.network);

        if (!providerConfig.url) {
            throw new Error('WebSocketRpcProvider requires a URL in the configuration');
        }

        if (!providerConfig.url.startsWith('ws://') && !providerConfig.url.startsWith('wss://')) {
            throw new Error('WebSocketRpcProvider URL must start with ws:// or wss://');
        }

        this.config = {
            ...DEFAULT_CONFIG,
            url: providerConfig.url,
            ...providerConfig.websocketConfig,
        };
    }

    /**
     * Get the current connection state
     */
    public getState(): ConnectionState {
        return this.state;
    }

    /**
     * Check if the provider is ready to send requests
     */
    public isReady(): boolean {
        return this.state === ConnectionState.READY;
    }

    /**
     * Connect to the WebSocket server
     */
    public async connect(): Promise<void> {
        if (this.state !== ConnectionState.DISCONNECTED) {
            throw new Error(
                `Cannot connect: current state is ${getConnectionStateName(this.state)}`,
            );
        }

        this.state = ConnectionState.CONNECTING;
        this.userRequestedDisconnect = false;

        try {
            // Load protobuf schema first
            const httpUrl = this.config.url.replace(/^ws/, 'http');
            this.protoRoot = await loadProtobufSchema(httpUrl);
            this.protoTypes.clear();

            // Connect WebSocket
            await this.connectWebSocket();

            // Perform handshake
            await this.performHandshake();

            // Start ping loop
            this.schedulePing();

            this.reconnectAttempt = 0;
            this.emit(WebSocketClientEvent.CONNECTED, undefined);
        } catch (error) {
            this.state = ConnectionState.DISCONNECTED;
            throw error;
        }
    }

    /**
     * Disconnect from the WebSocket server
     */
    public disconnect(): void {
        if (this.state === ConnectionState.DISCONNECTED) {
            return;
        }

        this.userRequestedDisconnect = true;
        this.state = ConnectionState.CLOSING;
        this.cancelPing();
        this.cleanupPendingRequests(new Error('Connection closed'));

        if (this.socket) {
            this.socket.close(1000, 'Client disconnect');
            this.socket = null;
        }

        this.state = ConnectionState.DISCONNECTED;
        this.emit(WebSocketClientEvent.DISCONNECTED, undefined);
    }

    /**
     * Register an event handler
     */
    public on<T>(event: WebSocketClientEvent, handler: EventHandler<T>): void {
        let handlers = this.eventHandlers.get(event);
        if (!handlers) {
            handlers = new Set();
            this.eventHandlers.set(event, handlers);
        }
        handlers.add(handler as EventHandler);
    }

    /**
     * Remove an event handler
     */
    public off<T>(event: WebSocketClientEvent, handler: EventHandler<T>): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler as EventHandler);
        }
    }

    /**
     * Subscribe to new blocks
     */
    public async subscribeBlocks(handler: SubscriptionHandler<BlockNotification>): Promise<void> {
        if (this.state !== ConnectionState.READY) {
            throw new Error('Not connected');
        }

        const type = this.getType('SubscribeBlocksRequest');
        const message = type.create({});
        const encodedPayload = type.encode(message).finish();

        const requestId = this.nextRequestId();
        const fullMessage = this.buildMessage(
            WebSocketRequestOpcode.SUBSCRIBE_BLOCKS,
            requestId,
            encodedPayload,
        );

        await this.sendRequest(requestId, fullMessage);
        this.subscriptions.set(SubscriptionType.BLOCKS, handler as SubscriptionHandler);
    }

    /**
     * Subscribe to new epochs
     */
    public async subscribeEpochs(handler: SubscriptionHandler<EpochNotification>): Promise<void> {
        if (this.state !== ConnectionState.READY) {
            throw new Error('Not connected');
        }

        const type = this.getType('SubscribeEpochsRequest');
        const message = type.create({});
        const encodedPayload = type.encode(message).finish();

        const requestId = this.nextRequestId();
        const fullMessage = this.buildMessage(
            WebSocketRequestOpcode.SUBSCRIBE_EPOCHS,
            requestId,
            encodedPayload,
        );

        await this.sendRequest(requestId, fullMessage);
        this.subscriptions.set(SubscriptionType.EPOCHS, handler as SubscriptionHandler);
    }

    /**
     * Subscribe to new mempool transactions
     */
    public async subscribeMempool(
        handler: SubscriptionHandler<MempoolNotification>,
    ): Promise<void> {
        if (this.state !== ConnectionState.READY) {
            throw new Error('Not connected');
        }

        const type = this.getType('SubscribeMempoolRequest');
        const message = type.create({});
        const encodedPayload = type.encode(message).finish();

        const requestId = this.nextRequestId();
        const fullMessage = this.buildMessage(
            WebSocketRequestOpcode.SUBSCRIBE_MEMPOOL,
            requestId,
            encodedPayload,
        );

        await this.sendRequest(requestId, fullMessage);
        this.subscriptions.set(SubscriptionType.MEMPOOL, handler as SubscriptionHandler);
    }

    /**
     * Unsubscribe from a subscription
     */
    public async unsubscribe(subscriptionType: SubscriptionType): Promise<void> {
        if (this.state !== ConnectionState.READY) {
            throw new Error('Not connected');
        }

        const type = this.getType('UnsubscribeRequest');
        const messageData = this.buildMessageByFieldId(type, {
            2: subscriptionType, // subscriptionId field (id=2)
        });
        const message = type.create(messageData);
        const encodedPayload = type.encode(message).finish();

        const requestId = this.nextRequestId();
        const fullMessage = this.buildMessage(
            WebSocketRequestOpcode.UNSUBSCRIBE,
            requestId,
            encodedPayload,
        );

        await this.sendRequest(requestId, fullMessage);
        this.subscriptions.delete(subscriptionType);
    }

    /**
     * Clear the protobuf cache (useful when reconnecting to a different server)
     */
    public clearCache(): void {
        clearProtobufCache();
        this.protoTypes.clear();
        this.protoRoot = null;
    }

    /**
     * Implements the abstract _send method from AbstractRpcProvider.
     * Translates JSON-RPC payloads to WebSocket binary protocol.
     *
     * Note: To match JSONRpcProvider behavior for callMultiplePayloads:
     * - Single payload returns [result]
     * - Array of payloads returns [[result1, result2, ...]] (wrapped in outer array)
     * This is because callMultiplePayloads expects the batch results to be wrapped.
     */
    public async _send(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcCallResult> {
        if (this.state !== ConnectionState.READY) {
            throw new Error('WebSocket not connected. Call connect() first.');
        }

        const isArray = Array.isArray(payload);
        const payloads = isArray ? payload : [payload];
        const results: JsonRpcResult[] = [];

        for (const p of payloads) {
            const result = await this.sendJsonRpcRequest(p);
            results.push(result);
        }

        // Match JSONRpcProvider behavior:
        // - For single payload: return [result] (callPayloadSingle expects this)
        // - For array payload: return [[result1, result2, ...]] (callMultiplePayloads expects this)
        // The type cast is needed because the abstract signature doesn't capture this batch behavior
        return isArray ? ([results] as unknown as JsonRpcCallResult) : results;
    }

    protected providerUrl(url: string): string {
        url = url.trim();

        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }

        // Ensure it's a WebSocket URL
        if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
            url = url.replace(/^http/, 'ws');
        }

        return url;
    }

    /**
     * Translate a JSON-RPC payload to a WebSocket request and send it
     */
    private async sendJsonRpcRequest(payload: JsonRpcPayload): Promise<JsonRpcResult> {
        const mapping = METHOD_MAPPINGS[payload.method];
        if (!mapping) {
            throw new Error(`Unsupported method: ${payload.method}`);
        }

        const requestType = this.getType(mapping.requestType);
        const params = Array.isArray(payload.params) ? payload.params : [];
        // Get field ID -> value mapping, then convert to field name -> value using proto schema
        const fieldIdMap = this.translateJsonRpcParamsToFieldIds(payload.method, params);
        const protoPayload = this.buildMessageByFieldId(requestType, fieldIdMap);
        const message = requestType.create(protoPayload);
        const encodedPayload = requestType.encode(message).finish();

        const requestId = this.nextRequestId();
        const fullMessage = this.buildMessage(mapping.requestOpcode, requestId, encodedPayload);

        const responseData = await this.sendRequest(requestId, fullMessage);
        const responseType = this.getType(mapping.responseType);
        const decoded = responseType.decode(responseData);
        const responseObj = responseType.toObject(decoded, {
            longs: String,
            bytes: String,
            defaults: true,
        }) as Record<string, unknown>;

        // Translate protobuf response back to JSON-RPC format
        const result = this.translateProtoResponse(payload.method, responseObj, responseType);

        return {
            jsonrpc: '2.0',
            id: payload.id ?? null,
            result,
        } as JsonRpcResult;
    }

    /**
     * Translate JSON-RPC params to protobuf field IDs.
     * Uses proto field numbers (stable) instead of field names (may change).
     * Field numbers are defined in the .proto file and are part of the wire format.
     */
    private translateJsonRpcParamsToFieldIds(
        method: JSONRpcMethods,
        params: unknown[],
    ): Record<number, unknown> {
        switch (method) {
            case JSONRpcMethods.BLOCK_BY_NUMBER:
                return {};

            case JSONRpcMethods.GET_BLOCK_BY_NUMBER:
                // GetBlockByNumberRequest: requestId=1, identifier=2, includeTransactions=3
                return {
                    2: { 1: Long.fromString(String(params[0])) }, // identifier.height
                    3: params[1] ?? false,
                };

            case JSONRpcMethods.GET_BLOCK_BY_HASH:
                // GetBlockByNumberRequest: requestId=1, identifier=2, includeTransactions=3
                return {
                    2: { 2: params[0] }, // identifier.hash
                    3: params[1] ?? false,
                };

            case JSONRpcMethods.GET_BLOCK_BY_CHECKSUM:
                // GetBlockByNumberRequest: requestId=1, identifier=2, includeTransactions=3
                return {
                    2: { 3: params[0] }, // identifier.checksum
                    3: params[1] ?? false,
                };

            case JSONRpcMethods.BLOCK_WITNESS:
                // GetBlockWitnessRequest: requestId=1, height=2, trusted=3, limit=4, page=5
                return {
                    2: Long.fromString(String(params[0] ?? -1)),
                    3: params[1],
                    4: params[2],
                    5: params[3],
                };

            case JSONRpcMethods.GAS:
                return {};

            case JSONRpcMethods.GET_TRANSACTION_BY_HASH:
                // GetTransactionByHashRequest: requestId=1, txHash=2
                return { 2: params[0] };

            case JSONRpcMethods.GET_TRANSACTION_RECEIPT:
                // GetTransactionReceiptRequest: requestId=1, txHash=2
                return { 2: params[0] };

            case JSONRpcMethods.BROADCAST_TRANSACTION:
                // BroadcastTransactionRequest: requestId=1, transaction=2, psbt=3
                return {
                    2: params[0],
                    3: params[1] ?? false,
                };

            case JSONRpcMethods.TRANSACTION_PREIMAGE:
                return {};

            case JSONRpcMethods.GET_BALANCE:
                // GetBalanceRequest: requestId=1, address=2, filterOrdinals=3
                return {
                    2: String(params[0]),
                    3: params[1] ?? true,
                };

            case JSONRpcMethods.GET_UTXOS:
                // GetUTXOsRequest: requestId=1, address=2, optimize=3, pending=4
                return {
                    2: String(params[0]),
                    3: params[1] ?? true,
                };

            case JSONRpcMethods.PUBLIC_KEY_INFO:
                // GetPublicKeyInfoRequest: requestId=1, addresses=2
                return { 2: params[0] };

            case JSONRpcMethods.CHAIN_ID:
                return {};

            case JSONRpcMethods.REORG:
                // GetReorgRequest: requestId=1, limit=2
                return {
                    2: params[0],
                };

            case JSONRpcMethods.GET_CODE:
                // GetCodeRequest: requestId=1, contractAddress=2, full=3
                return {
                    2: String(params[0]),
                    3: params[1] ?? false,
                };

            case JSONRpcMethods.GET_STORAGE_AT:
                // GetStorageAtRequest: requestId=1, contractAddress=2, pointer=3, proofs=4
                return {
                    2: String(params[0]),
                    3: params[1],
                    4: params[2] ?? true,
                };

            case JSONRpcMethods.CALL:
                // CallRequest: requestId=1, to=2, calldata=3, from=4, fromLegacy=5
                return {
                    2: String(params[0]),
                    3: params[1],
                    4: params[2],
                    5: params[3],
                };

            case JSONRpcMethods.LATEST_EPOCH:
                return {};

            case JSONRpcMethods.GET_EPOCH_BY_NUMBER:
                // GetEpochByNumberRequest: requestId=1, epochNumber=2
                return {
                    2: Long.fromString(String(params[0])),
                };

            case JSONRpcMethods.GET_EPOCH_BY_HASH:
                // GetEpochByHashRequest: requestId=1, epochHash=2
                return {
                    2: params[0],
                };

            case JSONRpcMethods.GET_EPOCH_TEMPLATE:
                return {};

            case JSONRpcMethods.SUBMIT_EPOCH: {
                // SubmitEpochRequest: requestId=1, epochNumber=2, targetHash=3, salt=4, mldsaPublicKey=5, graffiti=6, signature=7
                // params[0] is an object with these fields
                const submitParams = params[0] as Record<string, unknown>;
                return {
                    2: submitParams.epochNumber,
                    3: submitParams.targetHash,
                    4: submitParams.salt,
                    5: submitParams.mldsaPublicKey,
                    6: submitParams.graffiti,
                    7: submitParams.signature,
                };
            }

            case JSONRpcMethods.GET_MEMPOOL_INFO:
                return {};

            case JSONRpcMethods.GET_PENDING_TRANSACTION:
                // GetPendingTransactionRequest: requestId=1, hash=2
                return { 2: params[0] };

            case JSONRpcMethods.GET_LATEST_PENDING_TRANSACTIONS:
                // GetLatestPendingTransactionsRequest: requestId=1, address=2, addresses=3, limit=4
                // Omit fields that were not provided so the server treats them as absent.
                return {
                    ...(params[0] != null ? { 2: params[0] } : {}),
                    ...(params[1] != null ? { 3: params[1] } : {}),
                    ...(params[2] != null ? { 4: params[2] } : {}),
                };

            default:
                return {};
        }
    }

    /**
     * Convert OPNetType proto enum value to OPNetTransactionTypes string enum.
     * Proto enum: GENERIC=0, DEPLOYMENT=1, INTERACTION=2
     */
    private convertOPNetTypeToString(value: number | undefined): OPNetTransactionTypes {
        switch (value) {
            case 1:
                return OPNetTransactionTypes.Deployment;
            case 2:
                return OPNetTransactionTypes.Interaction;
            case 0:
            default:
                return OPNetTransactionTypes.Generic;
        }
    }

    /**
     * Convert transaction object:
     * 1. Converts OPNetType from integer to string enum
     * 2. Flattens nested type-specific data (interaction/deployment) to top level
     *
     * Proto uses oneof for type-specific data:
     * - field 20: interaction (InteractionTransactionData)
     * - field 21: deployment (DeploymentTransactionData)
     */
    private convertTransaction(tx: Record<string, unknown>): Record<string, unknown> {
        // Get the TransactionForAPI type to find field names by ID
        const txType = this.protoRoot?.lookupType('TransactionForAPI');
        if (!txType) {
            return tx;
        }

        // Find the field name for OPNetType (field 19)
        const opnetTypeField = this.getFieldById(txType, 19);
        if (opnetTypeField && tx[opnetTypeField.name] !== undefined) {
            tx[opnetTypeField.name] = this.convertOPNetTypeToString(
                tx[opnetTypeField.name] as number,
            );
        }

        // Flatten type-specific nested data to top level for client compatibility
        // Field 20: interaction (InteractionTransactionData)
        const interactionField = this.getFieldById(txType, 20);
        if (interactionField && tx[interactionField.name]) {
            const interactionData = tx[interactionField.name] as Record<string, unknown>;
            // Merge interaction fields to top level
            Object.assign(tx, interactionData);
            delete tx[interactionField.name];
        }

        // Field 21: deployment (DeploymentTransactionData)
        const deploymentField = this.getFieldById(txType, 21);
        if (deploymentField && tx[deploymentField.name]) {
            const deploymentData = tx[deploymentField.name] as Record<string, unknown>;
            // Merge deployment fields to top level
            Object.assign(tx, deploymentData);
            delete tx[deploymentField.name];
        }

        return tx;
    }

    /**
     * Convert block response, converting OPNetType in all transactions.
     */
    private convertBlockResponse(block: Record<string, unknown>): Record<string, unknown> {
        // Get the BlockResponse type to find the transactions field name
        const blockType = this.protoRoot?.lookupType('BlockResponse');
        if (!blockType) {
            return block;
        }

        // Find the transactions field (field 22 in proto)
        const txField = this.getFieldById(blockType, 22);
        if (txField && Array.isArray(block[txField.name])) {
            block[txField.name] = (block[txField.name] as Record<string, unknown>[]).map((tx) =>
                this.convertTransaction(tx),
            );
        }

        return block;
    }

    /**
     * Translate protobuf response to JSON-RPC result format.
     * Uses field IDs to extract values (not hardcoded field names).
     */
    private translateProtoResponse(
        method: JSONRpcMethods,
        response: Record<string, unknown>,
        responseType: Type,
    ): unknown {
        // Most responses can be returned as-is since they match the expected format
        // Special handling for certain types that need specific field extraction
        switch (method) {
            case JSONRpcMethods.BLOCK_BY_NUMBER: {
                // GetBlockNumberResponse: blockNumber = field 1
                const fieldName = this.getFieldNameById(responseType, 1);
                return fieldName ? response[fieldName] : undefined;
            }

            case JSONRpcMethods.CHAIN_ID: {
                // GetChainIdResponse: chainId = field 1
                const fieldName = this.getFieldNameById(responseType, 1);
                return fieldName ? response[fieldName] : undefined;
            }

            case JSONRpcMethods.GET_BALANCE: {
                // GetBalanceResponse: balance = field 1
                const fieldName = this.getFieldNameById(responseType, 1);
                return fieldName ? response[fieldName] : undefined;
            }

            case JSONRpcMethods.GET_BLOCK_BY_NUMBER:
            case JSONRpcMethods.GET_BLOCK_BY_HASH:
            case JSONRpcMethods.GET_BLOCK_BY_CHECKSUM: {
                // BlockResponse: convert OPNetType in transactions from int to string
                return this.convertBlockResponse(response);
            }

            case JSONRpcMethods.GET_TRANSACTION_BY_HASH: {
                // TransactionResponse has transaction at field 1
                const txResponseType = this.protoRoot?.lookupType('TransactionResponse');
                if (txResponseType) {
                    const txField = this.getFieldById(txResponseType, 1);
                    if (txField && response[txField.name]) {
                        response[txField.name] = this.convertTransaction(
                            response[txField.name] as Record<string, unknown>,
                        );
                    }
                }
                return response;
            }

            default:
                return response;
        }
    }

    private connectWebSocket(): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = this.buildWebSocketUrl();

            const timeout = setTimeout(() => {
                reject(new Error(`Connection timeout after ${this.config.connectTimeout}ms`));
            }, this.config.connectTimeout);

            try {
                this.socket = new WebSocket(url);
                this.socket.binaryType = 'arraybuffer';

                this.socket.onopen = () => {
                    clearTimeout(timeout);
                    this.state = ConnectionState.CONNECTED;
                    resolve();
                };

                this.socket.onerror = (event) => {
                    clearTimeout(timeout);
                    reject(new Error(`WebSocket error: ${event}`));
                };

                this.socket.onclose = (event) => {
                    this.handleClose(event);
                };

                this.socket.onmessage = (event) => {
                    this.handleMessage(event.data as ArrayBuffer);
                };
            } catch (error) {
                clearTimeout(timeout);
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }

    private buildWebSocketUrl(): string {
        let url = this.config.url.trim();
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }

        // Ensure it's a WebSocket URL
        if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
            url = url.replace(/^http/, 'ws');
        }

        // Add the WebSocket endpoint path
        if (!url.includes('/api/v1/ws')) {
            url = `${url}/api/v1/ws`;
        }

        return url;
    }

    private async performHandshake(): Promise<void> {
        this.state = ConnectionState.HANDSHAKING;

        const type = this.getType('HandshakeRequest');
        // Build message using field numbers from proto schema (not hardcoded names)
        const messageData = this.buildMessageByFieldId(type, {
            1: 1, // protocolVersion field (id=1)
            2: 'opnet-js', // clientName field (id=2)
            3: '1.0.0', // clientVersion field (id=3)
        });
        const message = type.create(messageData);

        const encodedPayload = type.encode(message).finish();
        const requestId = this.nextRequestId();
        const fullMessage = this.buildMessage(
            WebSocketRequestOpcode.HANDSHAKE,
            requestId,
            encodedPayload,
        );

        const responseData = await this.sendRequest(
            requestId,
            fullMessage,
            this.config.handshakeTimeout,
        );

        const responseType = this.getType('HandshakeResponse');
        const decoded = responseType.decode(responseData);
        const response = responseType.toObject(decoded, {
            longs: String,
            bytes: Uint8Array,
            defaults: true,
        });

        // Get session_id using field number lookup
        const sessionIdFieldName = this.getFieldNameById(responseType, 2);
        if (sessionIdFieldName && response[sessionIdFieldName]) {
            this.sessionId = response[sessionIdFieldName] as Uint8Array;
        }

        this.state = ConnectionState.READY;
    }

    /**
     * Build a message object using proto field IDs instead of hardcoded field names.
     * This ensures we use whatever field names the server's proto schema defines.
     * Handles nested messages recursively.
     */
    private buildMessageByFieldId(
        type: Type,
        valuesByFieldId: Record<number, unknown>,
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        for (const [fieldIdStr, value] of Object.entries(valuesByFieldId)) {
            const fieldId = parseInt(fieldIdStr, 10);
            const field = this.getFieldById(type, fieldId);
            if (field) {
                // Check if value is a nested field ID map (object with number keys)
                if (
                    value !== null &&
                    typeof value === 'object' &&
                    !Array.isArray(value) &&
                    !(value instanceof Long)
                ) {
                    const keys = Object.keys(value);
                    const isFieldIdMap = keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
                    if (isFieldIdMap) {
                        // Recursively build nested message
                        const nestedType = this.getNestedType(field.type);
                        if (nestedType) {
                            result[field.name] = this.buildMessageByFieldId(
                                nestedType,
                                value as Record<number, unknown>,
                            );
                        } else {
                            result[field.name] = value;
                        }
                    } else {
                        result[field.name] = value;
                    }
                } else {
                    result[field.name] = value;
                }
            }
        }
        return result;
    }

    /**
     * Get field from proto Type by field ID number
     */
    private getFieldById(type: Type, fieldId: number): { name: string; type: string } | undefined {
        for (const field of type.fieldsArray) {
            if (field.id === fieldId) {
                return { name: field.name, type: field.type };
            }
        }
        return undefined;
    }

    /**
     * Get field name from proto Type by field ID number
     */
    private getFieldNameById(type: Type, fieldId: number): string | undefined {
        const field = this.getFieldById(type, fieldId);
        return field?.name;
    }

    /**
     * Get nested message Type by type name
     */
    private getNestedType(typeName: string): Type | undefined {
        if (!this.protoRoot) return undefined;
        try {
            return getProtobufType(this.protoRoot, typeName);
        } catch {
            return undefined;
        }
    }

    private getType(typeName: string): Type {
        let type = this.protoTypes.get(typeName);
        if (!type) {
            if (!this.protoRoot) {
                throw new Error('Protobuf schema not loaded');
            }
            type = getProtobufType(this.protoRoot, typeName);
            this.protoTypes.set(typeName, type);
        }
        return type;
    }

    private nextRequestId(): number {
        this.requestId = (this.requestId + 1) & 0xffffffff;
        return this.requestId;
    }

    private buildMessage(
        opcode: WebSocketRequestOpcode,
        requestId: number,
        payload: Uint8Array,
    ): Uint8Array {
        // Message format: [opcode (1 byte)] [requestId (4 bytes LE)] [payload]
        const message = new Uint8Array(1 + 4 + payload.length);
        message[0] = opcode;

        // Write request ID as little-endian uint32
        message[1] = requestId & 0xff;
        message[2] = (requestId >> 8) & 0xff;
        message[3] = (requestId >> 16) & 0xff;
        message[4] = (requestId >> 24) & 0xff;

        message.set(payload, 5);
        return message;
    }

    private sendRequest(
        requestId: number,
        message: Uint8Array,
        timeout: number = this.config.requestTimeout,
    ): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            if (this.pendingRequests.size >= this.config.maxPendingRequests) {
                reject(new Error('Too many pending requests'));
                return;
            }

            const timeoutHandle = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject(new Error(`Request timeout after ${timeout}ms`));
            }, timeout);

            this.pendingRequests.set(requestId, {
                resolve,
                reject,
                timeout: timeoutHandle,
            });

            this.send(message);
        });
    }

    private send(data: Uint8Array): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }
        this.socket.send(data);
    }

    private handleMessage(data: ArrayBuffer): void {
        const buffer = new Uint8Array(data);
        if (buffer.length < 5) {
            console.error('Invalid message: too short');
            return;
        }

        const opcode = buffer[0] as WebSocketResponseOpcode;

        // Handle notifications (no request ID)
        if (opcode === WebSocketResponseOpcode.NEW_BLOCK_NOTIFICATION) {
            this.handleBlockNotification(buffer.slice(1));
            return;
        }

        if (opcode === WebSocketResponseOpcode.NEW_EPOCH_NOTIFICATION) {
            this.handleEpochNotification(buffer.slice(1));
            return;
        }

        if (opcode === WebSocketResponseOpcode.NEW_MEMPOOL_TX_NOTIFICATION) {
            this.handleMempoolNotification(buffer.slice(1));
            return;
        }

        // Extract request ID (little-endian uint32)
        const requestId = buffer[1] | (buffer[2] << 8) | (buffer[3] << 16) | (buffer[4] << 24);

        const payload = buffer.slice(5);

        // Handle error responses
        if (opcode === WebSocketResponseOpcode.ERROR) {
            this.handleErrorResponse(requestId, payload);
            return;
        }

        // Handle regular responses
        const pending = this.pendingRequests.get(requestId);
        if (pending) {
            clearTimeout(pending.timeout);
            this.pendingRequests.delete(requestId);
            pending.resolve(payload);
        }
    }

    private handleErrorResponse(requestId: number, payload: Uint8Array): void {
        const pending = this.pendingRequests.get(requestId);
        if (!pending) return;

        clearTimeout(pending.timeout);
        this.pendingRequests.delete(requestId);

        try {
            const type = this.getType('ErrorResponse');
            const decoded = type.decode(payload);
            const error = type.toObject(decoded, {
                longs: Number,
                bytes: Uint8Array,
                defaults: true,
            }) as { code?: number; message?: string; data?: Uint8Array };

            pending.reject(
                new OPNetError(
                    (error.code as WebSocketErrorCode) ?? InternalError.INTERNAL_ERROR,
                    error.message,
                    error.data,
                ),
            );
        } catch (e) {
            pending.reject(new Error('Failed to parse error response'));
        }
    }

    private handleBlockNotification(payload: Uint8Array): void {
        const handler = this.subscriptions.get(SubscriptionType.BLOCKS);
        if (!handler) return;

        try {
            const type = this.getType('NewBlockNotification');
            const decoded = type.decode(payload);
            const block = type.toObject(decoded, {
                longs: String,
                defaults: true,
            }) as {
                block_number?: string;
                blockNumber?: string;
                block_hash?: string;
                blockHash?: string;
                timestamp?: string;
                tx_count?: number;
                txCount?: number;
            };

            const notification: BlockNotification = {
                blockNumber: BigInt(block.block_number || block.blockNumber || '0'),
                blockHash: block.block_hash || block.blockHash || '',
                timestamp: BigInt(block.timestamp || '0'),
                txCount: block.tx_count ?? block.txCount ?? 0,
            };

            handler(notification);
            this.emit(WebSocketClientEvent.BLOCK, notification);
        } catch (e) {
            console.error('Failed to parse block notification:', e);
        }
    }

    private handleEpochNotification(payload: Uint8Array): void {
        const handler = this.subscriptions.get(SubscriptionType.EPOCHS);
        if (!handler) return;

        try {
            const type = this.getType('NewEpochNotification');
            const decoded = type.decode(payload);
            const epoch = type.toObject(decoded, {
                longs: String,
                defaults: true,
            }) as {
                epoch_number?: string;
                epochNumber?: string;
                epoch_hash?: string;
                epochHash?: string;
            };

            const notification: EpochNotification = {
                epochNumber: BigInt(epoch.epoch_number || epoch.epochNumber || '0'),
                epochHash: epoch.epoch_hash || epoch.epochHash || '',
            };

            handler(notification);
            this.emit(WebSocketClientEvent.EPOCH, notification);
        } catch (e) {
            console.error('Failed to parse epoch notification:', e);
        }
    }

    private handleMempoolNotification(payload: Uint8Array): void {
        const handler = this.subscriptions.get(SubscriptionType.MEMPOOL);
        if (!handler) return;

        try {
            const type = this.getType('NewMempoolTransactionNotification');
            const decoded = type.decode(payload);
            const mempool = type.toObject(decoded, {
                longs: String,
                defaults: true,
            }) as {
                subscription_id?: number;
                tx_id?: string;
                txId?: string;
                transaction_type?: string;
                transactionType?: string;
                timestamp?: string;
            };

            const notification: MempoolNotification = {
                txId: mempool.tx_id || mempool.txId || '',
                transactionType: mempool.transaction_type || mempool.transactionType || 'Generic',
                timestamp: BigInt(mempool.timestamp || '0'),
            };

            handler(notification);
            this.emit(WebSocketClientEvent.MEMPOOL, notification);
        } catch (e) {
            console.error('Failed to parse mempool notification:', e);
        }
    }

    private handleClose(event: CloseEvent): void {
        const wasReady = this.state === ConnectionState.READY;
        this.state = ConnectionState.DISCONNECTED;
        this.cancelPing();

        // Only auto-reconnect if:
        // 1. Was in ready state
        // 2. autoReconnect is enabled
        // 3. User did not explicitly call disconnect()
        if (wasReady && this.config.autoReconnect && !this.userRequestedDisconnect) {
            void this.reconnect();
        } else {
            this.cleanupPendingRequests(
                new Error(`Connection closed: ${event.code} ${event.reason}`),
            );
            this.emit(WebSocketClientEvent.DISCONNECTED, {
                code: event.code,
                reason: event.reason,
            });
        }
    }

    private async reconnect(): Promise<void> {
        if (this.reconnectAttempt >= this.config.maxReconnectAttempts) {
            this.emit(WebSocketClientEvent.ERROR, new Error('Max reconnection attempts exceeded'));
            return;
        }

        this.state = ConnectionState.RECONNECTING;
        this.reconnectAttempt++;

        // Clear proto cache to ensure we get the latest schema on reconnect
        this.clearCache();

        const delay = Math.min(
            this.config.reconnectBaseDelay * Math.pow(2, this.reconnectAttempt - 1),
            this.config.reconnectMaxDelay,
        );
        const jitter = Math.random() * 0.3 * delay;

        await this.sleep(delay + jitter);

        try {
            this.state = ConnectionState.DISCONNECTED;
            await this.connect();
            await this.resubscribe();
        } catch (e) {
            console.warn(`Reconnect attempt ${this.reconnectAttempt} failed:`, e);
            void this.reconnect();
        }
    }

    private async resubscribe(): Promise<void> {
        const handlers = new Map(this.subscriptions);
        this.subscriptions.clear();

        for (const [type, handler] of handlers) {
            try {
                if (type === SubscriptionType.BLOCKS) {
                    await this.subscribeBlocks(handler as SubscriptionHandler<BlockNotification>);
                } else if (type === SubscriptionType.EPOCHS) {
                    await this.subscribeEpochs(handler as SubscriptionHandler<EpochNotification>);
                } else if (type === SubscriptionType.MEMPOOL) {
                    await this.subscribeMempool(
                        handler as SubscriptionHandler<MempoolNotification>,
                    );
                }
            } catch (e) {
                console.error(`Failed to resubscribe to ${type}:`, e);
            }
        }
    }

    private cleanupPendingRequests(error: Error): void {
        for (const [_id, pending] of this.pendingRequests) {
            clearTimeout(pending.timeout);
            pending.reject(error);
        }
        this.pendingRequests.clear();
    }

    private schedulePing(): void {
        this.cancelPing();

        this.pingTimeout = setTimeout(() => {
            if (this.state === ConnectionState.READY) {
                try {
                    this.ping();
                } catch (e) {
                    console.warn('Ping failed:', e);
                }

                // Schedule next ping recursively
                this.schedulePing();
            }
        }, this.config.pingInterval);
    }

    private cancelPing(): void {
        if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
            this.pingTimeout = null;
        }
    }

    private ping(): void {
        const type = this.getType('PingRequest');
        const message = type.create({ timestamp: Long.fromNumber(Date.now()) });
        const encodedPayload = type.encode(message).finish();

        // Use consistent message format: [opcode][requestId][payload]
        const requestId = this.nextRequestId();
        const fullMessage = this.buildMessage(
            WebSocketRequestOpcode.PING,
            requestId,
            encodedPayload,
        );

        this.send(fullMessage);
    }

    private emit<T>(event: WebSocketClientEvent, data: T): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(data);
                } catch (e) {
                    console.error(`Error in event handler for ${event}:`, e);
                }
            }
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
