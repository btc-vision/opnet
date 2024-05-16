import { NetEvent } from '@btc-vision/bsi-binary';

/**
 * Raw event data.
 */
export interface NetEventDocument {
    readonly eventType: string;
    readonly eventDataSelector: string;
    readonly eventData: string;
}

/**
 * @description This interface represents a transaction receipt.
 * @interface ITransactionReceipt
 * @category ITransactions
 */
export interface ITransactionReceipt {
    /**
     * @description The receipt of the transaction.
     */
    readonly receipt?: string | Buffer;

    /**
     * @description The receipt proofs of the transaction.
     */
    readonly receiptProofs?: string[];

    /**
     * @description The events of the transaction.
     */
    readonly events?: NetEventDocument[] | NetEvent[];

    /**
     * @description If the transaction was reverted, this field will contain the revert message.
     */
    readonly revert?: string | Buffer;
}
