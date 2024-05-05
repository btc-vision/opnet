/// <reference types="node" />
import { NetEvent } from '@btc-vision/bsi-binary';
import { ITransactionReceipt } from './interfaces/ITransactionReceipt.js';
export declare class TransactionReceipt implements ITransactionReceipt {
    readonly receipt: Buffer | null;
    readonly receiptProofs: string[];
    readonly events: NetEvent[];
    readonly revert?: Buffer;
    constructor(receipt: ITransactionReceipt);
}
