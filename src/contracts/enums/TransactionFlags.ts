export enum TransactionInputFlags {
    /**
     * Indicates that the input has a coinbase transaction.
     * @description This flag is used to mark inputs that are part of a coinbase transaction.
     */
    hasCoinbase = 0b00000001,

    /**
     * Indicates that the input has a witness. For example P2WPKH / P2WSH
     * @description This flag is used to mark inputs that have a witness.
     */
    hasWitness = 0b00000010,
}

export enum TransactionOutputFlags {
    /**
     * Indicates that the output has a recipient address.
     * @description This flag is used to mark outputs that have a recipient address.
     */
    hasTo = 0b00000001,

    /**
     * Indicates that the output has a scriptPubKey. For example P2PK / OP_RETURN
     * @description This flag is used to mark outputs that have a scriptPubKey.
     */
    hasScriptPubKey = 0b00000010,

    /**
     * Indicates that the output is an OP_RETURN output. This flag must also include the hasScriptPubKey flag.
     * @description This flag is used to mark outputs that are OP_RETURN type.
     * @example
     * const flags = TransactionOutputFlags.hasScriptPubKey | TransactionOutputFlags.OP_RETURN;
     */
    OP_RETURN = 0b00000100,
}
