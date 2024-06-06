import { GenerationConstraints, WrappedGenerationParameters } from '../providers/interfaces/Generate.js';
export declare class WrappedGeneration implements WrappedGenerationParameters {
    readonly constraints: GenerationConstraints;
    readonly entities: string[];
    readonly keys: string[];
    readonly signature: string;
    readonly vault: string;
    constructor(params: WrappedGenerationParameters);
}
