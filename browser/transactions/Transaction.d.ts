/// <reference types="node" />
import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from './interfaces/ITransaction.js';
import { TransactionInput } from './TransactionInput.js';
import { TransactionOutput } from './TransactionOutput.js';
export declare abstract class TransactionBase<T extends OPNetTransactionTypes> implements ITransactionBase<T> {
    readonly id: string;
    readonly hash: string;
    readonly index: number;
    readonly burnedBitcoin: BigNumberish;
    readonly revert?: Buffer;
    readonly inputs: TransactionInput[];
    readonly outputs: TransactionOutput[];
    readonly OPNetType: T;
    protected constructor(transaction: ITransactionBase<T>);
}
