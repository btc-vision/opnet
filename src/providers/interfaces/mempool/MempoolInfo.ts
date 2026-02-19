/** Aggregate mempool statistics returned by `btc_getMempoolInfo`. */
export interface MempoolInfo {
    /** Total number of pending transactions in the mempool. */
    readonly count: number;
    /** Number of pending OPNet-specific transactions in the mempool. */
    readonly opnetCount: number;
    /** Total byte size of the mempool. */
    readonly size: number;
}
