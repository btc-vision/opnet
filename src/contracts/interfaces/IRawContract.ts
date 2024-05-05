/**
 * Interface for raw contract data.
 * @interface IRawContract
 * @cathegory Raw
 */
export interface IRawContract {
    readonly contractAddress: string;
    readonly virtualAddress: string;
    readonly bytecode: Buffer | string;
    readonly wasCompressed: boolean;
    readonly deployedTransactionId: string;
    readonly deployedTransactionHash: string;
    readonly deployerPubKey: Buffer | string;
    readonly contractSeed: Buffer | string;
    readonly contractSaltHash: Buffer | string;
    readonly deployerAddress: string;
}
