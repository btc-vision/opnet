import { ScriptPubKey } from '@btc-vision/bitcoin-rpc';

/**
 * Unspent Transaction Output
 * @cathegory Interfaces
 */
export interface RawIUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint | string;
    readonly scriptPubKey: ScriptPubKey;
    /**
     * Index into the raw transactions array.
     * The actual raw transaction hex is in the separate `raw[]` array at this index.
     */
    readonly raw?: number;
}

/**
 * Unspent Transaction Output
 * @cathegory Interfaces
 */
export interface IUTXO extends Omit<RawIUTXO, 'raw'> {
    /**
     * Index into the raw transactions array.
     * The actual raw transaction hex is in the separate `raw[]` array at this index.
     */
    readonly raw: string;

    readonly witnessScript?: string | Uint8Array;
}

/**
 * Spent Transaction Output (minimal info)
 * @cathegory Interfaces
 */
export interface ISpentUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
}
