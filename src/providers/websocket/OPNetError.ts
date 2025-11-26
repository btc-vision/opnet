import { getErrorMessage, WebSocketErrorCode } from './types/WebSocketErrorCodes.js';

/**
 * Custom error class for OPNet WebSocket errors
 */
export class OPNetError extends Error {
    public readonly code: WebSocketErrorCode;
    public readonly data?: Uint8Array;

    constructor(code: WebSocketErrorCode, message?: string, data?: Uint8Array) {
        super(message ?? getErrorMessage(code));
        this.name = 'OPNetError';
        this.code = code;
        this.data = data;
    }
}
