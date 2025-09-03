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
    public readonly nonWitnessUtxo?: Buffer | string;

    public witnessScript?: Buffer | string;
    public redeemScript?: Buffer | string;

    public isCSV?: boolean;

    public constructor(iUTXO: IUTXO, isCSV?: boolean) {
        this.transactionId = iUTXO.transactionId;
        this.outputIndex = iUTXO.outputIndex;
        this.isCSV = isCSV || false;

        this.value = BigInt(iUTXO.value);

        this.scriptPubKey = iUTXO.scriptPubKey;
        if (!iUTXO.raw) {
            throw new Error('Missing nonWitnessUtxo field in UTXO');
        }

        this.nonWitnessUtxo = Buffer.from(iUTXO.raw, 'base64');
    }
}

/**
 * Array of Unspent Transaction Outputs
 * @cathegory Bitcoin
 */
export type UTXOs = UTXO[];
