import { NetEvent } from '@btc-vision/bsi-binary';
import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionInput, TransactionInput } from '../TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from '../TransactionOutput.js';

/**
 * @description This interface represents the base of a transaction.
 * @interface ITransactionBase
 * @template T
 * @category ITransactions
 */
export interface ITransactionBase<T extends OPNetTransactionTypes> {
    readonly id: string;
    readonly hash: string;

    readonly index: number; // Mark the order of the transaction in the block

    readonly burnedBitcoin: string | BigNumberish;
    readonly revert?: string | Buffer;

    readonly inputs: ITransactionInput[] | TransactionInput[];
    readonly outputs: ITransactionOutput[] | TransactionOutput[];

    readonly OPNetType: T;
}

/**
 * @description This interface represents a generic transaction.
 * @interface IGenericTransaction
 * @category ITransactions
 */
export interface IGenericTransaction extends ITransactionBase<OPNetTransactionTypes.Generic> {}

export interface ICommonTransaction<T extends OPNetTransactionTypes> extends ITransactionBase<T> {
    readonly from: string;
    readonly wasCompressed: boolean;
    readonly contractAddress: string;
}

/**
 * @description This interface represents a deployment transaction.
 * @interface IDeploymentTransaction
 * @category ITransactions
 */
export interface IDeploymentTransaction
    extends ICommonTransaction<OPNetTransactionTypes.Deployment> {
    readonly virtualAddress: string;

    readonly bytecode: Buffer | string;

    readonly deployerPubKey: Buffer | string;
    readonly deployerAddress: string;

    readonly contractSeed: Buffer | string;
    readonly contractSaltHash: Buffer | string;
}

/**
 * @description This interface represents an interaction transaction.
 * @interface IInteractionTransaction
 * @category ITransactions
 */
export interface IInteractionTransaction
    extends ICommonTransaction<OPNetTransactionTypes.Interaction> {
    readonly calldata: string | Buffer;
    readonly senderPubKeyHash: string | Buffer;
    readonly contractSecret: string | Buffer;
    readonly interactionPubKey: string | Buffer;

    readonly wasCompressed: boolean;

    readonly from: string;

    readonly events: NetEvent[];
    readonly receipt?: string | Buffer;
    readonly receiptProofs?: string[];
}

/**
 * @description This type represents a transaction.
 * @type ITransaction
 * @category ITransactions
 */
export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction;
