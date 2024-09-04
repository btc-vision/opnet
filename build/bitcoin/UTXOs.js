export class UTXO {
    constructor(iUTXO) {
        this.transactionId = iUTXO.transactionId;
        this.outputIndex = iUTXO.outputIndex;
        this.value = BigInt(iUTXO.value);
        this.scriptPubKey = iUTXO.scriptPubKey;
    }
}
