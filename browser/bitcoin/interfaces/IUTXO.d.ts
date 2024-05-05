import { ScriptPubKey } from '@btc-vision/bsi-bitcoin-rpc';
export interface IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint | string;
    readonly scriptPubKey: ScriptPubKey;
}
