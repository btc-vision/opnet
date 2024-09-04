import { TransactionParser } from '../transactions/TransactionParser.js';
export class Block {
    constructor(block) {
        this.transactions = [];
        this.height = BigInt(block.height.toString());
        this.hash = block.hash;
        this.previousBlockHash = block.previousBlockHash;
        this.previousBlockChecksum = block.previousBlockChecksum;
        this.bits = block.bits;
        this.nonce = block.nonce;
        this.version = block.version;
        this.size = block.size;
        this.txCount = block.txCount;
        this.weight = block.weight;
        this.strippedSize = block.strippedSize;
        this.time = block.time;
        this.medianTime = block.medianTime;
        this.checksumRoot = block.checksumRoot;
        this.merkleRoot = block.merkleRoot;
        this.storageRoot = block.storageRoot;
        this.receiptRoot = block.receiptRoot;
        this.checksumProofs = block.checksumProofs;
        this.transactions = TransactionParser.parseTransactions(block.transactions);
    }
}
