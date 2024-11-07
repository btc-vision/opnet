import { IInteractionTransaction } from './IInteractionTransaction.js';

/**
 * @description This interface represents a wrap transaction.
 * @interface IWrapTransaction
 * @category ITransactions
 */
export interface IWrapTransaction extends IInteractionTransaction {
    /**
     * @description Was the wrapping transaction penalized due to invalid calldata?
     */
    readonly penalized: boolean;

    /**
     * @description The fees that were paid for wrapping.
     */
    readonly wrappingFees: bigint | string;

    /**
     * @description The final amount that was deposited.
     */
    readonly depositAmount: bigint | string;

    /**
     * @description The address where the deposit was made.
     */
    readonly depositAddress: string;

    /**
     * @description The vault used to store the Bitcoin.
     */
    readonly vault: string;

    /**
     * @description The vault trusted public keys used for the wrap.
     */
    readonly pubKeys: string[];

    /**
     * @description The minimum amount of signatures required for the vault.
     */
    readonly minimumSignatures: number;
}
