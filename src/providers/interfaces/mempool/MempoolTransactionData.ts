import { OPNetTransactionTypes } from '../../../interfaces/opnet/OPNetTransactionTypes.js';

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

/** Shape of the server response for the `GET_LATEST_PENDING_TRANSACTIONS` RPC method. */
export interface PendingTransactionsResult {
    readonly transactions?: IMempoolTransactionData[];
}

/**
 * Raw wire-format representation of a pending mempool transaction returned by the API.
 *
 * OPNet-specific fields (`theoreticalGasLimit`, `priorityFee`, `from`,
 * `contractAddress`, `calldata`, `bytecode`) are only present when
 * `transactionType` is **not** `Generic`.
 */
export interface IMempoolTransactionData {
    /** Internal transaction identifier (txid). */
    readonly id: string;

    /** ISO-8601 timestamp of when the transaction was first seen (e.g. `"2025-02-19T15:30:45.123Z"`). */
    readonly firstSeen: string;

    /** Block height at which the transaction was observed, as a `0x`-prefixed hex string. */
    readonly blockHeight: string;

    /** The OPNet transaction type (`Generic`, `Interaction`, or `Deployment`). */
    readonly transactionType: OPNetTransactionTypes | string;

    /** Whether the transaction was submitted as a PSBT. */
    readonly psbt: boolean;

    /** The transaction inputs. */
    readonly inputs: MempoolTransactionInput[];

    /** The transaction outputs. */
    readonly outputs: MempoolTransactionOutput[];

    /** The full raw transaction as a hex string. */
    readonly raw: string;
}

/** OPNet wire-format transaction data with required OPNet-specific fields. */
export interface IMempoolOPNetTransactionData extends IMempoolTransactionData {
    /** Theoretical gas limit for OPNet execution (`0x`-prefixed hex). Only present for OPNet transactions. */
    readonly theoreticalGasLimit: string;

    /** Priority fee attached to the transaction (`0x`-prefixed hex). Only present for OPNet transactions. */
    readonly priorityFee: string;

    /** The sender address (any bitcoin address). Only present for OPNet transactions. */
    readonly from: string;

    /** The target contract address (hex or p2op). Only present for OPNet transactions. */
    readonly contractAddress: string;

    /** Hex-encoded calldata. Only present for OPNet transactions. */
    readonly calldata: string;
}

/** Interaction wire-format transaction data. */
export interface IMempoolInteractionTransactionData extends IMempoolOPNetTransactionData {}

/** Deployment wire-format transaction data with the required `bytecode` field. */
export interface IMempoolDeploymentTransactionData extends IMempoolOPNetTransactionData {
    readonly bytecode: string;
}

/** Union of all possible raw mempool transaction data shapes. */
export type AnyIMempoolTransactionData =
    | IMempoolTransactionData
    | IMempoolInteractionTransactionData
    | IMempoolDeploymentTransactionData;
