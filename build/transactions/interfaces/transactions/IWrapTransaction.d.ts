import { IInteractionTransaction } from './IInteractionTransaction.js';
export interface IWrapTransaction extends IInteractionTransaction {
    readonly penalized: boolean;
    readonly wrappingFees: bigint | string;
    readonly depositAmount: bigint | string;
    readonly depositAddress: string;
    readonly vault: string;
    readonly pubKeys: string[];
    readonly minimumSignatures: number;
}
