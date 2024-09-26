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
    pending: UTXOs;
    spentTransactions: UTXOs;
    confirmed: UTXOs;
}
