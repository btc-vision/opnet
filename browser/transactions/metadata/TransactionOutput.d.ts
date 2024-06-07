/// <reference types="node" />
import { ScriptPubKey } from '@btc-vision/bsi-bitcoin-rpc';
export interface ITransactionOutput {
    readonly index: number;
    readonly scriptPubKey: {
        hex: string;
        addresses?: string[];
        address?: string;
    };
    readonly value: string;
}
export declare class TransactionOutput {
    readonly value: bigint;
    readonly index: number;
    readonly scriptPubKey: ScriptPubKey;
    readonly script: Array<number | Buffer> | null;
    constructor(data: ITransactionOutput);
    private convertValue;
}
