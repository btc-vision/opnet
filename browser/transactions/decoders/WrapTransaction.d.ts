import { EcKeyPair } from '@btc-vision/transaction';
import { Network } from 'bitcoinjs-lib';
import { IWrapTransaction } from '../interfaces/transactions/IWrapTransaction.js';
import { InteractionTransaction } from './InteractionTransaction.js';
export declare class WrapTransaction extends InteractionTransaction implements IWrapTransaction {
    readonly penalized: boolean;
    readonly wrappingFees: bigint | string;
    readonly depositAmount: bigint | string;
    readonly depositAddress: string;
    readonly vault: string;
    readonly pubKeys: string[];
    readonly minimumSignatures: number;
    constructor(transaction: IWrapTransaction);
    parsedTrustedKeys(trustedKeys: string[], network: Network): EcKeyPair[];
}
