import { NetEvent } from '@btc-vision/bsi-binary';
import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionInput, TransactionInput } from '../TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from '../TransactionOutput.js';
import { ITransactionReceipt } from './ITransactionReceipt.js';

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
}

/**
 * @description This interface represents a generic transaction.
 * @interface IGenericTransaction
 * @category ITransactions
 */
export interface IGenericTransaction extends ITransactionBase<OPNetTransactionTypes.Generic> {}

export interface ICommonTransaction<T extends OPNetTransactionTypes> extends ITransactionBase<T> {
    /**
     * @description This indicates who sent the transaction.
     */
    readonly from: string;

    /**
     * @description This indicates which contract the transaction was sent to. (AKA to)
     */
    readonly contractAddress: string;

    /**
     * @description Was the binary data compressed?
     */
    readonly wasCompressed: boolean;
}

/**
 * @description This interface represents a deployment transaction.
 * @interface IDeploymentTransaction
 * @category ITransactions
 */
export interface IDeploymentTransaction
    extends ICommonTransaction<OPNetTransactionTypes.Deployment> {
    /**
     * @description The virtual address of the contract.
     */
    readonly virtualAddress: string;

    /**
     * @description The bytecode of the contract.
     */
    readonly bytecode: Buffer | string;

    /**
     * @description The public key of the deployer.
     */
    readonly deployerPubKey: Buffer | string;

    /**
     * @description The address of the deployer. (ALWAYS TAPROOT. *This address is generated from the P2TR of the pubkey of the deployer.*)
     */
    readonly deployerAddress: string;

    /**
     * @description The seed of the contract.
     */
    readonly contractSeed: Buffer | string;

    /**
     * @description The salt verification hash of the contract.
     */
    readonly contractSaltHash: Buffer | string;
}

/**
 * @description This interface represents an interaction transaction.
 * @interface IInteractionTransaction
 * @category ITransactions
 */
export interface IInteractionTransaction
    extends ICommonTransaction<OPNetTransactionTypes.Interaction> {
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
    readonly from: string;

    /**
     * @description If the interaction returned events, they will be stored here.
     */
    readonly events: NetEvent[];

    /**
     * @description The receipt of the transaction.
     */
    readonly receipt?: string | Buffer;

    /**
     * @description The receipt proofs of the transaction.
     */
    readonly receiptProofs?: string[];
}

/**
 * @description This type represents a transaction.
 * @type ITransaction
 * @category ITransactions
 */
export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction;
