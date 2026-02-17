import { Address } from '@btc-vision/transaction';

export interface IEpochMiner {
    readonly solution: Uint8Array;
    readonly publicKey: Address;
    readonly salt: Uint8Array;
    readonly graffiti?: Uint8Array;
}

export interface IEpoch {
    readonly epochNumber: bigint;
    readonly epochHash: Uint8Array;
    readonly epochRoot: Uint8Array;
    readonly startBlock: bigint;
    readonly endBlock: bigint;
    readonly difficultyScaled: bigint;
    readonly minDifficulty?: string;
    readonly targetHash: Uint8Array;
    readonly proposer: IEpochMiner;
    readonly proofs: readonly Uint8Array[];
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
    readonly submissionTxId: Uint8Array;
    readonly submissionTxHash: Uint8Array;
    readonly submissionHash: Uint8Array;
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
    readonly epochTarget: Uint8Array;
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
    readonly submissionHash: Uint8Array;
    readonly difficulty: number;
    readonly timestamp: Date;

    readonly status: SubmissionStatus;
    readonly message?: string;
}
