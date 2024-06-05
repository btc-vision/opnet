import { NetEvent } from '@btc-vision/bsi-binary';

/**
 * Raw event data.
 */
export interface NetEventDocument {
    /** @description The contract address */
    readonly contractAddress: string;

    /** @description The event type */
    readonly eventType: string;

    /** @description The event data selector */
    readonly eventDataSelector: string;

    /** @description The event data */
    readonly eventData: string;
}

export interface IRawContractEvents {
    [key: string]: NetEventDocument[];
}

export type RawContractEvents = IRawContractEvents | NetEventDocument[];

export interface ContractEvents {
    [key: string]: NetEvent[];
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
    readonly events?: RawContractEvents | ContractEvents;

    /**
     * @description If the transaction was reverted, this field will contain the revert message.
     */
    readonly revert?: string | Buffer;
}
