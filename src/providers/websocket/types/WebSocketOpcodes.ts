/**
 * WebSocket API Request Opcodes
 * Range: 0x00 - 0x7F for client requests
 */
export enum WebSocketRequestOpcode {
    // Connection Management (0x00 - 0x0F)
    PING = 0x00,
    HANDSHAKE = 0x01,

    // Block Methods (0x10 - 0x1F)
    GET_BLOCK_NUMBER = 0x10,
    GET_BLOCK_BY_NUMBER = 0x11,
    GET_BLOCK_BY_HASH = 0x12,
    GET_BLOCK_BY_CHECKSUM = 0x13,
    GET_BLOCK_WITNESS = 0x14,
    GET_GAS = 0x15,

    // Transaction Methods (0x20 - 0x2F)
    GET_TRANSACTION_BY_HASH = 0x20,
    GET_TRANSACTION_RECEIPT = 0x21,
    BROADCAST_TRANSACTION = 0x22,
    GET_PREIMAGE = 0x23,

    // Mempool Methods (0x24 - 0x2F)
    /** Request aggregate mempool statistics. */
    GET_MEMPOOL_INFO = 0x24,
    /** Request a single pending transaction by hash. */
    GET_PENDING_TRANSACTION = 0x25,
    /** Request the latest pending transactions (with optional address filter). */
    GET_LATEST_PENDING_TRANSACTIONS = 0x26,

    // Address Methods (0x30 - 0x3F)
    GET_BALANCE = 0x30,
    GET_UTXOS = 0x31,
    GET_PUBLIC_KEY_INFO = 0x32,

    // Chain Methods (0x40 - 0x4F)
    GET_CHAIN_ID = 0x40,
    GET_REORG = 0x41,

    // State Methods (0x50 - 0x5F)
    GET_CODE = 0x50,
    GET_STORAGE_AT = 0x51,
    CALL = 0x52,

    // Epoch Methods (0x60 - 0x6F)
    GET_LATEST_EPOCH = 0x60,
    GET_EPOCH_BY_NUMBER = 0x61,
    GET_EPOCH_BY_HASH = 0x62,
    GET_EPOCH_TEMPLATE = 0x63,
    SUBMIT_EPOCH = 0x64,

    // Subscription Methods (0x70 - 0x7F)
    SUBSCRIBE_BLOCKS = 0x70,
    SUBSCRIBE_EPOCHS = 0x71,
    /** Subscribe to new mempool transaction notifications. */
    SUBSCRIBE_MEMPOOL = 0x72,
    UNSUBSCRIBE = 0x7f,
}

/**
 * WebSocket API Response Opcodes
 * Range: 0x80 - 0xFF for server responses
 */
export enum WebSocketResponseOpcode {
    // Error Response
    ERROR = 0x80,

    // Connection Management Responses (0x81 - 0x8F)
    PONG = 0x81,
    HANDSHAKE_ACK = 0x82,

    // Block Method Responses (0x90 - 0x9F)
    BLOCK_NUMBER = 0x90,
    BLOCK = 0x91,
    BLOCK_WITNESS = 0x92,
    GAS = 0x93,

    // Transaction Method Responses (0xA0 - 0xAF)
    TRANSACTION = 0xa0,
    TRANSACTION_RECEIPT = 0xa1,
    BROADCAST_RESULT = 0xa2,
    PREIMAGE = 0xa3,
    /** Response containing aggregate mempool statistics. */
    MEMPOOL_INFO = 0xa4,
    /** Response containing a single pending mempool transaction. */
    PENDING_TRANSACTION = 0xa5,
    /** Response containing the latest pending mempool transactions. */
    LATEST_PENDING_TRANSACTIONS = 0xa6,

    // Address Method Responses (0xB0 - 0xBF)
    BALANCE = 0xb0,
    UTXOS = 0xb1,
    PUBLIC_KEY_INFO = 0xb2,

    // Chain Method Responses (0xC0 - 0xCF)
    CHAIN_ID = 0xc0,
    REORG = 0xc1,

    // State Method Responses (0xD0 - 0xDF)
    CODE = 0xd0,
    STORAGE = 0xd1,
    CALL_RESULT = 0xd2,

    // Epoch Method Responses (0xE0 - 0xEF)
    EPOCH = 0xe0,
    EPOCH_TEMPLATE = 0xe1,
    EPOCH_SUBMIT_RESULT = 0xe2,

    // Subscription Responses (0xF0 - 0xFF)
    SUBSCRIPTION_CREATED = 0xf0,
    UNSUBSCRIBE_RESULT = 0xf1,

    // Server Push Notifications
    NEW_BLOCK_NOTIFICATION = 0xf8,
    NEW_EPOCH_NOTIFICATION = 0xf9,
    /** Server push: a new transaction entered the mempool. */
    NEW_MEMPOOL_TX_NOTIFICATION = 0xfa,
}

/**
 * Union type for all possible opcodes
 */
export type WebSocketOpcode = WebSocketRequestOpcode | WebSocketResponseOpcode;
