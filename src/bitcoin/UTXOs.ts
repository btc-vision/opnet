import { ScriptPubKey } from '@btc-vision/bsi-bitcoin-rpc';

export interface IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint | string;
    readonly scriptPubKey: ScriptPubKey;
}

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
