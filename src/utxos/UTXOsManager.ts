import { JSONRpcProvider, RequestUTXOsParams, RequestUTXOsParamsWithAmount, UTXOs } from '../opnet.js';
import { IUTXOsData } from './interfaces/IUTXOsManager.js';

/**
 * Unspent Transaction Output Manager
 * @category Bitcoin
 */
export class UTXOsManager {
    private spentUTXOs: UTXOs = [];
    private pendingUTXOs: UTXOs = [];

    public constructor(private readonly provider: JSONRpcProvider) {}

    /**
     * Mark UTXOs as spent and track new UTXOs created by the transaction
     * @param {UTXOs} spent - The UTXOs that were spent
     * @param {UTXOs} newUTXOs - The new UTXOs created by the transaction
     */
    public spentUTXO(spent: UTXOs, newUTXOs: UTXOs): void {
        this.pendingUTXOs = this.pendingUTXOs.filter(
            (utxo) =>
                !spent.some(
                    (spentUtxo) =>
                        spentUtxo.transactionId === utxo.transactionId &&
                        spentUtxo.outputIndex === utxo.outputIndex,
                ),
        );

        this.spentUTXOs.push(...spent);
        this.pendingUTXOs.push(...newUTXOs);
    }

    /**
     * Clean the spent and pending UTXOs, allowing reset after transactions are built.
     */
    public clean(): void {
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
    public async getUTXOs({
        address,
        optimize = true,
        mergePendingUTXOs = true,
        filterSpentUTXOs = true,
    }: RequestUTXOsParams): Promise<UTXOs> {
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
    }

    /**
     * Fetch UTXOs for the amount needed, merging from pending and confirmed UTXOs
     * @param {object} options The UTXO fetch options
     * @param {string} options.address The address to fetch UTXOs from
     * @param {bigint} options.amount The amount of UTXOs to retrieve
     * @param {boolean} [options.optimize=true] Optimize the UTXOs, removes small UTXOs
     * @param {boolean} [options.mergePendingUTXOs=true] - Whether to merge pending UTXOs
     * @param {boolean} [options.filterSpentUTXOs=true] - Whether to filter out spent UTXOs
     * @returns {Promise<UTXOs>} The fetched UTXOs
     * @throws {Error} If something goes wrong
     */
    public async getUTXOsForAmount({
        address,
        amount,
        optimize = true,
        mergePendingUTXOs = true,
        filterSpentUTXOs = true,
    }: RequestUTXOsParamsWithAmount): Promise<UTXOs> {
        const combinedUTXOs = await this.getUTXOs({
            address,
            optimize,
            mergePendingUTXOs,
            filterSpentUTXOs,
        });

        const utxoUntilAmount: UTXOs = [];
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
    }

    /**
     * Generic method to fetch all UTXOs in one call (confirmed, pending, and spent)
     * @param {string} address The address to fetch UTXOs for
     * @param {boolean} optimize Optimize the UTXOs
     * @returns {Promise<IUTXOsData>} The fetched UTXOs data
     * @throws {Error} If something goes wrong
     */
    private async fetchUTXOs(address: string, optimize: boolean = false): Promise<IUTXOsData> {
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
    }
}
