export enum JSONRpcMethods {
    /** Get Block Current Height */
    BLOCK_BY_NUMBER = 'btc_blockNumber',

    /** Chain */
    CHAIN_ID = 'btc_chainId',
    REORG = 'btc_reorg',

    /** Blocks */
    GET_BLOCK_BY_HASH = 'btc_getBlockByHash',
    GET_BLOCK_BY_CHECKSUM = 'btc_getBlockByChecksum',
    GET_BLOCK_BY_NUMBER = 'btc_getBlockByNumber',
    GAS = 'btc_gas',

    /** Transactions */
    GET_TRANSACTION_BY_HASH = 'btc_getTransactionByHash',
    BROADCAST_TRANSACTION = 'btc_sendRawTransaction',
    TRANSACTION_PREIMAGE = 'btc_preimage',

    /** Addresses */
    PUBLIC_KEY_INFO = 'btc_publicKeyInfo',
    GET_UTXOS = 'btc_getUTXOs',
    GET_BALANCE = 'btc_getBalance',

    /** PoC */
    BLOCK_WITNESS = 'btc_blockWitness',

    /** State Methods */
    GET_TRANSACTION_RECEIPT = 'btc_getTransactionReceipt',
    GET_CODE = 'btc_getCode',
    GET_STORAGE_AT = 'btc_getStorageAt',

    /** Epochs */
    LATEST_EPOCH = 'btc_latestEpoch',
    GET_EPOCH_BY_NUMBER = 'btc_getEpochByNumber',
    GET_EPOCH_BY_HASH = 'btc_getEpochByHash',
    GET_EPOCH_TEMPLATE = 'btc_getEpochTemplate',
    SUBMIT_EPOCH = 'btc_submitEpoch',

    /** Simulation */
    CALL = 'btc_call',

    /** Mempool */

    /** Retrieve aggregate mempool statistics (count, OPNet count, byte size). */
    GET_MEMPOOL_INFO = 'btc_getMempoolInfo',
    /** Fetch a single pending mempool transaction by its hash. */
    GET_PENDING_TRANSACTION = 'btc_getPendingTransaction',
    /** Fetch the latest pending mempool transactions, optionally filtered by address(es). */
    GET_LATEST_PENDING_TRANSACTIONS = 'btc_getLatestPendingTransactions',
}
