/** A single transaction input as exposed by the mempool API. */
export interface MempoolTransactionInput {
    /** The txid of the referenced output. */
    readonly transactionId: string;
    /** The vout index of the referenced output. */
    readonly outputIndex: number;
}

/** A single transaction output as exposed by the mempool API. */
export interface MempoolTransactionOutput {
    /** The destination address, or `null` for unspendable outputs. */
    readonly address: string | null;
    /** The vout index within the transaction. */
    readonly outputIndex: number;
    /** The output value in satoshis (decimal string). */
    readonly value: string;
    /** The hex-encoded scriptPubKey. */
    readonly scriptPubKey: string;
}

/** Full representation of a pending mempool transaction returned by the API. */
export interface MempoolTransactionData {
    /** Internal transaction identifier (txid). */
    readonly id: string;

    /** ISO-8601 timestamp of when the transaction was first seen (e.g. `"2025-02-19T15:30:45.123Z"`). */
    readonly firstSeen: string;

    /** Block height at which the transaction was observed, as a `0x`-prefixed hex string. */
    readonly blockHeight: string;

    /** Theoretical gas limit for OPNet execution, as a `0x`-prefixed hex string. */
    readonly theoreticalGasLimit: string;

    /** Priority fee attached to the transaction, as a `0x`-prefixed hex string. */
    readonly priorityFee: string;

    /** Whether this transaction targets an OPNet contract. */
    readonly isOPNet: boolean;

    /** Whether the transaction was submitted as a PSBT. */
    readonly psbt: boolean;

    /** The transaction inputs. */
    readonly inputs: MempoolTransactionInput[];

    /** The transaction outputs. */
    readonly outputs: MempoolTransactionOutput[];

    /** The full raw transaction as a hex string. */
    readonly raw: string;
}
