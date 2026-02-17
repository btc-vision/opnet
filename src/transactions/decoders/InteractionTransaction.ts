import { fromBase64, Network } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';
import { InteractionType } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IInteractionTransaction } from '../interfaces/transactions/IInteractionTransaction.js';
import { TransactionBase } from '../Transaction.js';

/**
 * Interaction transaction. Properties could be null if reverted.
 * @category Transactions
 */
export class InteractionTransaction
    extends TransactionBase<InteractionType>
    implements IInteractionTransaction
{
    /**
     * @description The calldata of the transaction.
     */
    public readonly calldata?: Uint8Array;

    /**
     * @description The sender's public key hash.
     */
    public readonly senderPubKeyHash: Uint8Array;

    /**
     * @description The contract secret.
     */
    public readonly contractSecret: Uint8Array;

    /**
     * @description The interaction public key.
     */
    public readonly interactionPubKey: Uint8Array;

    /**
     * @description Whether the transaction data was compressed.
     */
    public readonly wasCompressed: boolean;

    /**
     * @description The from address of the transaction. (ALWAYS TAPROOT. *This address is generated from the P2TR of the pubkey of the deployer.*)
     */
    public readonly from?: Address;

    /**
     * @description The contract address where the transaction was sent. (AKA "to").
     */
    public readonly contractAddress?: string;

    /**
     * @description The contract tweaked public key.
     */
    public readonly contractPublicKey: Address;

    constructor(transaction: IInteractionTransaction, network: Network) {
        super(transaction, network);

        this.contractPublicKey = new Address(fromBase64(transaction.contractPublicKey as string));

        if (transaction.calldata) {
            this.calldata = fromBase64(transaction.calldata as string);
        }

        this.senderPubKeyHash = fromBase64(transaction.senderPubKeyHash as string);
        this.contractSecret = fromBase64(transaction.contractSecret as string);
        this.interactionPubKey = fromBase64(transaction.interactionPubKey as string);

        this.wasCompressed = transaction.wasCompressed || false;
        this.contractAddress = transaction.contractAddress;

        try {
            if (transaction.from) {
                this.from = new Address(
                    fromBase64(transaction.from as string),
                    fromBase64(transaction.fromLegacy as string),
                );
            }
        } catch {}
    }
}
