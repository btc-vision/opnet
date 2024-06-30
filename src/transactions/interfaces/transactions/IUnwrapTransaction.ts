import { Address } from '@btc-vision/bsi-binary';
import { IInteractionTransaction } from './IInteractionTransaction.js';

export interface UsedUTXO {
    readonly hash: string;
    readonly outputIndex: number;
}

export interface PartialWBTCUTXODocument {
    readonly vault: Address;

    readonly hash: string;
    readonly value: string;
    readonly outputIndex: number;

    readonly output: string;
}

export interface ParsedPartialWBTCUTXODocument {
    readonly vault: Address;

    readonly hash: string;
    readonly value: bigint;
    readonly outputIndex: number;

    readonly output: Buffer;
}

/**
 * @description This interface represents an unwrap transaction.
 * @interface IUnwrapTransaction
 * @category ITransactions
 */
export interface IUnwrapTransaction extends IInteractionTransaction {
    /**
     * @description The trusted indexers that authorized this transaction.
     */
    readonly authorizedBy: string[];

    /**
     * @description The UTXOs used in this transaction.
     */
    readonly usedUTXOs: UsedUTXO[];

    /**
     * @description The consolidated vault. If any.
     */
    readonly consolidatedVault: PartialWBTCUTXODocument | ParsedPartialWBTCUTXODocument | undefined;

    /**
     * @description The amount to unwrap.
     */
    readonly unwrapAmount: bigint | string;

    /**
     * @description The requested amount.
     */
    readonly requestedAmount: bigint | string;
}
