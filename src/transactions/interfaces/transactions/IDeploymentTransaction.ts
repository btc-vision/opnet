import { Address } from '@btc-vision/transaction';
import { OPNetTransactionTypes } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ICommonTransaction } from './ICommonTransaction.js';

/**
 * @description This interface represents a deployment transaction.
 * @interface IDeploymentTransaction
 * @category ITransactions
 */
export interface IDeploymentTransaction
    extends ICommonTransaction<OPNetTransactionTypes.Deployment> {
    /**
     * @description The sewgit generated address of the contract. (SAFE)
     */
    readonly contractAddress: string;

    /**
     * @description The virtual address of the contract.
     */
    readonly tweakedPublicKey: Address | string;

    /**
     * @description The bytecode of the contract.
     */
    readonly bytecode: Buffer | string;

    /**
     * @description The public key of the deployer.
     */
    readonly deployerPubKey: Buffer | string;

    /**
     * @description The seed of the contract.
     */
    readonly contractSeed: Buffer | string;

    /**
     * @description The salt verification hash of the contract.
     */
    readonly contractSaltHash: Buffer | string;
}
