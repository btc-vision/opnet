import { TransactionInput } from './metadata/TransactionInput.js';
import { TransactionOutput } from './metadata/TransactionOutput.js';
import { TransactionReceipt } from './metadata/TransactionReceipt.js';
export class TransactionBase extends TransactionReceipt {
    constructor(transaction) {
        super({
            receipt: transaction.receipt,
            receiptProofs: transaction.receiptProofs,
            events: transaction.events,
            revert: transaction.revert,
        });
        this.id = transaction.id;
        this.hash = transaction.hash;
        this.index = transaction.index;
        this.burnedBitcoin = BigInt(transaction.burnedBitcoin) || 0n;
        this.inputs = transaction.inputs.map((input) => new TransactionInput(input));
        this.outputs = transaction.outputs.map((output) => new TransactionOutput(output));
        this.OPNetType = transaction.OPNetType;
        this.gasUsed = BigInt(transaction.gasUsed || '0x00') || 0n;
    }
}
