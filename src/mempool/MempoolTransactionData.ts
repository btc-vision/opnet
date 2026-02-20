import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import {
    IMempoolTransactionData,
    MempoolTransactionInput,
    MempoolTransactionOutput,
} from '../providers/interfaces/mempool/MempoolTransactionData.js';

/**
 * Base class for decoded mempool transaction data.
 *
 * Converts raw wire-format fields from {@link IMempoolTransactionData} into
 * their decoded representations (e.g. hex strings to `bigint`).
 */
export class MempoolTransactionData<T extends OPNetTransactionTypes> {
    /** Internal transaction identifier (txid). */
    public readonly id: string;

    /** Timestamp of when the transaction was first seen. */
    public readonly firstSeen: Date;

    /** Block height at which the transaction was observed. */
    public readonly blockHeight: bigint;

    /** The OPNet transaction type. */
    public readonly transactionType: T;

    /** Whether the transaction was submitted as a PSBT. */
    public readonly psbt: boolean;

    /** The transaction inputs. */
    public readonly inputs: MempoolTransactionInput[];

    /** The transaction outputs. */
    public readonly outputs: MempoolTransactionOutput[];

    /** The full raw transaction as a hex string. */
    public readonly raw: string;

    protected constructor(data: IMempoolTransactionData) {
        this.id = data.id;
        this.firstSeen = new Date(data.firstSeen);
        this.blockHeight = BigInt(data.blockHeight);
        this.transactionType = data.transactionType as T;
        this.psbt = data.psbt;
        this.inputs = data.inputs;
        this.outputs = data.outputs;
        this.raw = data.raw;
    }
}
