export interface StrippedTransactionOutput {
    readonly value: bigint;
    readonly index: number;
    readonly flags: number;
    readonly scriptPubKey: Buffer | undefined;
    readonly to: string | undefined;
}

export interface StrippedTransactionOutputAPI {
    readonly value: string;
    readonly index: number;
    readonly to: string | undefined;
    readonly flags: number;
    readonly scriptPubKey: string | undefined;
}

export interface StrippedTransactionInput {
    readonly txId: Buffer;
    readonly outputIndex: number;
    readonly scriptSig: Buffer;

    readonly flags: number;
    readonly coinbase: Buffer | undefined;
}

export interface StrippedTransactionInputAPI {
    readonly txId: string;
    readonly outputIndex: number;
    readonly scriptSig: string;

    readonly coinbase: string | undefined;
    readonly flags: number;
}

export interface SimulatedTransaction {
    readonly inputs: StrippedTransactionInputAPI[];
    readonly outputs: StrippedTransactionOutputAPI[];
}

export interface ParsedSimulatedTransaction {
    readonly inputs: StrippedTransactionInput[];
    readonly outputs: StrippedTransactionOutput[];
}
