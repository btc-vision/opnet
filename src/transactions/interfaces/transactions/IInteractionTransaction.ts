import { Address } from '@btc-vision/transaction';
import { InteractionType } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ContractEvents } from '../ITransactionReceipt.js';
import { ICommonTransaction } from './ICommonTransaction.js';

/**
 * @description This interface represents an interaction transaction.
 * @interface IInteractionTransaction
 * @category ITransactions
 */
export interface IInteractionTransaction extends ICommonTransaction<InteractionType> {
    /**
     * @description The calldata of the transaction.
     */
    readonly calldata: string | Buffer;

    /**
     * @description The sender's public key hash.
     */
    readonly senderPubKeyHash: string | Buffer;

    /**
     * @description The contract secret.
     */
    readonly contractSecret: string | Buffer;

    /**
     * @description The interaction public key.
     */
    readonly interactionPubKey: string | Buffer;

    /**
     * @description Who sent the transaction. (ALWAYS TAPROOT. *This address is generated from the P2TR of the pubkey of the deployer.*)
     */
    readonly from: Address | string;

    /**
     * @description If the interaction returned events, they will be stored here.
     */
    readonly events: ContractEvents;

    /**
     * @description The receipt of the transaction.
     */
    readonly receipt?: string | Buffer;

    /**
     * @description The receipt proofs of the transaction.
     */
    readonly receiptProofs?: string[];
}
