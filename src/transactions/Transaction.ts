import { BigNumberish } from 'ethers';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from './interfaces/ITransaction.js';
import { TransactionInput } from './TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from './TransactionOutput.js';

/**
 * @description This class is used to provide a base transaction.
 * @class Transaction
 * @implements {ITransactionBase<T>}
 * @template T
 * @category Transactions
 * @abstract
 */
export abstract class TransactionBase<T extends OPNetTransactionTypes>
    implements ITransactionBase<T>
{
    /**
     * @description The transaction ID (hash).
     */
    public readonly id: string;

    /**
     * @description The transaction "hash".
     */
    public readonly hash: string;

    /**
     * @description The index of the transaction in the block.
     */
    public readonly index: number;

    /**
     * @description Returns the amount of satoshi that were burned in the transaction.
     */
    public readonly burnedBitcoin: BigNumberish;

    /**
     * @description If the transaction was reverted, this field will contain the revert message.
     */
    public readonly revert?: Buffer;

    /**
     * @description The inputs of the transaction.
     */
    public readonly inputs: TransactionInput[];

    /**
     * @description The outputs of the transaction.
     */
    public readonly outputs: TransactionOutput[];

    /**
     * @description The type of the transaction.
     */
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
