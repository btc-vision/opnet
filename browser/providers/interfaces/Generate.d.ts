export declare enum GenerateTarget {
    WRAP = 0
}
export interface GenerationConstraints {
    readonly timestamp: number;
    readonly version: string;
    readonly minimum: number;
    readonly transactionMinimum: number;
    readonly minimumValidatorTransactionGeneration: number;
    readonly maximumValidatorPerTrustedEntities: number;
}
export interface WrappedGenerationParameters {
    readonly keys: string[];
    readonly vault: string;
    readonly entities: string[];
    readonly signature: string;
    readonly constraints: GenerationConstraints;
}
export type GenerationParameters = WrappedGenerationParameters;
