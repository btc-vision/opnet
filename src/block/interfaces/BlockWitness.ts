export interface IBlockWitnessAPI {
    readonly trusted: boolean;
    readonly signature: string;

    readonly identity?: string;
    readonly opnetPubKey?: string;
}

export interface IBlockWitness {
    blockNumber: bigint | string;
    readonly witnesses: IBlockWitnessAPI[];
}

export type BlockWitnesses = IBlockWitness[];
