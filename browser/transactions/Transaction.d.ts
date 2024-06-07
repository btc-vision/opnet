import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from './interfaces/ITransaction.js';
import { TransactionInput } from './metadata/TransactionInput.js';
import { TransactionOutput } from './metadata/TransactionOutput.js';
import { TransactionReceipt } from './metadata/TransactionReceipt.js';
export declare abstract class TransactionBase<T extends OPNetTransactionTypes> extends TransactionReceipt implements ITransactionBase<T> {
    readonly id: string;
    readonly hash: string;
    readonly index: number;
    readonly burnedBitcoin: BigNumberish;
    readonly inputs: TransactionInput[];
    readonly outputs: TransactionOutput[];
    readonly OPNetType: T;
    readonly gasUsed: bigint;
    protected constructor(transaction: ITransactionBase<T>);
}
