import { stringToBuffer } from '../utils/StringToBuffer.js';
import { ISubmittedEpoch, RawSubmittedEpoch, SubmissionStatus } from './interfaces/IEpoch.js';

export class SubmittedEpoch implements ISubmittedEpoch {
    public readonly epochNumber: bigint;
    public readonly submissionHash: Uint8Array;
    public readonly difficulty: number;
    public readonly timestamp: Date;
    public readonly status: SubmissionStatus;
    public readonly message?: string;

    constructor(data: RawSubmittedEpoch) {
        this.epochNumber = BigInt(data.epochNumber);
        this.submissionHash = stringToBuffer(data.submissionHash);
        this.difficulty = data.difficulty;
        this.timestamp =
            typeof data.timestamp === 'number' ? new Date(data.timestamp) : data.timestamp;

        this.status = data.status;
        this.message = data.message;
    }
}
