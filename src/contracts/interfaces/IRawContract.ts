import { Address } from '@btc-vision/transaction';

/**
 * Interface for raw contract data.
 * @interface IRawContract
 * @cathegory Raw
 */
export interface IRawContract {
    readonly contractAddress: string;

    readonly contractPublicKey: string | Uint8Array;

    readonly bytecode: Uint8Array | string;
    readonly wasCompressed: boolean;
    readonly deployedTransactionId: string;
    readonly deployedTransactionHash: string;
    readonly deployerPubKey: Uint8Array | string;
    readonly contractSeed: Uint8Array | string;
    readonly contractSaltHash: Uint8Array | string;
    readonly deployerAddress: Address;
}
