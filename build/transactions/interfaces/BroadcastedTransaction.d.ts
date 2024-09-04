export interface BroadcastedTransaction {
    readonly success: boolean;
    readonly result?: string;
    readonly error?: string;
    readonly peers?: number;
    readonly identifier: bigint | string;
}
