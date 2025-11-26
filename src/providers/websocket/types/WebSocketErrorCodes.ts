/**
 * WebSocket API Error Codes
 *
 * Error code ranges:
 * - 1-999: Protocol errors (malformed message, unknown opcode, handshake required)
 * - 1000-1999: Authentication/authorization errors
 * - 2000-2999: Resource errors (not found, already exists)
 * - 3000-3999: Validation errors (invalid parameters)
 * - 4000+: Internal errors
 */

/**
 * Protocol-level errors (1-999)
 */
export enum ProtocolError {
    /** Message could not be parsed or is malformed */
    MALFORMED_MESSAGE = 1,

    /** Unknown opcode received */
    UNKNOWN_OPCODE = 2,

    /** Handshake must be completed before other requests */
    HANDSHAKE_REQUIRED = 3,

    /** Handshake has already been completed */
    HANDSHAKE_ALREADY_COMPLETED = 4,

    /** Protocol version is not supported */
    UNSUPPORTED_PROTOCOL_VERSION = 5,

    /** Message payload too large */
    PAYLOAD_TOO_LARGE = 6,

    /** Request ID is missing or invalid */
    INVALID_REQUEST_ID = 7,

    /** Connection is being closed */
    CONNECTION_CLOSING = 8,

    /** Rate limit exceeded */
    RATE_LIMIT_EXCEEDED = 9,

    /** Too many pending requests */
    TOO_MANY_PENDING_REQUESTS = 10,

    /** Request timeout */
    REQUEST_TIMEOUT = 11,

    /** Invalid message format */
    INVALID_MESSAGE_FORMAT = 12,
}

/**
 * Authentication/Authorization errors (1000-1999)
 */
export enum AuthError {
    /** Authentication required but not provided */
    AUTHENTICATION_REQUIRED = 1000,

    /** Authentication credentials are invalid */
    INVALID_CREDENTIALS = 1001,

    /** Session has expired */
    SESSION_EXPIRED = 1002,

    /** Operation not permitted for this user */
    PERMISSION_DENIED = 1003,

    /** Invalid client information in handshake */
    INVALID_CLIENT_INFO = 1004,
}

/**
 * Resource errors (2000-2999)
 */
export enum ResourceError {
    /** Requested resource was not found */
    NOT_FOUND = 2000,

    /** Block not found */
    BLOCK_NOT_FOUND = 2001,

    /** Transaction not found */
    TRANSACTION_NOT_FOUND = 2002,

    /** Address not found */
    ADDRESS_NOT_FOUND = 2003,

    /** Contract not found */
    CONTRACT_NOT_FOUND = 2004,

    /** Epoch not found */
    EPOCH_NOT_FOUND = 2005,

    /** Subscription not found */
    SUBSCRIPTION_NOT_FOUND = 2006,

    /** Resource already exists */
    ALREADY_EXISTS = 2100,

    /** Subscription already exists */
    SUBSCRIPTION_ALREADY_EXISTS = 2101,

    /** Maximum subscriptions reached */
    MAX_SUBSCRIPTIONS_REACHED = 2102,
}

/**
 * Validation errors (3000-3999)
 */
export enum ValidationError {
    /** Invalid parameters provided */
    INVALID_PARAMS = 3000,

    /** Required field is missing */
    MISSING_REQUIRED_FIELD = 3001,

    /** Field value is out of valid range */
    VALUE_OUT_OF_RANGE = 3002,

    /** Invalid address format */
    INVALID_ADDRESS = 3003,

    /** Invalid hash format */
    INVALID_HASH = 3004,

    /** Invalid block identifier */
    INVALID_BLOCK_IDENTIFIER = 3005,

    /** Invalid transaction data */
    INVALID_TRANSACTION_DATA = 3006,

    /** Invalid signature */
    INVALID_SIGNATURE = 3007,

    /** Invalid calldata */
    INVALID_CALLDATA = 3008,

    /** Block height is negative or too large */
    INVALID_BLOCK_HEIGHT = 3009,

    /** Invalid epoch number */
    INVALID_EPOCH_NUMBER = 3010,

    /** Invalid pointer format */
    INVALID_POINTER = 3011,

    /** Invalid public key */
    INVALID_PUBLIC_KEY = 3012,
}

/**
 * Internal errors (4000+)
 */
export enum InternalError {
    /** Generic internal error */
    INTERNAL_ERROR = 4000,

    /** Database error */
    DATABASE_ERROR = 4001,

    /** Storage error */
    STORAGE_ERROR = 4002,

    /** Serialization error */
    SERIALIZATION_ERROR = 4003,

    /** Deserialization error */
    DESERIALIZATION_ERROR = 4004,

    /** VM execution error */
    VM_ERROR = 4005,

    /** Network error */
    NETWORK_ERROR = 4006,

    /** Service unavailable */
    SERVICE_UNAVAILABLE = 4007,

    /** Method not implemented */
    NOT_IMPLEMENTED = 4008,

    /** Operation timed out */
    TIMEOUT = 4009,
}

/**
 * Union type for all error codes
 */
export type WebSocketErrorCode =
    | ProtocolError
    | AuthError
    | ResourceError
    | ValidationError
    | InternalError;

/**
 * Human-readable error messages for each error code
 */
export const ErrorMessages: Readonly<Record<WebSocketErrorCode, string>> = {
    // Protocol errors
    [ProtocolError.MALFORMED_MESSAGE]: 'Malformed message',
    [ProtocolError.UNKNOWN_OPCODE]: 'Unknown opcode',
    [ProtocolError.HANDSHAKE_REQUIRED]: 'Handshake required before making requests',
    [ProtocolError.HANDSHAKE_ALREADY_COMPLETED]: 'Handshake has already been completed',
    [ProtocolError.UNSUPPORTED_PROTOCOL_VERSION]: 'Unsupported protocol version',
    [ProtocolError.PAYLOAD_TOO_LARGE]: 'Message payload too large',
    [ProtocolError.INVALID_REQUEST_ID]: 'Invalid or missing request ID',
    [ProtocolError.CONNECTION_CLOSING]: 'Connection is closing',
    [ProtocolError.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
    [ProtocolError.TOO_MANY_PENDING_REQUESTS]: 'Too many pending requests',
    [ProtocolError.REQUEST_TIMEOUT]: 'Request timed out',
    [ProtocolError.INVALID_MESSAGE_FORMAT]: 'Invalid message format',

    // Auth errors
    [AuthError.AUTHENTICATION_REQUIRED]: 'Authentication required',
    [AuthError.INVALID_CREDENTIALS]: 'Invalid credentials',
    [AuthError.SESSION_EXPIRED]: 'Session has expired',
    [AuthError.PERMISSION_DENIED]: 'Permission denied',
    [AuthError.INVALID_CLIENT_INFO]: 'Invalid client information',

    // Resource errors
    [ResourceError.NOT_FOUND]: 'Resource not found',
    [ResourceError.BLOCK_NOT_FOUND]: 'Block not found',
    [ResourceError.TRANSACTION_NOT_FOUND]: 'Transaction not found',
    [ResourceError.ADDRESS_NOT_FOUND]: 'Address not found',
    [ResourceError.CONTRACT_NOT_FOUND]: 'Contract not found',
    [ResourceError.EPOCH_NOT_FOUND]: 'Epoch not found',
    [ResourceError.SUBSCRIPTION_NOT_FOUND]: 'Subscription not found',
    [ResourceError.ALREADY_EXISTS]: 'Resource already exists',
    [ResourceError.SUBSCRIPTION_ALREADY_EXISTS]: 'Subscription already exists',
    [ResourceError.MAX_SUBSCRIPTIONS_REACHED]: 'Maximum subscriptions reached',

    // Validation errors
    [ValidationError.INVALID_PARAMS]: 'Invalid parameters',
    [ValidationError.MISSING_REQUIRED_FIELD]: 'Missing required field',
    [ValidationError.VALUE_OUT_OF_RANGE]: 'Value out of valid range',
    [ValidationError.INVALID_ADDRESS]: 'Invalid address format',
    [ValidationError.INVALID_HASH]: 'Invalid hash format',
    [ValidationError.INVALID_BLOCK_IDENTIFIER]: 'Invalid block identifier',
    [ValidationError.INVALID_TRANSACTION_DATA]: 'Invalid transaction data',
    [ValidationError.INVALID_SIGNATURE]: 'Invalid signature',
    [ValidationError.INVALID_CALLDATA]: 'Invalid calldata',
    [ValidationError.INVALID_BLOCK_HEIGHT]: 'Invalid block height',
    [ValidationError.INVALID_EPOCH_NUMBER]: 'Invalid epoch number',
    [ValidationError.INVALID_POINTER]: 'Invalid pointer format',
    [ValidationError.INVALID_PUBLIC_KEY]: 'Invalid public key',

    // Internal errors
    [InternalError.INTERNAL_ERROR]: 'Internal server error',
    [InternalError.DATABASE_ERROR]: 'Database error',
    [InternalError.STORAGE_ERROR]: 'Storage error',
    [InternalError.SERIALIZATION_ERROR]: 'Serialization error',
    [InternalError.DESERIALIZATION_ERROR]: 'Deserialization error',
    [InternalError.VM_ERROR]: 'VM execution error',
    [InternalError.NETWORK_ERROR]: 'Network error',
    [InternalError.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
    [InternalError.NOT_IMPLEMENTED]: 'Method not implemented',
    [InternalError.TIMEOUT]: 'Operation timed out',
};

/**
 * Get the default error message for an error code
 */
export function getErrorMessage(code: WebSocketErrorCode): string {
    return ErrorMessages[code] ?? 'Unknown error';
}
