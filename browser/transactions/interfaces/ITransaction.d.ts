/// <reference types="node" />
import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionInput, TransactionInput } from '../TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from '../TransactionOutput.js';
import { ContractEvents, ITransactionReceipt } from './ITransactionReceipt.js';
export interface ITransactionBase<T extends OPNetTransactionTypes> extends ITransactionReceipt {
    readonly id: string;
    readonly hash: string;
    readonly index: number;
    readonly burnedBitcoin: string | BigNumberish;
    readonly revert?: string | Buffer;
    readonly inputs: ITransactionInput[] | TransactionInput[];
    readonly outputs: ITransactionOutput[] | TransactionOutput[];
    readonly OPNetType: T;
}
export interface IGenericTransaction extends ITransactionBase<OPNetTransactionTypes.Generic> {
}
export interface ICommonTransaction<T extends OPNetTransactionTypes> extends ITransactionBase<T> {
    readonly from: string;
    readonly contractAddress: string;
    readonly wasCompressed: boolean;
}
export interface IDeploymentTransaction extends ICommonTransaction<OPNetTransactionTypes.Deployment> {
    readonly virtualAddress: string;
    readonly bytecode: Buffer | string;
    readonly deployerPubKey: Buffer | string;
    readonly deployerAddress: string;
    readonly contractSeed: Buffer | string;
    readonly contractSaltHash: Buffer | string;
}
export interface IInteractionTransaction extends ICommonTransaction<OPNetTransactionTypes.Interaction> {
    readonly calldata: string | Buffer;
    readonly senderPubKeyHash: string | Buffer;
    readonly contractSecret: string | Buffer;
    readonly interactionPubKey: string | Buffer;
    readonly from: string;
    readonly events: ContractEvents;
    readonly receipt?: string | Buffer;
    readonly receiptProofs?: string[];
}
export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction;
