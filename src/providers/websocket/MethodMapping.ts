import { JSONRpcMethods } from '../interfaces/JSONRpcMethods.js';
import { WebSocketRequestOpcode, WebSocketResponseOpcode } from './types/WebSocketOpcodes.js';
import { MethodMapping } from './types/WebSocketProviderTypes.js';

/**
 * JSON-RPC method to WebSocket opcode mapping
 */
export const METHOD_MAPPINGS: Partial<Record<JSONRpcMethods, MethodMapping>> = {
    [JSONRpcMethods.BLOCK_BY_NUMBER]: {
        requestOpcode: WebSocketRequestOpcode.GET_BLOCK_NUMBER,
        responseOpcode: WebSocketResponseOpcode.BLOCK_NUMBER,
        requestType: 'GetBlockNumberRequest',
        responseType: 'GetBlockNumberResponse',
    },
    [JSONRpcMethods.GET_BLOCK_BY_NUMBER]: {
        requestOpcode: WebSocketRequestOpcode.GET_BLOCK_BY_NUMBER,
        responseOpcode: WebSocketResponseOpcode.BLOCK,
        requestType: 'GetBlockByNumberRequest',
        responseType: 'BlockResponse',
    },
    [JSONRpcMethods.GET_BLOCK_BY_HASH]: {
        requestOpcode: WebSocketRequestOpcode.GET_BLOCK_BY_HASH,
        responseOpcode: WebSocketResponseOpcode.BLOCK,
        requestType: 'GetBlockByHashRequest',
        responseType: 'BlockResponse',
    },
    [JSONRpcMethods.GET_BLOCK_BY_CHECKSUM]: {
        requestOpcode: WebSocketRequestOpcode.GET_BLOCK_BY_CHECKSUM,
        responseOpcode: WebSocketResponseOpcode.BLOCK,
        requestType: 'GetBlockByChecksumRequest',
        responseType: 'BlockResponse',
    },
    [JSONRpcMethods.BLOCK_WITNESS]: {
        requestOpcode: WebSocketRequestOpcode.GET_BLOCK_WITNESS,
        responseOpcode: WebSocketResponseOpcode.BLOCK_WITNESS,
        requestType: 'GetBlockWitnessRequest',
        responseType: 'BlockWitnessResponse',
    },
    [JSONRpcMethods.GAS]: {
        requestOpcode: WebSocketRequestOpcode.GET_GAS,
        responseOpcode: WebSocketResponseOpcode.GAS,
        requestType: 'GetGasRequest',
        responseType: 'GasResponse',
    },
    [JSONRpcMethods.GET_TRANSACTION_BY_HASH]: {
        requestOpcode: WebSocketRequestOpcode.GET_TRANSACTION_BY_HASH,
        responseOpcode: WebSocketResponseOpcode.TRANSACTION,
        requestType: 'GetTransactionByHashRequest',
        responseType: 'TransactionResponse',
    },
    [JSONRpcMethods.GET_TRANSACTION_RECEIPT]: {
        requestOpcode: WebSocketRequestOpcode.GET_TRANSACTION_RECEIPT,
        responseOpcode: WebSocketResponseOpcode.TRANSACTION_RECEIPT,
        requestType: 'GetTransactionReceiptRequest',
        responseType: 'TransactionReceiptResponse',
    },
    [JSONRpcMethods.BROADCAST_TRANSACTION]: {
        requestOpcode: WebSocketRequestOpcode.BROADCAST_TRANSACTION,
        responseOpcode: WebSocketResponseOpcode.BROADCAST_RESULT,
        requestType: 'BroadcastTransactionRequest',
        responseType: 'BroadcastTransactionResponse',
    },
    [JSONRpcMethods.TRANSACTION_PREIMAGE]: {
        requestOpcode: WebSocketRequestOpcode.GET_PREIMAGE,
        responseOpcode: WebSocketResponseOpcode.PREIMAGE,
        requestType: 'GetPreimageRequest',
        responseType: 'PreimageResponse',
    },
    [JSONRpcMethods.GET_BALANCE]: {
        requestOpcode: WebSocketRequestOpcode.GET_BALANCE,
        responseOpcode: WebSocketResponseOpcode.BALANCE,
        requestType: 'GetBalanceRequest',
        responseType: 'BalanceResponse',
    },
    [JSONRpcMethods.GET_UTXOS]: {
        requestOpcode: WebSocketRequestOpcode.GET_UTXOS,
        responseOpcode: WebSocketResponseOpcode.UTXOS,
        requestType: 'GetUTXOsRequest',
        responseType: 'UTXOsResponse',
    },
    [JSONRpcMethods.PUBLIC_KEY_INFO]: {
        requestOpcode: WebSocketRequestOpcode.GET_PUBLIC_KEY_INFO,
        responseOpcode: WebSocketResponseOpcode.PUBLIC_KEY_INFO,
        requestType: 'GetPublicKeyInfoRequest',
        responseType: 'PublicKeyInfoResponse',
    },
    [JSONRpcMethods.CHAIN_ID]: {
        requestOpcode: WebSocketRequestOpcode.GET_CHAIN_ID,
        responseOpcode: WebSocketResponseOpcode.CHAIN_ID,
        requestType: 'GetChainIdRequest',
        responseType: 'ChainIdResponse',
    },
    [JSONRpcMethods.REORG]: {
        requestOpcode: WebSocketRequestOpcode.GET_REORG,
        responseOpcode: WebSocketResponseOpcode.REORG,
        requestType: 'GetReorgRequest',
        responseType: 'ReorgResponse',
    },
    [JSONRpcMethods.GET_CODE]: {
        requestOpcode: WebSocketRequestOpcode.GET_CODE,
        responseOpcode: WebSocketResponseOpcode.CODE,
        requestType: 'GetCodeRequest',
        responseType: 'CodeResponse',
    },
    [JSONRpcMethods.GET_STORAGE_AT]: {
        requestOpcode: WebSocketRequestOpcode.GET_STORAGE_AT,
        responseOpcode: WebSocketResponseOpcode.STORAGE,
        requestType: 'GetStorageAtRequest',
        responseType: 'StorageResponse',
    },
    [JSONRpcMethods.CALL]: {
        requestOpcode: WebSocketRequestOpcode.CALL,
        responseOpcode: WebSocketResponseOpcode.CALL_RESULT,
        requestType: 'CallRequest',
        responseType: 'CallResponse',
    },
    [JSONRpcMethods.LATEST_EPOCH]: {
        requestOpcode: WebSocketRequestOpcode.GET_LATEST_EPOCH,
        responseOpcode: WebSocketResponseOpcode.EPOCH,
        requestType: 'GetLatestEpochRequest',
        responseType: 'EpochResponse',
    },
    [JSONRpcMethods.GET_EPOCH_BY_NUMBER]: {
        requestOpcode: WebSocketRequestOpcode.GET_EPOCH_BY_NUMBER,
        responseOpcode: WebSocketResponseOpcode.EPOCH,
        requestType: 'GetEpochByNumberRequest',
        responseType: 'EpochResponse',
    },
    [JSONRpcMethods.GET_EPOCH_BY_HASH]: {
        requestOpcode: WebSocketRequestOpcode.GET_EPOCH_BY_HASH,
        responseOpcode: WebSocketResponseOpcode.EPOCH,
        requestType: 'GetEpochByHashRequest',
        responseType: 'EpochResponse',
    },
    [JSONRpcMethods.GET_EPOCH_TEMPLATE]: {
        requestOpcode: WebSocketRequestOpcode.GET_EPOCH_TEMPLATE,
        responseOpcode: WebSocketResponseOpcode.EPOCH_TEMPLATE,
        requestType: 'GetEpochTemplateRequest',
        responseType: 'EpochTemplateResponse',
    },
    [JSONRpcMethods.SUBMIT_EPOCH]: {
        requestOpcode: WebSocketRequestOpcode.SUBMIT_EPOCH,
        responseOpcode: WebSocketResponseOpcode.EPOCH_SUBMIT_RESULT,
        requestType: 'SubmitEpochRequest',
        responseType: 'SubmitEpochResponse',
    },
    [JSONRpcMethods.GET_MEMPOOL_INFO]: {
        requestOpcode: WebSocketRequestOpcode.GET_MEMPOOL_INFO,
        responseOpcode: WebSocketResponseOpcode.MEMPOOL_INFO,
        requestType: 'GetMempoolInfoRequest',
        responseType: 'GetMempoolInfoResponse',
    },
    [JSONRpcMethods.GET_PENDING_TRANSACTION]: {
        requestOpcode: WebSocketRequestOpcode.GET_PENDING_TRANSACTION,
        responseOpcode: WebSocketResponseOpcode.PENDING_TRANSACTION,
        requestType: 'GetPendingTransactionRequest',
        responseType: 'PendingTransactionResponse',
    },
    [JSONRpcMethods.GET_LATEST_PENDING_TRANSACTIONS]: {
        requestOpcode: WebSocketRequestOpcode.GET_LATEST_PENDING_TRANSACTIONS,
        responseOpcode: WebSocketResponseOpcode.LATEST_PENDING_TRANSACTIONS,
        requestType: 'GetLatestPendingTransactionsRequest',
        responseType: 'LatestPendingTransactionsResponse',
    },
};
