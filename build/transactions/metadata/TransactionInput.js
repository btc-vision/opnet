export class TransactionInput {
    constructor(data) {
        this.transactionInWitness = [];
        this.originalTransactionId = data.originalTransactionId;
        this.outputTransactionIndex = data.outputTransactionIndex;
        this.scriptSignature = data.scriptSignature;
        this.sequenceId = data.sequenceId;
        this.transactionInWitness = data.transactionInWitness || [];
    }
}
