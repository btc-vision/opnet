import { ISpentUTXO, RawIUTXO } from '../../bitcoin/interfaces/IUTXO.js';
import { UTXOs } from '../../bitcoin/UTXOs.js';

/**
 * Unspent Transaction Output Manager
 * @cathegory Interfaces
 */

/**
 * Spent UTXO reference (used for filtering)
 * @interface SpentUTXORef
 */
export interface SpentUTXORef {
    readonly transactionId: string;
    readonly outputIndex: number;
}

/**
 * UTXOs Data (processed)
 * @interface IUTXOsData
 */
export interface IUTXOsData {
    readonly pending: UTXOs;
    readonly spentTransactions: SpentUTXORef[];
    readonly confirmed: UTXOs;
}

/**
 * Raw UTXOs Data from API response
 * @interface RawIUTXOsData
 */
export interface RawIUTXOsData {
    readonly pending: RawIUTXO[];
    readonly spentTransactions: ISpentUTXO[];
    readonly confirmed: RawIUTXO[];
    /** Array of raw transaction hex strings (base64 encoded) */
    readonly raw: string[];
}

/**
 * Get UTXO Parameters
 * @interface RequestUTXOsParams
 */
export interface RequestUTXOsParams {
    readonly address: string;
    readonly optimize?: boolean;
    readonly mergePendingUTXOs?: boolean;
    readonly filterSpentUTXOs?: boolean;
    readonly olderThan?: bigint;
    readonly isCSV?: boolean;
}

export interface RequestUTXOsParamsWithAmount extends RequestUTXOsParams {
    readonly amount: bigint;
    readonly throwErrors?: boolean;
    readonly csvAddress?: string;
    readonly maxUTXOs?: number;
    readonly throwIfUTXOsLimitReached?: boolean;
}

/**
 * Parameters for batch UTXO fetching with options.
 * Uses RequestUTXOsParams for individual address requests.
 * Note: mergePendingUTXOs and filterSpentUTXOs in individual requests are ignored;
 * use the top-level options instead.
 * @interface RequestMultipleUTXOsParams
 */
export interface RequestMultipleUTXOsParams {
    readonly requests: RequestUTXOsParams[];
    readonly mergePendingUTXOs?: boolean;
    readonly filterSpentUTXOs?: boolean;
}
