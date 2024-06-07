import { Address } from '@btc-vision/bsi-binary';

/**
 * Interface for raw contract data.
 * @interface IRawContract
 * @cathegory Raw
 */
export interface IRawContract {
    readonly contractAddress: Address;
    readonly virtualAddress: Address;
    readonly p2trAddress: Address;

    readonly bytecode: Buffer | string;
    readonly wasCompressed: boolean;
    readonly deployedTransactionId: string;
    readonly deployedTransactionHash: string;
    readonly deployerPubKey: Buffer | string;
    readonly contractSeed: Buffer | string;
    readonly contractSaltHash: Buffer | string;
    readonly deployerAddress: Address;
}
