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
    public readonly nonWitnessUtxo?: Uint8Array | string;

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

        this.nonWitnessUtxo = fromBase64(iUTXO.raw);
    }
}

/**
 * Array of Unspent Transaction Outputs
 * @cathegory Bitcoin
 */
export type UTXOs = UTXO[];
