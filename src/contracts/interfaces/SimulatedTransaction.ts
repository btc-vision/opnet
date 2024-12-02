export interface StrippedTransactionOutput {
    readonly value: bigint;
    readonly index: number;
    readonly to: string;
}

export interface StrippedTransactionOutputAPI {
    readonly value: string;
    readonly index: number;
    readonly to: string;
}

export interface StrippedTransactionInput {
    readonly txId: Buffer;
    readonly outputIndex: number;
    readonly scriptSig: Buffer;
}

export interface StrippedTransactionInputAPI {
    readonly txId: string;
    readonly outputIndex: number;
    readonly scriptSig: string;
}

export interface SimulatedTransaction {
    readonly inputs: StrippedTransactionInputAPI[];
    readonly outputs: StrippedTransactionOutputAPI[];
}

export interface ParsedSimulatedTransaction {
    readonly inputs: StrippedTransactionInput[];
    readonly outputs: StrippedTransactionOutput[];
}
