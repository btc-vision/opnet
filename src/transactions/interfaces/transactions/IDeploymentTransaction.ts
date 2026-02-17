import { Address } from '@btc-vision/transaction';
import { OPNetTransactionTypes } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ICommonTransaction } from './ICommonTransaction.js';

/**
 * @description This interface represents a deployment transaction.
 * @interface IDeploymentTransaction
 * @category ITransactions
 */
export interface IDeploymentTransaction extends ICommonTransaction<OPNetTransactionTypes.Deployment> {
    /**
     * @description The p2op contract address. (SAFE)
     */
    readonly contractAddress?: string;

    /**
     * @description The contract tweaked public key.
     */
    readonly contractPublicKey?: Address | string;

    /**
     * @description The bytecode of the contract.
     */
    readonly bytecode?: Uint8Array | string;

    /**
     * @description The public key of the deployer.
     */
    readonly deployerPubKey?: Uint8Array | string;

    /**
     * @description The seed of the contract.
     */
    readonly contractSeed?: Uint8Array | string;

    /**
     * @description The salt verification hash of the contract.
     */
    readonly contractSaltHash?: Uint8Array | string;

    /**
     * @description The deployer address.
     */
    readonly deployerAddress?: Address | string;
}
