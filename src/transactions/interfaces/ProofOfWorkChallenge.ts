export interface ProofOfWorkChallenge {
    readonly preimage: Uint8Array;
    readonly reward: bigint;
    readonly difficulty?: bigint;
    readonly version?: number;
}

export interface RawProofOfWorkChallenge {
    readonly preimage: string;
    readonly reward: string;
    readonly difficulty?: string;
    readonly version?: number;
}
