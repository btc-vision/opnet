import { stringToBuffer } from '../utils/StringToBuffer.js';
import { Epoch, EpochMiner } from './Epoch.js';
import {
    IEpochSubmission,
    IEpochWithSubmissions,
    RawEpochSubmission,
    RawEpochWithSubmissions,
} from './interfaces/IEpoch.js';

export class EpochSubmission implements IEpochSubmission {
    public readonly submissionTxId: Uint8Array;
    public readonly submissionTxHash: Uint8Array;
    public readonly submissionHash: Uint8Array;
    public readonly confirmedAt: string;
    public readonly epochProposed: EpochMiner;

    constructor(data: RawEpochSubmission) {
        this.submissionTxId = stringToBuffer(data.submissionTxId);
        this.submissionTxHash = stringToBuffer(data.submissionTxHash);
        this.submissionHash = stringToBuffer(data.submissionHash);
        this.confirmedAt = data.confirmedAt;
        this.epochProposed = new EpochMiner(data.epochProposed);
    }
}

export class EpochWithSubmissions extends Epoch implements IEpochWithSubmissions {
    public readonly submissions?: readonly EpochSubmission[];

    constructor(data: RawEpochWithSubmissions) {
        super(data);
        if (data.submissions) {
            this.submissions = Object.freeze(
                data.submissions.map((sub) => new EpochSubmission(sub)),
            );
        }
    }
}
