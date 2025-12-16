import { Address } from '@btc-vision/transaction';
import { stringToBuffer } from '../utils/StringToBuffer.js';
import { IEpoch, IEpochMiner, RawEpoch, RawEpochMiner } from './interfaces/IEpoch.js';

export class EpochMiner implements IEpochMiner {
    public readonly solution: Buffer;
    public readonly publicKey: Address;
    public readonly salt: Buffer;
    public readonly graffiti?: Buffer;

    constructor(data: RawEpochMiner) {
        this.solution = stringToBuffer(data.solution);

        this.publicKey = Address.fromString(data.mldsaPublicKey, data.legacyPublicKey);

        this.salt = stringToBuffer(data.salt);
        this.graffiti = data.graffiti ? stringToBuffer(data.graffiti) : undefined;
    }
}

export class Epoch implements IEpoch {
    public readonly epochNumber: bigint;
    public readonly epochHash: Buffer;
    public readonly epochRoot: Buffer;
    public readonly startBlock: bigint;
    public readonly endBlock: bigint;
    public readonly difficultyScaled: bigint;
    public readonly minDifficulty?: string;
    public readonly targetHash: Buffer;
    public readonly proposer: EpochMiner;
    public readonly proofs: readonly Buffer[];

    constructor(data: RawEpoch) {
        this.epochNumber = BigInt(data.epochNumber);
        this.epochHash = stringToBuffer(data.epochHash);
        this.epochRoot = stringToBuffer(data.epochRoot);
        this.startBlock = BigInt(data.startBlock);
        this.endBlock = BigInt(data.endBlock);
        this.difficultyScaled = BigInt(data.difficultyScaled);
        this.minDifficulty = data.minDifficulty;
        this.targetHash = stringToBuffer(data.targetHash);
        this.proposer = new EpochMiner(data.proposer);
        this.proofs = Object.freeze(data.proofs.map((proof) => stringToBuffer(proof)));
    }
}
