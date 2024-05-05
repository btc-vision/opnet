import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from './interfaces/ITransaction.js';
import { TransactionInput } from './TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from './TransactionOutput.js';

export abstract class TransactionBase<T extends OPNetTransactionTypes>
    implements ITransactionBase<T>
{
    public readonly id: string;
    public readonly hash: string;

    public readonly index: number;

    public readonly burnedBitcoin: BigNumberish;
    public readonly revert?: Buffer;

    public readonly inputs: TransactionInput[];
    public readonly outputs: TransactionOutput[];

    public readonly OPNetType: T;

    protected constructor(transaction: ITransactionBase<T>) {
        this.id = transaction.id;
        this.hash = transaction.hash;

        this.index = transaction.index;

        this.burnedBitcoin = BigInt(transaction.burnedBitcoin) || 0n;

        this.inputs = transaction.inputs.map((input) => new TransactionInput(input));
        this.outputs = transaction.outputs.map(
            (output) => new TransactionOutput(output as ITransactionOutput),
        );

        this.revert = transaction.revert
            ? Buffer.from(transaction.revert as string, 'base64')
            : undefined;

        this.OPNetType = transaction.OPNetType;
    }
}
