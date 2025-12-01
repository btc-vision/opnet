import { WebSocketRequestOpcode } from './WebSocketOpcodes.js';

/**
 * Represents a pending request waiting for a response
 */
export interface PendingRequest<T = unknown> {
    /** The request ID */
    readonly requestId: number;

    /** The opcode of the request */
    readonly opcode: WebSocketRequestOpcode;

    /** Resolve function to call when response is received */
    readonly resolve: (value: T) => void;

    /** Reject function to call when an error occurs */
    readonly reject: (error: Error) => void;

    /** Timeout handle */
    readonly timeout: ReturnType<typeof setTimeout>;

    /** Timestamp when the request was created */
    readonly createdAt: number;
}
