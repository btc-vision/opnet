export interface StrippedTransactionOutput {
    readonly value: bigint;
    readonly index: number;
    readonly flags: number;
    readonly scriptPubKey?: Uint8Array;
    readonly to?: string;
}

export interface StrippedTransactionOutputAPI {
    readonly value: string;
    readonly index: number;
    readonly to?: string;
    readonly flags: number;
    readonly scriptPubKey?: string;
}

export interface StrippedTransactionInput {
    readonly txId: Uint8Array;
    readonly outputIndex: number;
    readonly scriptSig: Uint8Array;

    readonly witnesses: Uint8Array[];

    readonly flags: number;
    readonly coinbase?: Uint8Array;
}

export interface StrippedTransactionInputAPI {
    readonly txId: string;
    readonly outputIndex: number;
    readonly scriptSig: string;

    readonly witnesses: string[];

    readonly coinbase?: string;
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
