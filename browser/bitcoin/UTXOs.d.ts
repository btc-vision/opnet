import { ScriptPubKey } from '@btc-vision/bsi-bitcoin-rpc';
export interface IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint | string;
    readonly scriptPubKey: ScriptPubKey;
}
export declare class UTXO implements IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint;
    readonly scriptPubKey: ScriptPubKey;
    constructor(iUTXO: IUTXO);
}
export type UTXOs = UTXO[];
