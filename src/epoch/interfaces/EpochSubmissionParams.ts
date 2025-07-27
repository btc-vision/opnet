import { Address } from '@btc-vision/transaction';

export interface EpochSubmissionParams {
    readonly epochNumber: bigint;
    readonly targetHash: Buffer;
    readonly salt: Buffer;
    readonly publicKey: Address;
    readonly graffiti?: Buffer;
}
