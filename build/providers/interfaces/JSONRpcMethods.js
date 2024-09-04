export var JSONRpcMethods;
(function (JSONRpcMethods) {
    JSONRpcMethods["BLOCK_BY_NUMBER"] = "btc_blockNumber";
    JSONRpcMethods["CHAIN_ID"] = "btc_chainId";
    JSONRpcMethods["REORG"] = "btc_reorg";
    JSONRpcMethods["GET_BLOCK_BY_HASH"] = "btc_getBlockByHash";
    JSONRpcMethods["GET_BLOCK_BY_NUMBER"] = "btc_getBlockByNumber";
    JSONRpcMethods["GET_TRANSACTION_BY_HASH"] = "btc_getTransactionByHash";
    JSONRpcMethods["BROADCAST_TRANSACTION"] = "btc_sendRawTransaction";
    JSONRpcMethods["GENERATE"] = "btc_generate";
    JSONRpcMethods["GET_UTXOS"] = "btc_getUTXOs";
    JSONRpcMethods["BLOCK_WITNESS"] = "btc_blockWitness";
    JSONRpcMethods["GET_TRANSACTION_RECEIPT"] = "btc_getTransactionReceipt";
    JSONRpcMethods["GET_CODE"] = "btc_getCode";
    JSONRpcMethods["GET_STORAGE_AT"] = "btc_getStorageAt";
    JSONRpcMethods["GET_BALANCE"] = "btc_getBalance";
    JSONRpcMethods["CALL"] = "btc_call";
})(JSONRpcMethods || (JSONRpcMethods = {}));
