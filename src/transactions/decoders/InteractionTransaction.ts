import { Address } from '@btc-vision/transaction';
import { Buffer } from 'buffer';
import { InteractionType } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IInteractionTransaction } from '../interfaces/transactions/IInteractionTransaction.js';
import { TransactionBase } from '../Transaction.js';

/**
 * Interaction transaction.
 * @category Transactions
 */
export class InteractionTransaction
    extends TransactionBase<InteractionType>
    implements IInteractionTransaction
{
    /**
     * @description The calldata of the transaction.
     */
    public readonly calldata: Buffer;

    /**
     * @description The sender's public key hash.
     */
    public readonly senderPubKeyHash: Buffer;

    /**
     * @description The contract secret.
     */
    public readonly contractSecret: Buffer;

    /**
     * @description The interaction public key.
     */
    public readonly interactionPubKey: Buffer;

    /**
     * @description Whether the transaction data was compressed.
     */
    public readonly wasCompressed: boolean;

    /**
     * @description The from address of the transaction. (ALWAYS TAPROOT. *This address is generated from the P2TR of the pubkey of the deployer.*)
     */
    public readonly from: Address;

    /**
     * @description The contract address where the transaction was sent. (AKA "to").
     */
    public readonly contractAddress: string;

    constructor(transaction: IInteractionTransaction) {
        super(transaction);

        this.calldata = Buffer.from(transaction.calldata as string, 'base64');
        this.senderPubKeyHash = Buffer.from(transaction.senderPubKeyHash as string, 'base64');
        this.contractSecret = Buffer.from(transaction.contractSecret as string, 'base64');
        this.interactionPubKey = Buffer.from(transaction.interactionPubKey as string, 'base64');

        this.wasCompressed = transaction.wasCompressed;
        this.from = new Address(Buffer.from(transaction.from as string, 'base64'));
        this.contractAddress = transaction.contractAddress;
    }
}
