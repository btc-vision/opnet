export enum TransactionInputFlags {
    hasCoinbase = 0b00000001,
}

export enum TransactionOutputFlags {
    hasTo = 0b00000001,
    hasScriptPubKey = 0b00000010,
    OP_RETURN = 0b00000100,
}
