/// <reference types="node" />
import { OPNetTransactionTypes } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ICommonTransaction } from './ICommonTransaction.js';
export interface IDeploymentTransaction extends ICommonTransaction<OPNetTransactionTypes.Deployment> {
    readonly contractAddress: string;
    readonly p2trAddress: string;
    readonly virtualAddress: string;
    readonly bytecode: Buffer | string;
    readonly deployerPubKey: Buffer | string;
    readonly deployerAddress: string;
    readonly contractSeed: Buffer | string;
    readonly contractSaltHash: Buffer | string;
}
