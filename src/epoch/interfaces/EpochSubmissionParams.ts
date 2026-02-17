export interface EpochSubmissionParams {
    readonly epochNumber: bigint;
    readonly checksumRoot: Uint8Array;
    readonly salt: Uint8Array;
    readonly mldsaPublicKey: Uint8Array;
    readonly signature: Uint8Array;
    readonly graffiti?: Uint8Array;
}
