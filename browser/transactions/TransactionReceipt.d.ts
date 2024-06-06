/// <reference types="node" />
import { ContractEvents, ITransactionReceipt } from './interfaces/ITransactionReceipt.js';
export declare class TransactionReceipt implements ITransactionReceipt {
    readonly receipt?: Buffer;
    readonly receiptProofs: string[];
    readonly events: ContractEvents;
    readonly revert?: Buffer;
    constructor(receipt: ITransactionReceipt);
    private parseEvents;
    private decodeEvent;
}
