/// <reference types="node" />
import { BigNumberish } from '../../common/CommonTypes.js';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionInput, TransactionInput } from '../metadata/TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from '../metadata/TransactionOutput.js';
import { ITransactionReceipt } from './ITransactionReceipt.js';
import { IDeploymentTransaction } from './transactions/IDeploymentTransaction.js';
import { IInteractionTransaction } from './transactions/IInteractionTransaction.js';
import { IWrapTransaction } from './transactions/IWrapTransaction.js';
export interface ITransactionBase<T extends OPNetTransactionTypes> extends ITransactionReceipt {
    readonly id: string;
    readonly hash: string;
    readonly index: number;
    readonly burnedBitcoin: string | BigNumberish;
    readonly revert?: string | Buffer;
    readonly inputs: ITransactionInput[] | TransactionInput[];
    readonly outputs: ITransactionOutput[] | TransactionOutput[];
    readonly OPNetType: T;
    readonly gasUsed: string | bigint;
}
export interface IGenericTransaction extends ITransactionBase<OPNetTransactionTypes.Generic> {
}
export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction | IWrapTransaction;
