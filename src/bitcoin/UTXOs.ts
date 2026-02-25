import { fromBase64 } from '@btc-vision/bitcoin';
import { ScriptPubKey } from '@btc-vision/bitcoin-rpc';
import { IUTXO } from './interfaces/IUTXO.js';

/**
 * Unspent Transaction Output
 * @category Bitcoin
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

    /**
     * The non-witness UTXO data as a Uint8Array.
     * Lazily decoded from the base64 raw transaction data when first accessed.
     * Remains `undefined` when no raw data was provided.
     */
    public nonWitnessUtxo?: Uint8Array | string;

    public witnessScript?: Uint8Array | string;
    public redeemScript?: Uint8Array | string;

    public isCSV?: boolean;

    /**
     * Create a UTXO from raw interface data.
     * When raw transaction data is present, a lazy getter is installed on `nonWitnessUtxo`
     * that decodes the base64 data to a `Uint8Array` on first access and caches the result.
     *
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
        this.witnessScript = iUTXO.witnessScript;

        if (iUTXO.raw) {
            const raw = iUTXO.raw;
            let cached: Uint8Array | undefined;

            /**
             * Lazily decode the base64 raw transaction data to a Uint8Array on first access.
             * The decoded result is cached for subsequent accesses to avoid redundant decoding.
             */
            Object.defineProperty(this, 'nonWitnessUtxo', {
                get(): Uint8Array {
                    if (!cached) {
                        cached = fromBase64(raw);
                    }
                    return cached;
                },
                enumerable: true,
                configurable: true,
            });
        }
    }
}

/**
 * Array of Unspent Transaction Outputs
 * @category Bitcoin
 */
export type UTXOs = UTXO[];
