export interface ReorgInformation {
    fromBlock: string | bigint;
    toBlock: string | bigint;
    readonly timestamp: number;
}
