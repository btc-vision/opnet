import { stringToBuffer } from '../utils/StringToBuffer.js';
import { IEpochTemplate, RawEpochTemplate } from './interfaces/IEpoch.js';

export class EpochTemplate implements IEpochTemplate {
    public readonly epochNumber: bigint;
    public readonly epochTarget: Uint8Array;

    constructor(data: RawEpochTemplate) {
        this.epochNumber = BigInt(data.epochNumber);
        this.epochTarget = stringToBuffer(data.epochTarget);
    }
}
