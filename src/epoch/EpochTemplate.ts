import { IEpochTemplate } from './interfaces/IEpoch.js';

export class EpochTemplate implements IEpochTemplate {
    public readonly epochNumber: string;
    public readonly epochTarget: string;

    constructor(data: IEpochTemplate) {
        this.epochNumber = data.epochNumber;
        this.epochTarget = data.epochTarget;
    }
}
