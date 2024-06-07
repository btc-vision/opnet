/// <reference types="node" />
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IDeploymentTransaction } from '../interfaces/transactions/IDeploymentTransaction.js';
import { TransactionBase } from '../Transaction.js';
export declare class DeploymentTransaction extends TransactionBase<OPNetTransactionTypes.Deployment> implements IDeploymentTransaction {
    readonly contractAddress: string;
    readonly virtualAddress: string;
    readonly p2trAddress: string;
    readonly bytecode: Buffer;
    readonly wasCompressed: boolean;
    readonly deployerPubKey: Buffer;
    readonly deployerAddress: string;
    readonly contractSeed: Buffer;
    readonly contractSaltHash: Buffer;
    readonly from: string;
    constructor(transaction: IDeploymentTransaction);
}
