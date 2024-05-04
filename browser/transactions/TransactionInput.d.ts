import { ScriptSig } from '@btc-vision/bsi-bitcoin-rpc';
export interface ITransactionInput {
    readonly originalTransactionId: string | undefined;
    readonly outputTransactionIndex: number | undefined;
    readonly scriptSignature: ScriptSig | undefined;
    readonly sequenceId: number;
    readonly transactionInWitness?: string[];
}
export declare class TransactionInput implements ITransactionInput {
    readonly originalTransactionId: string | undefined;
    readonly outputTransactionIndex: number | undefined;
    readonly scriptSignature: ScriptSig | undefined;
    readonly sequenceId: number;
    readonly transactionInWitness: string[];
    constructor(data: ITransactionInput);
}
