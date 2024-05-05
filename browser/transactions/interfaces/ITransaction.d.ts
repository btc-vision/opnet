/// <reference types="node" />
import { NetEvent } from '@btc-vision/bsi-binary';
import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionInput, TransactionInput } from '../TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from '../TransactionOutput.js';
export interface ITransactionBase<T extends OPNetTransactionTypes> {
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
export interface IDeploymentTransaction extends ITransactionBase<OPNetTransactionTypes.Deployment> {
    readonly contractAddress: string;
    readonly virtualAddress: string;
    readonly bytecode: Buffer | string;
    readonly wasCompressed: boolean;
    readonly deployerPubKey: Buffer | string;
    readonly deployerAddress: string;
    readonly contractSeed: Buffer | string;
    readonly contractSaltHash: Buffer | string;
}
export interface IInteractionTransaction extends ITransactionBase<OPNetTransactionTypes.Interaction> {
    readonly calldata: string | Buffer;
    readonly senderPubKeyHash: string | Buffer;
    readonly contractSecret: string | Buffer;
    readonly interactionPubKey: string | Buffer;
    readonly wasCompressed: boolean;
    readonly events: NetEvent[];
    readonly receipt?: string | Buffer;
    readonly receiptProofs?: string[];
}
export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction;