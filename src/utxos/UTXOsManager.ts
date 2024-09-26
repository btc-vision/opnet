import { JSONRpcProvider, UTXOs } from '../opnet.js';
import { IUTXOsData } from './interfaces/IUTXOsManager.js';

/**
 * Unspent Transaction Output Manager
 * @category Bitcoin
 */
export class UTXOsManager {
    private readonly provider: JSONRpcProvider;
    private spentUTXOs: UTXOs = [];
    private pendingUTXOs: UTXOs = [];

    constructor(provider: JSONRpcProvider) {
        this.provider = provider;
    }

    /**
     * Mark UTXOs as spent and track new UTXOs created by the transaction
     * @param {UTXOs} spent - The UTXOs that were spent
     * @param {UTXOs} newUTXOs - The new UTXOs created by the transaction
     */
    spentUTXO(spent: UTXOs, newUTXOs: UTXOs): void {
        this.pendingUTXOs = this.pendingUTXOs.filter(
            (utxo) =>
                !newUTXOs.some(
                    (newUtxo) =>
                        newUtxo.transactionId === utxo.transactionId &&
                        newUtxo.outputIndex === utxo.outputIndex,
                ),
        );

        this.spentUTXOs.push(...spent);

        newUTXOs.forEach((newUtxo) => {
            if (
                !this.spentUTXOs.some(
                    (spentUtxo) =>
                        spentUtxo.transactionId === newUtxo.transactionId &&
                        spentUtxo.outputIndex === newUtxo.outputIndex,
                )
            ) {
                this.pendingUTXOs.push(newUtxo);
            }
        });
    }

    /**
     * Clean the spent and pending UTXOs, allowing reset after transactions are built.
     */
    clean(): void {
        this.spentUTXOs = [];
        this.pendingUTXOs = [];
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

            let combinedUTXOs = fetchedData.confirmed;

            if (mergePendingUTXOs) {
                combinedUTXOs.push(...this.pendingUTXOs);
            }

            combinedUTXOs = combinedUTXOs.filter(
                (utxo) =>
                    !this.spentUTXOs.some(
                        (spent) =>
                            spent.transactionId === utxo.transactionId &&
                            spent.outputIndex === utxo.outputIndex,
                    ),
            );

            if (filterSpentUTXOs && fetchedData.spentTransactions.length > 0) {
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
     * @param {boolean} [mergePendingUTXOs=true] - Whether to merge pending UTXOs
     * @param {boolean} [filterSpentUTXOs=true] - Whether to filter out spent UTXOs
     * @returns {Promise<UTXOs>} The fetched UTXOs
     * @throws {Error} If something goes wrong
     */
    async getUTXOsForAmount(
        address: string,
        amount: bigint,
        optimize: boolean = true,
        mergePendingUTXOs: boolean = true,
        filterSpentUTXOs: boolean = true,
    ): Promise<UTXOs> {
        try {
            const combinedUTXOs = await this.getUTXOs({
                address,
                optimize,
                mergePendingUTXOs,
                filterSpentUTXOs,
            });

            let utxoUntilAmount: UTXOs = [];
            let currentValue = 0n;

            for (const utxo of combinedUTXOs) {
                currentValue += utxo.value;
                utxoUntilAmount.push(utxo);
                if (currentValue >= amount) {
                    break;
                }
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
