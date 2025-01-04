import { BigNumberish } from '../common/CommonTypes.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from './interfaces/ITransaction.js';
import { ProofOfWorkChallenge, RawProofOfWorkChallenge } from './interfaces/ProofOfWorkChallenge.js';
import { TransactionInput } from './metadata/TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from './metadata/TransactionOutput.js';
import { TransactionReceipt } from './metadata/TransactionReceipt.js';

/**
 * @description This class is used to provide a base transaction.
 * @class Transaction
 * @implements {ITransactionBase<T>}
 * @template T
 * @category Transactions
 * @abstract
 */
export abstract class TransactionBase<T extends OPNetTransactionTypes>
    extends TransactionReceipt
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

    /**
     * @description The amount of gas used by the transaction.
     */
    public readonly gasUsed: bigint;

    /**
     * @description The proof of work challenge.
     */
    public readonly pow?: ProofOfWorkChallenge;

    protected constructor(transaction: ITransactionBase<T>) {
        super({
            receipt: transaction.receipt,
            receiptProofs: transaction.receiptProofs,
            events: transaction.events,
            revert: transaction.revert,
        });

        this.id = transaction.id;
        this.hash = transaction.hash;
        this.index = transaction.index;

        this.burnedBitcoin = BigInt(transaction.burnedBitcoin) || 0n;

        this.inputs = transaction.inputs.map((input) => new TransactionInput(input));
        this.outputs = transaction.outputs.map(
            (output) => new TransactionOutput(output as ITransactionOutput),
        );

        this.OPNetType = transaction.OPNetType;
        this.gasUsed = BigInt(transaction.gasUsed || '0x00') || 0n;

        if (transaction.pow) {
            this.pow = this.decodeProofOfWorkChallenge(transaction.pow as RawProofOfWorkChallenge);
        }
    }

    private decodeProofOfWorkChallenge(challenge: RawProofOfWorkChallenge): ProofOfWorkChallenge {
        return {
            preimage: Buffer.from(challenge.preimage, 'base64'),
            reward: BigInt(challenge.reward) || 0n,
            difficulty: BigInt(challenge.difficulty || '0'),
            version: challenge.version || 1,
        };
    }
}
