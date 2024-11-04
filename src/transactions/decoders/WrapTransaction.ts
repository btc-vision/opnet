import { Network } from '@btc-vision/bitcoin';
import { EcKeyPair } from '@btc-vision/transaction';
import { IWrapTransaction } from '../interfaces/transactions/IWrapTransaction.js';
import { InteractionTransaction } from './InteractionTransaction.js';

/**
 * Defines a wrap transaction.
 * @category Transactions
 */
export class WrapTransaction extends InteractionTransaction implements IWrapTransaction {
    /**
     * @description Was the wrapping transaction penalized due to invalid calldata?
     */
    public readonly penalized: boolean;

    /**
     * @description The fees that were paid for wrapping.
     */
    public readonly wrappingFees: bigint | string;

    /**
     * @description The final amount that was deposited.
     */
    public readonly depositAmount: bigint | string;

    /**
     * @description The address where the deposit was made.
     */
    public readonly depositAddress: string;

    /**
     * @description The vault used to store the Bitcoin.
     */
    public readonly vault: string;

    /**
     * @description The vault trusted public keys used for the wrap.
     */
    public readonly pubKeys: string[];

    /**
     * @description The minimum amount of signatures required for the vault.
     */
    public readonly minimumSignatures: number;

    constructor(transaction: IWrapTransaction) {
        super(transaction);

        this.penalized = transaction.penalized;
        this.wrappingFees = BigInt(transaction.wrappingFees || '0x00') || 0n;
        this.depositAmount = BigInt(transaction.depositAmount || '0x00') || 0n;
        this.depositAddress = transaction.depositAddress;

        this.vault = transaction.vault;
        this.pubKeys = transaction.pubKeys;
        this.minimumSignatures = transaction.minimumSignatures;
    }

    public parsedTrustedKeys(trustedKeys: string[], network: Network): EcKeyPair[] {
        if (!trustedKeys) {
            return [];
        }

        return trustedKeys.map((key) => {
            const buffer: Buffer = Buffer.from(key, 'base64');
            return EcKeyPair.fromPublicKey(buffer, network);
        });
    }
}
