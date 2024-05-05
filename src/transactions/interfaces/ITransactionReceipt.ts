import { NetEvent } from '@btc-vision/bsi-binary';

/**
 * @description This interface represents a transaction receipt.
 * @interface ITransactionReceipt
 * @category ITransactions
 */
export interface ITransactionReceipt {
    readonly receipt: string | null | Buffer;
    readonly receiptProofs: string[];
    readonly events: NetEvent[];

    readonly revert?: string | Buffer;
}
