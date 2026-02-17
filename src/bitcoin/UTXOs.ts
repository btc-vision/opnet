import { fromBase64 } from '@btc-vision/bitcoin';
import { ScriptPubKey } from '@btc-vision/bitcoin-rpc';
import { IUTXO } from './interfaces/IUTXO.js';

/**
 * Unspent Transaction Output
 * @cathegory Bitcoin
 */
export class UTXO implements Omit<IUTXO, 'raw'> {
    public readonly transactionId: string;
    public readonly outputIndex: number;
    public readonly value: bigint;
    public readonly scriptPubKey: ScriptPubKey;

    /**
     * The raw transaction data for this UTXO, encoded as a base64 string.
     */
    public readonly nonWitnessUtxoBase64?: string;

    public witnessScript?: Uint8Array | string;
    public redeemScript?: Uint8Array | string;

    public isCSV?: boolean;

    /**
     * Create a UTXO from raw interface data
     * @param iUTXO - The raw UTXO data from the API
     * @param isCSV - Whether this is a CSV UTXO
     */
    public constructor(iUTXO: IUTXO, isCSV?: boolean) {
        this.transactionId = iUTXO.transactionId;
        this.outputIndex = iUTXO.outputIndex;
        this.isCSV = isCSV || false;

        this.value = BigInt(iUTXO.value);

        this.scriptPubKey = iUTXO.scriptPubKey;
        this.nonWitnessUtxoBase64 = iUTXO.raw;
    }

    private _nonWitnessUtxo?: Uint8Array;

    /**
     * Get the non-witness UTXO data as a Uint8Array.
     * This is the full raw transaction data for the UTXO, which is required for signing non-segwit inputs.
     *
     * If the non-witness UTXO data is not available, an error will be thrown.
     * If the data is a base64 string, it will be decoded to a Uint8Array.
     */
    public get nonWitnessUtxo(): Uint8Array | string | undefined {
        if (!this.nonWitnessUtxoBase64) {
            throw new Error('Non-witness UTXO data is not available for this UTXO');
        }

        if (!this._nonWitnessUtxo) {
            this._nonWitnessUtxo = fromBase64(this.nonWitnessUtxoBase64);
        }

        return this._nonWitnessUtxo;
    }
}

/**
 * Array of Unspent Transaction Outputs
 * @cathegory Bitcoin
 */
export type UTXOs = UTXO[];
