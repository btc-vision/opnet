import { ScriptPubKey } from '@btc-vision/bsi-bitcoin-rpc';
import { IUTXO } from './interfaces/IUTXO.js';
export declare class UTXO implements IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint;
    readonly scriptPubKey: ScriptPubKey;
    constructor(iUTXO: IUTXO);
}
export type UTXOs = UTXO[];
