import { GenerationConstraints, WrappedGenerationParameters } from '../providers/interfaces/Generate.js';


export class WrappedGeneration implements WrappedGenerationParameters {
    /** Generation constraints */
    readonly constraints: GenerationConstraints;

    /** Public trusted entities */
    readonly entities: string[];

    /** Public trusted keys */
    readonly keys: string[];

    /** OPNet Signature that verify the trusted keys and entities */
    readonly signature: string;

    /** Vault address (p2ms) */
    readonly vault: string;


    constructor(params: WrappedGenerationParameters) {
        this.constraints = params.constraints;
        this.entities = params.entities;
        this.keys = params.keys;
        this.signature = params.signature;
        this.vault = params.vault;
    }
}
