import { ScriptPubKey } from '@btc-vision/bsi-bitcoin-rpc';

/**
 * Unspent Transaction Output
 * @cathegory Interfaces
 */
export interface IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint | string;
    readonly scriptPubKey: ScriptPubKey;
}

/**
 * Unspent Transaction Output
 * @cathegory Bitcoin
 */
export class UTXO implements IUTXO {
    public readonly transactionId: string;
    public readonly outputIndex: number;
    public readonly value: bigint;
    public readonly scriptPubKey: ScriptPubKey;

    public constructor(iUTXO: IUTXO) {
        this.transactionId = iUTXO.transactionId;
        this.outputIndex = iUTXO.outputIndex;

        this.value = BigInt(iUTXO.value);

        this.scriptPubKey = iUTXO.scriptPubKey;
    }
}

export type UTXOs = UTXO[];
