import { UTXOs } from '../../bitcoin/UTXOs';

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

/**
 * Get UTXO Parameters
 * @interface RequestUTXOsParams
 */
export interface RequestUTXOsParams {
    readonly address: string;
    readonly optimize?: boolean;
    readonly mergePendingUTXOs?: boolean;
    readonly filterSpentUTXOs?: boolean;
}

export interface RequestUTXOsParamsWithAmount extends RequestUTXOsParams {
    readonly amount: bigint;
}
