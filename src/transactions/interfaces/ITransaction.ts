import { BigNumberish } from '../../common/CommonTypes.js';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionInput, TransactionInput } from '../metadata/TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from '../metadata/TransactionOutput.js';
import { ITransactionReceipt } from './ITransactionReceipt.js';
import { ProofOfWorkChallenge, RawProofOfWorkChallenge } from './ProofOfWorkChallenge.js';
import { IDeploymentTransaction } from './transactions/IDeploymentTransaction.js';
import { IInteractionTransaction } from './transactions/IInteractionTransaction.js';

/**
 * @description This interface represents the base of a transaction.
 * @interface ITransactionBase
 * @template T
 * @category ITransactions
 */
export interface ITransactionBase<T extends OPNetTransactionTypes> extends ITransactionReceipt {
    /**
     * @description The transaction ID (hash).
     */
    readonly id: string;

    /**
     * @description The transaction "hash".
     */
    readonly hash: string;

    /**
     * @description The index of the transaction in the block.
     */
    readonly index: number; // Mark the order of the transaction in the block

    /**
     * @description Returns the amount of satoshi that were burned in the transaction.
     */
    readonly burnedBitcoin: string | BigNumberish;

    /**
     * @description The priority fee of the transaction.
     */
    readonly priorityFee: string | BigNumberish;

    /**
     * @description If the transaction was reverted, this field will contain the revert message.
     */
    readonly revert?: string | Buffer;

    /**
     * @description The inputs of the transaction.
     */
    readonly inputs: ITransactionInput[] | TransactionInput[];

    /**
     * @description The outputs of the transaction.
     */
    readonly outputs: ITransactionOutput[] | TransactionOutput[];

    /**
     * @description The type of the transaction.
     */
    readonly OPNetType: T;

    /**
     * @description The amount of gas used by the transaction.
     */
    readonly gasUsed: string | bigint;

    /**
     * @description Special gas used by the transaction.
     */
    readonly specialGasUsed: string | bigint;

    /**
     * @description The raw proof of work challenge.
     */
    readonly pow?: RawProofOfWorkChallenge | ProofOfWorkChallenge;
}

/**
 * @description This interface represents a generic transaction.
 * @interface IGenericTransaction
 * @category ITransactions
 */
export interface IGenericTransaction extends ITransactionBase<OPNetTransactionTypes.Generic> {}

/**
 * @description This type represents a transaction.
 * @type ITransaction
 * @category ITransactions
 */
export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction;
