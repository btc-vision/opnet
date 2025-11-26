import { WebSocketRequestOpcode, WebSocketResponseOpcode } from './WebSocketOpcodes.js';

/**
 * WebSocket client event types
 */
export enum WebSocketClientEvent {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
    BLOCK = 'block',
    EPOCH = 'epoch',
}

/**
 * Generic event handler type
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * Subscription handler type
 */
export type SubscriptionHandler<T = unknown> = (data: T) => void;

/**
 * Block notification from subscription
 */
export interface BlockNotification {
    readonly blockNumber: bigint;
    readonly blockHash: string;
    readonly previousBlockHash: string;
    readonly timestamp: bigint;
}

/**
 * Epoch notification from subscription
 */
export interface EpochNotification {
    readonly epochNumber: bigint;
    readonly epochHash: string;
    readonly timestamp: bigint;
}

/**
 * Internal pending request interface
 */
export interface InternalPendingRequest {
    readonly resolve: (value: Uint8Array) => void;
    readonly reject: (error: Error) => void;
    readonly timeout: ReturnType<typeof setTimeout>;
}

/**
 * Mapping from JSON-RPC methods to WebSocket opcodes and protobuf types
 */
export interface MethodMapping {
    readonly requestOpcode: WebSocketRequestOpcode;
    readonly responseOpcode: WebSocketResponseOpcode;
    readonly requestType: string;
    readonly responseType: string;
}
