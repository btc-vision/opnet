import { TransactionBase } from '../Transaction.js';
export class DeploymentTransaction extends TransactionBase {
    constructor(transaction) {
        super(transaction);
        this.from = transaction.from;
        this.contractAddress = transaction.contractAddress;
        this.virtualAddress = transaction.virtualAddress;
        this.p2trAddress = transaction.p2trAddress;
        this.bytecode = Buffer.from(transaction.bytecode, 'base64');
        this.wasCompressed = transaction.wasCompressed;
        this.deployerPubKey = Buffer.from(transaction.deployerPubKey, 'base64');
        this.deployerAddress = transaction.deployerAddress;
        this.contractSeed = Buffer.from(transaction.contractSeed, 'base64');
        this.contractSaltHash = Buffer.from(transaction.contractSaltHash, 'base64');
    }
}
