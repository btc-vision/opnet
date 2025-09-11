import { IUTXO } from '../../bitcoin/interfaces/IUTXO.js';
import { UTXOs } from '../../bitcoin/UTXOs.js';

/**
 * Unspent Transaction Output Manager
 * @cathegory Interfaces
 */

/**
 * UTXOs Data
 * @interface IUTXOsData
 */
export interface IUTXOsData {
    readonly pending: UTXOs;
    readonly spentTransactions: UTXOs;
    readonly confirmed: UTXOs;
}

export interface RawIUTXOsData {
    readonly pending: IUTXO[];
    readonly spentTransactions: IUTXO[];
    readonly confirmed: IUTXO[];
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
}
