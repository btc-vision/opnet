import { fromBase64, Network } from '@btc-vision/bitcoin';
import { BigNumberish } from '../common/CommonTypes.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from './interfaces/ITransactionBase.js';
import { ProofOfWorkChallenge, RawProofOfWorkChallenge, } from './interfaces/ProofOfWorkChallenge.js';
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
     * @description The priority fee of the transaction.
     */
    public readonly priorityFee: BigNumberish;

    /**
     * @description The maximum amount of gas that can be spent by the transaction.
     */
    public readonly maxGasSat: BigNumberish;

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
     * @description Special gas used by the transaction.
     */
    public readonly specialGasUsed: bigint;

    /**
     * @description The proof of work challenge.
     */
    public readonly pow?: ProofOfWorkChallenge;

    /**
     * @description The block number in which the transaction was included.
     */
    public readonly blockNumber?: bigint;

    protected constructor(transaction: ITransactionBase<T>, network: Network) {
        super(
            {
                receipt: transaction.receipt,
                receiptProofs: transaction.receiptProofs,
                events: transaction.events,
                revert: transaction.revert,
                gasUsed: transaction.gasUsed,
                specialGasUsed: transaction.specialGasUsed,
            },
            network,
        );

        this.id = transaction.id;
        this.hash = transaction.hash;
        this.index = transaction.index;

        if (transaction.blockNumber) this.blockNumber = BigInt(transaction.blockNumber);

        this.burnedBitcoin = BigInt(transaction.burnedBitcoin) || 0n;
        this.priorityFee = BigInt(transaction.priorityFee) || 0n;

        this.inputs = transaction.inputs.map((input) => new TransactionInput(input));
        this.outputs = transaction.outputs.map(
            (output) => new TransactionOutput(output as ITransactionOutput),
        );

        this.OPNetType = transaction.OPNetType;
        this.gasUsed = BigInt(transaction.gasUsed || '0x00') || 0n;
        this.specialGasUsed = BigInt(transaction.specialGasUsed || '0x00') || 0n;

        if (transaction.pow) {
            this.pow = this.decodeProofOfWorkChallenge(transaction.pow as RawProofOfWorkChallenge);
        }

        this.maxGasSat = this.burnedBitcoin + (this.pow?.reward || 0n) - this.priorityFee;
    }

    private decodeProofOfWorkChallenge(challenge: RawProofOfWorkChallenge): ProofOfWorkChallenge {
        return {
            preimage: fromBase64(challenge.preimage),
            reward: BigInt(challenge.reward) || 0n,
            difficulty: BigInt(challenge.difficulty || '0'),
            version: challenge.version || 0,
        };
    }
}
