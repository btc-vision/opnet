import { fromHex, script } from '@btc-vision/bitcoin';
import { ScriptPubKey } from '@btc-vision/bitcoin-rpc';

/**
 * Transaction output interface
 * @category ITransactions
 */
export interface ITransactionOutput {
    readonly index: number;
    readonly scriptPubKey: {
        hex: string;
        addresses?: string[];
        address?: string;
    };

    readonly value: string;
}

/**
 * Transaction output
 * @category Transactions
 */
export class TransactionOutput {
    public readonly value: bigint;
    public readonly index: number;

    public readonly scriptPubKey: ScriptPubKey;
    public readonly script: Array<number | Uint8Array> | null;

    constructor(data: ITransactionOutput) {
        this.value = this.convertValue(data.value);
        this.index = data.index;

        this.scriptPubKey = data.scriptPubKey;
        this.script = script.decompile(fromHex(this.scriptPubKey.hex));
    }

    private convertValue(value: string): bigint {
        return BigInt(value);
    }
}
