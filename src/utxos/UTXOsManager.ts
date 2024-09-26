import { JSONRpcProvider, UTXOs } from '../opnet.js';
import { IUTXOsData } from './interfaces/IUTXOsManager.js';

/**
 * Unspent Transaction Output Manager
 * @category Bitcoin
 */
export class UTXOsManager {
    private readonly provider: JSONRpcProvider;

    constructor(provider: JSONRpcProvider) {
        this.provider = provider;
    }

    /**
     * Get pending UTXOs for a given address
     * @param {string} address The address to get the pending UTXOs
     * @param {boolean} optimize Optimize the UTXOs
     * @returns {Promise<UTXOs>} The pending UTXOs
     * @throws {Error} If something goes wrong
     */
    async getPendingUTXOs(address: string, optimize: boolean = false): Promise<UTXOs> {
        try {
            const res = await fetch(
                `${this.provider.url}/api/v1/address/utxos?address=${address}&optimize=${optimize}&pending=true`,
            );
            if (!res.ok) {
                throw new Error('Failed to get pending UTXOs, API response not OK');
            }

            const data = (await res.json()) as IUTXOsData;

            if (!data || !data.pending) {
                throw new Error('Failed to get pending UTXOs, invalid response');
            }

            return data.pending;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    /**
     * Get spent UTXOs for a given address
     * @param {string} address The address to get the spent UTXOs
     * @param {boolean} optimize Optimize the UTXOs
     * @returns {Promise<UTXOs>} The spent UTXOs
     * @throws {Error} If something goes wrong
     */
    async getSpentUTXOs(address: string, optimize: boolean = false): Promise<UTXOs> {
        try {
            const res = await fetch(
                `${this.provider.url}/api/v1/address/utxos?address=${address}&optimize=${optimize}&spent=true`,
            );
            if (!res.ok) {
                throw new Error('Failed to get spent UTXOs, API response not OK');
            }

            const data = (await res.json()) as IUTXOsData;

            if (!data || !data.spentTransactions) {
                throw new Error('Failed to get spent UTXOs, invalid response');
            }

            return data.spentTransactions;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    /**
     * Get UTXOs for a given address
     * @param {string} address The address to get the UTXOs
     * @param {boolean} optimize Optimize the UTXOs
     * @returns {Promise<UTXOs>} The UTXOs
     * @throws {Error} If something goes wrong
     */
    async getUTXOs(address: string, optimize: boolean = false): Promise<UTXOs> {
        try {
            const res = await fetch(
                `${this.provider.url}/api/v1/address/utxos?address=${address}&optimize=${optimize}`,
            );
            if (!res.ok) {
                throw new Error('Failed to get UTXOs, API response not OK');
            }

            const data = (await res.json()) as IUTXOsData;

            if (!data || !data.confirmed) {
                throw new Error('Failed to get UTXOs, invalid response');
            }

            return data.confirmed;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    /**
     * Fetch UTXOs for the amount needed, merging from pending and confirmed UTXOs
     * @param {string} address The address to fetch UTXOs from
     * @param {bigint} amount The amount of UTXOs to retrieve
     * @returns {Promise<UTXOs>} The fetched UTXOs
     * @throws {Error} If something goes wrong
     */
    async getUTXOsForAmount(address: string, amount: bigint): Promise<UTXOs> {
        try {
            const confirmedUTXOs = await this.getUTXOs(address);
            const pendingUTXOs = await this.getPendingUTXOs(address);

            const combinedUTXOs = [...new Set([...confirmedUTXOs, ...pendingUTXOs])];

            let utxoUntilAmount: UTXOs = [];
            let currentValue = 0n;

            for (const utxo of combinedUTXOs) {
                if (currentValue >= amount) {
                    break;
                }
                currentValue += utxo.value;
                utxoUntilAmount.push(utxo);
            }

            if (currentValue < amount) {
                throw new Error(
                    `Insufficient UTXOs to cover amount. Available: ${currentValue}, Needed: ${amount}`,
                );
            }

            return utxoUntilAmount;
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}
