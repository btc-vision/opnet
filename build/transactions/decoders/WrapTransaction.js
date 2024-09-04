import { EcKeyPair } from '@btc-vision/transaction';
import { InteractionTransaction } from './InteractionTransaction.js';
export class WrapTransaction extends InteractionTransaction {
    constructor(transaction) {
        super(transaction);
        this.penalized = transaction.penalized;
        this.wrappingFees = BigInt(transaction.wrappingFees || '0x00') || 0n;
        this.depositAmount = BigInt(transaction.depositAmount || '0x00') || 0n;
        this.depositAddress = transaction.depositAddress;
        this.vault = transaction.vault;
        this.pubKeys = transaction.pubKeys;
        this.minimumSignatures = transaction.minimumSignatures;
    }
    parsedTrustedKeys(trustedKeys, network) {
        if (!trustedKeys) {
            return [];
        }
        return trustedKeys.map((key) => {
            const buffer = Buffer.from(key, 'base64');
            return EcKeyPair.fromPublicKey(buffer, network);
        });
    }
}
