import { Buffer } from 'buffer';
import { TransactionBase } from '../Transaction.js';
export class InteractionTransaction extends TransactionBase {
    constructor(transaction) {
        super(transaction);
        this.calldata = Buffer.from(transaction.calldata, 'base64');
        this.senderPubKeyHash = Buffer.from(transaction.senderPubKeyHash, 'base64');
        this.contractSecret = Buffer.from(transaction.contractSecret, 'base64');
        this.interactionPubKey = Buffer.from(transaction.interactionPubKey, 'base64');
        this.wasCompressed = transaction.wasCompressed;
        this.from = transaction.from;
        this.contractAddress = transaction.contractAddress;
    }
}
