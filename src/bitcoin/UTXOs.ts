import { ScriptPubKey } from '@btc-vision/bsi-bitcoin-rpc';
import { IUTXO } from './interfaces/IUTXO.js';

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

/**
 * Array of Unspent Transaction Outputs
 * @cathegory Bitcoin
 */
export type UTXOs = UTXO[];
