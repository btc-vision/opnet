export enum JSONRpcMethods {
    /** Get Block Current Height */
    BLOCK_BY_NUMBER = 'btc_blockNumber',

    /** Chain */
    CHAIN_ID = 'btc_chainId',
    REORG = 'btc_reorg',

    /** Blocks */
    GET_BLOCK_BY_HASH = 'btc_getBlockByHash',
    GET_BLOCK_BY_NUMBER = 'btc_getBlockByNumber',

    /** Transactions */
    GET_TRANSACTION_BY_HASH = 'btc_getTransactionByHash',
    BROADCAST_TRANSACTION = 'btc_sendRawTransaction',

    /** Opnet */
    GENERATE = 'btc_generate',

    /** Historical */
    GET_UTXOS = 'btc_getUTXOs',

    /** PoA */
    BLOCK_WITNESS = 'btc_blockWitness',

    /** State Methods */
    GET_TRANSACTION_RECEIPT = 'btc_getTransactionReceipt',
    GET_CODE = 'btc_getCode',
    GET_STORAGE_AT = 'btc_getStorageAt',
    GET_BALANCE = 'btc_getBalance',
    CALL = 'btc_call',
}
