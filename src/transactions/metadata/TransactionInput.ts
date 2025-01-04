import { ScriptSig } from '@btc-vision/bitcoin-rpc';

/**
 * Transaction input interface
 * @category ITransactions
 */
export interface ITransactionInput {
    readonly originalTransactionId: string | undefined;
    readonly outputTransactionIndex: number | undefined;

    readonly scriptSignature: ScriptSig | undefined;
    readonly sequenceId: number;

    readonly transactionInWitness?: string[];
}

/**
 * Transaction input
 * @category ITransactions
 */
export class TransactionInput implements ITransactionInput {
    public readonly originalTransactionId: string | undefined;
    public readonly outputTransactionIndex: number | undefined;

    public readonly scriptSignature: ScriptSig | undefined;
    public readonly sequenceId: number;

    public readonly transactionInWitness: string[] = [];

    constructor(data: ITransactionInput) {
        this.originalTransactionId = data.originalTransactionId;
        this.outputTransactionIndex = data.outputTransactionIndex;

        this.scriptSignature = data.scriptSignature;

        this.sequenceId = data.sequenceId;
        this.transactionInWitness = data.transactionInWitness || [];
    }
}
