import { Address } from '@btc-vision/transaction';

export interface IEpochMiner {
    readonly solution: Buffer;
    readonly publicKey: Address;
    readonly salt: Buffer;
    readonly graffiti?: Buffer;
}

export interface IEpoch {
    readonly epochNumber: bigint;
    readonly epochHash: Buffer;
    readonly epochRoot: Buffer;
    readonly startBlock: bigint;
    readonly endBlock: bigint;
    readonly difficultyScaled: bigint;
    readonly minDifficulty?: string;
    readonly targetHash: Buffer;
    readonly proposer: IEpochMiner;
    readonly proofs: readonly Buffer[];
}

export interface RawEpochMiner {
    readonly solution: string;
    readonly mldsaPublicKey: string;
    readonly legacyPublicKey: string;
    readonly salt: string;
    readonly graffiti?: string;
}

export interface RawEpoch {
    readonly epochNumber: string;
    readonly epochHash: string;
    readonly epochRoot: string;
    readonly startBlock: string;
    readonly endBlock: string;
    readonly difficultyScaled: string;
    readonly minDifficulty?: string;
    readonly targetHash: string;
    readonly proposer: RawEpochMiner;
    readonly proofs: readonly string[];
}

export interface RawEpochSubmission {
    readonly submissionTxId: string;
    readonly submissionTxHash: string;
    readonly submissionHash: string;
    readonly confirmedAt: string;
    readonly epochProposed: RawEpochMiner;
}

export interface IEpochSubmission {
    readonly submissionTxId: Buffer;
    readonly submissionTxHash: Buffer;
    readonly submissionHash: Buffer;
    readonly confirmedAt: string;
    readonly epochProposed: IEpochMiner;
}

export interface IEpochWithSubmissions extends IEpoch {
    readonly submissions?: readonly IEpochSubmission[];
}

export interface RawEpochWithSubmissions extends RawEpoch {
    readonly submissions?: readonly RawEpochSubmission[];
}

export interface RawEpochTemplate {
    readonly epochNumber: string;
    readonly epochTarget: string;
}

export interface IEpochTemplate {
    readonly epochNumber: bigint;
    readonly epochTarget: Buffer;
}

export enum SubmissionStatus {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export interface RawSubmittedEpoch {
    readonly epochNumber: string;
    readonly submissionHash: string;
    readonly difficulty: number;
    readonly timestamp: number | Date;
    readonly status: SubmissionStatus;
    readonly message?: string;
}

export interface ISubmittedEpoch {
    readonly epochNumber: bigint;
    readonly submissionHash: Buffer;
    readonly difficulty: number;
    readonly timestamp: Date;

    readonly status: SubmissionStatus;
    readonly message?: string;
}
