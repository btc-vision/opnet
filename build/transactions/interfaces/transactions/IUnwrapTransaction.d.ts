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
export interface IUnwrapTransaction extends IInteractionTransaction {
    readonly authorizedBy: string[];
    readonly usedUTXOs: UsedUTXO[];
    readonly consolidatedVault: PartialWBTCUTXODocument | ParsedPartialWBTCUTXODocument | undefined;
    readonly unwrapAmount: bigint | string;
    readonly requestedAmount: bigint | string;
}
