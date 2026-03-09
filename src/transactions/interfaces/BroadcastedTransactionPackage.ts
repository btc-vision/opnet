export interface SequentialBroadcastTxResult {
    /** The txid of the transaction. */
    readonly txid: string;

    /** Whether the individual transaction was successfully broadcast. */
    readonly success: boolean;

    /** Error message if this transaction failed. */
    readonly error?: string;

    /** Number of peers that received the transaction. */
    readonly peers?: number;
}

export interface BroadcastedTransactionPackage {
    /** Whether the overall package broadcast succeeded. */
    readonly success: boolean;

    /** Error message if the broadcast failed. */
    readonly error?: string;

    /** Present when testMempoolAccept was used (sequential or single tx path). */
    readonly testResults?: readonly TestMempoolAcceptResult[];

    /** Present when submitPackage was used successfully. */
    readonly packageResult?: PackageResult;

    /** Per-transaction results for sequential or single tx broadcasts. */
    readonly sequentialResults?: readonly SequentialBroadcastTxResult[];

    /** True when submitPackage failed and the node fell back to sequential broadcast. */
    readonly fellBackToSequential?: boolean;
}

export interface TestMempoolAcceptResult {
    readonly txid: string;
    readonly wtxid: string;
    readonly allowed?: boolean;
    readonly vsize?: number;
    readonly packageError?: string;
    readonly rejectReason?: string;
    readonly rejectDetails?: string;
    readonly fees?: TestMempoolAcceptFees;
}

export interface TestMempoolAcceptFees {
    readonly base: number;
    readonly effectiveFeerate: number;
    readonly effectiveIncludes: readonly string[];
}

export interface PackageTxResult {
    readonly txid: string;
    readonly otherWtxid?: string;
    readonly vsize?: number;
    readonly fees?: PackageTxFees;
    readonly error?: string;
}

export interface PackageTxFees {
    readonly base: number;
    readonly effectiveFeerate?: number;
    readonly effectiveIncludes?: readonly string[];
}

export interface PackageResult {
    readonly packageMsg: string;
    readonly txResults: {
        readonly [wtxid: string]: PackageTxResult;
    };
    readonly replacedTransactions?: readonly string[];
}
