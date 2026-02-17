import { Address } from '@btc-vision/transaction';
import { stringBase64ToBuffer } from '../utils/StringToBuffer.js';
import {
    BlockWitnesses,
    IBlockWitness,
    IBlockWitnessAPI,
    RawBlockWitnessAPI,
} from './interfaces/IBlockWitness.js';

export class BlockWitnessAPI implements IBlockWitnessAPI {
    public readonly trusted: boolean;
    public readonly signature: Uint8Array;
    public readonly timestamp: number;
    public readonly proofs: readonly Uint8Array[];
    public readonly identity?: Uint8Array;
    public readonly publicKey?: Address;

    constructor(data: RawBlockWitnessAPI) {
        this.trusted = data.trusted;
        this.signature = stringBase64ToBuffer(data.signature);
        this.timestamp = data.timestamp;
        this.proofs = Object.freeze(data.proofs.map((proof) => stringBase64ToBuffer(proof)));
        this.identity = data.identity ? stringBase64ToBuffer(data.identity) : undefined;
        this.publicKey = data.publicKey ? Address.fromString(data.publicKey) : undefined;
    }
}

export class BlockWitness implements IBlockWitness {
    public blockNumber: bigint;

    public readonly witnesses: readonly BlockWitnessAPI[];

    constructor(data: { blockNumber: string | bigint; witnesses: RawBlockWitnessAPI[] }) {
        this.blockNumber =
            typeof data.blockNumber === 'string' ? BigInt(data.blockNumber) : data.blockNumber;

        this.witnesses = Object.freeze(
            data.witnesses.map((witness) => new BlockWitnessAPI(witness)),
        );
    }
}

// Helper function to convert raw block witnesses array
export function parseBlockWitnesses(
    rawWitnesses: Array<{
        blockNumber: string;
        witnesses: RawBlockWitnessAPI[];
    }>,
): BlockWitnesses {
    return Object.freeze(rawWitnesses.map((rawWitness) => new BlockWitness(rawWitness)));
}
