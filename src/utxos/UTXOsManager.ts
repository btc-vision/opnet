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
     * Get UTXOs with configurable options
     * @param {object} options - The UTXO fetch options
     * @param {string} options.address - The address to get the UTXOs
     * @param {boolean} [options.optimize=true] - Whether to optimize the UTXOs
     * @param {boolean} [options.mergePendingUTXOs=true] - Whether to merge pending UTXOs
     * @param {boolean} [options.filterSpentUTXOs=true] - Whether to filter out spent UTXOs
     * @returns {Promise<UTXOs>} The UTXOs
     * @throws {Error} If something goes wrong
     */
    async getUTXOs({
        address,
        optimize = true,
        mergePendingUTXOs = true,
        filterSpentUTXOs = true,
    }: {
        address: string;
        optimize?: boolean;
        mergePendingUTXOs?: boolean;
        filterSpentUTXOs?: boolean;
    }): Promise<UTXOs> {
        try {
            const fetchedData = await this.fetchUTXOs(address, optimize);

            let combinedUTXOs = [...fetchedData.confirmed];

            if (mergePendingUTXOs) {
                combinedUTXOs = [...combinedUTXOs, ...fetchedData.pending];
            }

            if (filterSpentUTXOs) {
                combinedUTXOs = combinedUTXOs.filter(
                    (utxo) =>
                        !fetchedData.spentTransactions.some(
                            (spent) =>
                                spent.transactionId === utxo.transactionId &&
                                spent.outputIndex === utxo.outputIndex,
                        ),
                );
            }

            return combinedUTXOs;
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
            const combinedUTXOs = await this.getUTXOs({
                address,
                optimize: true,
                mergePendingUTXOs: true,
                filterSpentUTXOs: true,
            });

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

    /**
     * Generic method to fetch all UTXOs in one call (confirmed, pending, and spent)
     * @param {string} address The address to fetch UTXOs for
     * @param {boolean} optimize Optimize the UTXOs
     * @returns {Promise<IUTXOsData>} The fetched UTXOs data
     * @throws {Error} If something goes wrong
     */
    private async fetchUTXOs(address: string, optimize: boolean = false): Promise<IUTXOsData> {
        try {
            const url = `${this.provider.url}/api/v1/address/utxos?address=${address}&optimize=${optimize}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error('Failed to fetch UTXOs, API response not OK');
            }

            const data = (await res.json()) as IUTXOsData;

            if (!data) {
                throw new Error('Invalid response received for UTXOs');
            }

            return {
                confirmed: data.confirmed || [],
                pending: data.pending || [],
                spentTransactions: data.spentTransactions || [],
            };
        } catch (e) {
            console.error(e);
            return { confirmed: [], pending: [], spentTransactions: [] };
        }
    }
}

async function test() {
    const provider = new JSONRpcProvider('https://regtest.opnet.org/');
    const utxosManager = new UTXOsManager(provider);

    const address = 'bcrt1p823gdnqvk8a90f8cu30w8ywvk29uh8txtqqnsmk6f5ktd7hlyl0qupwyqz';
    const utxos = await utxosManager.getUTXOsForAmount(address, 1000n);
    console.log(utxos);
}

test();
