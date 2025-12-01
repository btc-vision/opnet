/**
 * WebSocket connection state
 */
export enum ConnectionState {
    /** Not connected to the server */
    DISCONNECTED = 0,

    /** Connecting to the server */
    CONNECTING = 1,

    /** Connected, but not yet handshaked */
    CONNECTED = 2,

    /** Performing handshake */
    HANDSHAKING = 3,

    /** Ready to send/receive requests */
    READY = 4,

    /** Reconnecting to the server */
    RECONNECTING = 5,

    /** Closing the connection */
    CLOSING = 6,
}

/**
 * Get the string name for a connection state
 */
export function getConnectionStateName(state: ConnectionState): string {
    switch (state) {
        case ConnectionState.DISCONNECTED:
            return 'DISCONNECTED';
        case ConnectionState.CONNECTING:
            return 'CONNECTING';
        case ConnectionState.CONNECTED:
            return 'CONNECTED';
        case ConnectionState.HANDSHAKING:
            return 'HANDSHAKING';
        case ConnectionState.READY:
            return 'READY';
        case ConnectionState.RECONNECTING:
            return 'RECONNECTING';
        case ConnectionState.CLOSING:
            return 'CLOSING';
        default:
            return 'UNKNOWN';
    }
}
