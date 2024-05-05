import { NetEvent } from '@btc-vision/bsi-binary';
import { ITransactionReceipt } from './interfaces/ITransactionReceipt.js';

export class TransactionReceipt implements ITransactionReceipt {
    public readonly receipt: Buffer | null;
    public readonly receiptProofs: string[];
    public readonly events: NetEvent[];

    public readonly revert?: Buffer;

    constructor(receipt: ITransactionReceipt) {
        this.receipt = receipt.receipt ? Buffer.from(receipt.receipt as string, 'base64') : null;
        this.receiptProofs = receipt.receiptProofs || [];
        this.events = receipt.events || [];

        this.revert = receipt.revert ? Buffer.from(receipt.revert as string, 'base64') : undefined;
    }
}
