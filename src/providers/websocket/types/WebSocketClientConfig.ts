/**
 * Configuration for the WebSocket client
 */
export interface WebSocketClientConfig {
    /** WebSocket URL to connect to */
    readonly url: string;

    /** Connection timeout in milliseconds (default: 10000) */
    readonly connectTimeout?: number;

    /** Request timeout in milliseconds (default: 30000) */
    readonly requestTimeout?: number;

    /** Handshake timeout in milliseconds (default: 10000) */
    readonly handshakeTimeout?: number;

    /** Ping interval in milliseconds (default: 30000) */
    readonly pingInterval?: number;

    /** Whether to automatically reconnect on disconnect (default: true) */
    readonly autoReconnect?: boolean;

    /** Maximum number of reconnection attempts (default: 10) */
    readonly maxReconnectAttempts?: number;

    /** Base delay for reconnection in milliseconds (default: 1000) */
    readonly reconnectBaseDelay?: number;

    /** Maximum delay for reconnection in milliseconds (default: 30000) */
    readonly reconnectMaxDelay?: number;

    /** Maximum number of pending requests (default: 1000) */
    readonly maxPendingRequests?: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<Omit<WebSocketClientConfig, 'url'>> = {
    connectTimeout: 10000,
    requestTimeout: 30000,
    handshakeTimeout: 10000,
    pingInterval: 30000,
    autoReconnect: true,
    maxReconnectAttempts: 10,
    reconnectBaseDelay: 1000,
    reconnectMaxDelay: 30000,
    maxPendingRequests: 1000,
};
