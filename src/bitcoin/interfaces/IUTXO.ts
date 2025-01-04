import { ScriptPubKey } from '@btc-vision/bitcoin-rpc';

/**
 * Unspent Transaction Output
 * @cathegory Interfaces
 */
export interface IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint | string;
    readonly scriptPubKey: ScriptPubKey;
    readonly raw: string;
}
