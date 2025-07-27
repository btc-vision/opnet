import { Address } from '@btc-vision/transaction';

export interface IBlockWitnessAPI {
    readonly trusted: boolean;
    readonly signature: Buffer;
    readonly timestamp: number;

    readonly proofs: readonly Buffer[];

    readonly identity?: Buffer;
    readonly publicKey?: Address;
}

export interface RawBlockWitnessAPI {
    readonly trusted: boolean;
    readonly signature: string;
    readonly timestamp: number;

    readonly proofs: readonly string[];

    readonly identity?: string;
    readonly publicKey?: string;
}

export interface IBlockWitness {
    blockNumber: bigint;

    readonly witnesses: readonly IBlockWitnessAPI[];
}

export type BlockWitnesses = readonly IBlockWitness[];
