import { IUTXO } from '../bitcoin/interfaces/IUTXO.js';
import { UTXO, UTXOs } from '../bitcoin/UTXOs.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { JsonRpcPayload } from '../providers/interfaces/JSONRpc.js';
import { JSONRpcMethods } from '../providers/interfaces/JSONRpcMethods.js';
import { JsonRpcResult } from '../providers/interfaces/JSONRpcResult.js';
import {
    IUTXOsData,
    RequestUTXOsParams,
    RequestUTXOsParamsWithAmount,
} from './interfaces/IUTXOsManager.js';

const AUTO_PURGE_AFTER: number = 1000 * 60; // 1 minutes

/**
 * Unspent Transaction Output Manager
 * @category Bitcoin
 */
export class UTXOsManager {
    private spentUTXOs: UTXOs = [];
    private pendingUTXOs: UTXOs = [];

    private lastCleanup: number = Date.now();

    public constructor(private readonly provider: AbstractRpcProvider) {}

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
        this.lastCleanup = Date.now();
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
     * @param {boolean} [options.throwErrors=false] - Whether to throw errors if UTXOs are insufficient
     * @returns {Promise<UTXOs>} The fetched UTXOs
     * @throws {Error} If something goes wrong
     */
    public async getUTXOsForAmount({
        address,
        amount,
        optimize = true,
        mergePendingUTXOs = true,
        filterSpentUTXOs = true,
        throwErrors = false,
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

        if (currentValue < amount && throwErrors) {
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
        if (Date.now() - this.lastCleanup > AUTO_PURGE_AFTER) {
            this.clean();
        }

        const addressStr: string = address.toString();
        const payload: JsonRpcPayload = this.provider.buildJsonRpcPayload(
            JSONRpcMethods.GET_UTXOS,
            [addressStr, optimize],
        );

        const rawUXTOs: JsonRpcResult = await this.provider.callPayloadSingle(payload);
        if ('error' in rawUXTOs) {
            throw new Error(`Error fetching block: ${rawUXTOs.error}`);
        }

        const result: IUTXOsData = (rawUXTOs.result as IUTXOsData) || {
            confirmed: [],
            pending: [],
            spentTransactions: [],
        };

        return {
            confirmed: result.confirmed.map((utxo: IUTXO) => {
                return new UTXO(utxo);
            }),
            pending: result.pending.map((utxo: IUTXO) => {
                return new UTXO(utxo);
            }),
            spentTransactions: result.spentTransactions.map((utxo: IUTXO) => {
                return new UTXO(utxo);
            }),
        };
    }
}
