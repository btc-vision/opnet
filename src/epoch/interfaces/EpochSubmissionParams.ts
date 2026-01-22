export interface EpochSubmissionParams {
    readonly epochNumber: bigint;
    readonly checksumRoot: Buffer;
    readonly salt: Buffer;
    readonly mldsaPublicKey: Buffer;
    readonly signature: Buffer;
    readonly graffiti?: Buffer;
}
