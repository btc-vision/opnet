import { IUTXO } from '../bitcoin/interfaces/IUTXO.js';
import { UTXO, UTXOs } from '../bitcoin/UTXOs.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { JsonRpcPayload } from '../providers/interfaces/JSONRpc.js';
import { JSONRpcMethods } from '../providers/interfaces/JSONRpcMethods.js';
import { JsonRpcResult } from '../providers/interfaces/JSONRpcResult.js';
import {
    IUTXOsData,
    RawIUTXOsData,
    RequestUTXOsParams,
    RequestUTXOsParamsWithAmount,
} from './interfaces/IUTXOsManager.js';

const AUTO_PURGE_AFTER: number = 1000 * 60; // 1 minute
const FETCH_COOLDOWN = 10000; // 10 seconds
const MEMPOOL_CHAIN_LIMIT = 25;

/**
 * Manages unspent transaction outputs (UTXOs).
 * @category Bitcoin
 */
export class UTXOsManager {
    private spentUTXOs: UTXOs = [];
    private pendingUTXOs: UTXOs = [];

    /**
     * Tracks the current “depth” of each pending UTXO:
     *   - Key: `${transactionId}:${outputIndex}`
     *   - Value: number (the unconfirmed chain depth).
     */
    private pendingUtxoDepth: Record<string, number> = {};

    private lastCleanup: number = Date.now();

    /**
     * Cache for recently fetched data + timestamp
     */
    private lastFetchTimestamp: number = 0;
    private lastFetchedData: IUTXOsData | null = null;

    public constructor(private readonly provider: AbstractRpcProvider) {}

    /**
     * Mark UTXOs as spent and track new UTXOs created by the transaction.
     *
     * Enforces a mempool chain limit of 25 unconfirmed transaction descendants.
     *
     * @param {UTXOs} spent - The UTXOs that were spent.
     * @param {UTXOs} newUTXOs - The new UTXOs created by the transaction.
     * @throws {Error} If adding the new unconfirmed outputs would exceed the mempool chain limit.
     */
    public spentUTXO(spent: UTXOs, newUTXOs: UTXOs): void {
        const utxoKey = (u: UTXO) => `${u.transactionId}:${u.outputIndex}`;

        // Remove any spent UTXOs from pending
        this.pendingUTXOs = this.pendingUTXOs.filter((utxo) => {
            return !spent.some(
                (spentUtxo) =>
                    spentUtxo.transactionId === utxo.transactionId &&
                    spentUtxo.outputIndex === utxo.outputIndex,
            );
        });

        // Also remove from the depth map if they were pending
        for (const spentUtxo of spent) {
            const key = utxoKey(spentUtxo);
            delete this.pendingUtxoDepth[key];
        }

        // Add the spent UTXOs to the "spent" list
        this.spentUTXOs.push(...spent);

        // Determine the parent depth for new UTXOs. If a spent UTXO was pending,
        // it contributes to the chain depth. If it was confirmed, depth = 0 for that.
        let maxParentDepth = 0;
        for (const spentUtxo of spent) {
            const key = utxoKey(spentUtxo);
            // If it was an unconfirmed (pending) parent, capture its depth
            const parentDepth = this.pendingUtxoDepth[key] ?? 0;
            if (parentDepth > maxParentDepth) {
                maxParentDepth = parentDepth;
            }
        }

        const newDepth = maxParentDepth + 1;
        if (newDepth > MEMPOOL_CHAIN_LIMIT) {
            throw new Error(
                `too-long-mempool-chain, too many descendants for tx ... [limit: ${MEMPOOL_CHAIN_LIMIT}]`,
            );
        }

        // Now push the new UTXOs into pending; set their depth
        for (const nu of newUTXOs) {
            this.pendingUTXOs.push(nu);
            this.pendingUtxoDepth[utxoKey(nu)] = newDepth;
        }
    }

    /**
     * Clean the spent and pending UTXOs, allowing reset after transactions are built.
     */
    public clean(): void {
        this.spentUTXOs = [];
        this.pendingUTXOs = [];
        this.pendingUtxoDepth = {};
        this.lastCleanup = Date.now();

        // Also reset the fetch cache.
        this.lastFetchTimestamp = 0;
        this.lastFetchedData = null;
    }

    /**
     * Get UTXOs with configurable options.
     *
     * If the last UTXO fetch was less than 10 seconds ago, this returns cached data
     * rather than calling out to the provider again. Otherwise, it fetches fresh data.
     *
     * @param {object} options - The UTXO fetch options
     * @param {string} options.address - The address to get the UTXOs for
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
        const fetchedData = await this.maybeFetchUTXOs(address, optimize);

        // Helper function to create a unique key for UTXOs
        const utxoKey = (utxo: UTXO) => `${utxo.transactionId}:${utxo.outputIndex}`;

        // Prepare sets for quick lookups
        const pendingUTXOKeys = new Set(this.pendingUTXOs.map(utxoKey));
        const spentUTXOKeys = new Set(this.spentUTXOs.map(utxoKey));
        const fetchedSpentKeys = new Set(fetchedData.spentTransactions.map(utxoKey));

        // Start with confirmed UTXOs
        const combinedUTXOs: UTXO[] = [];
        const combinedKeysSet = new Set<string>();

        // Add confirmed UTXOs without duplicates
        for (const utxo of fetchedData.confirmed) {
            const key = utxoKey(utxo);
            if (!combinedKeysSet.has(key)) {
                combinedUTXOs.push(utxo);
                combinedKeysSet.add(key);
            }
        }

        // Merge pending UTXOs if requested
        if (mergePendingUTXOs) {
            // Add currently pending UTXOs without duplicates
            for (const utxo of this.pendingUTXOs) {
                const key = utxoKey(utxo);
                if (!combinedKeysSet.has(key)) {
                    combinedUTXOs.push(utxo);
                    combinedKeysSet.add(key);
                }
            }

            // Add fetched pending UTXOs that aren't already in pending or combined
            for (const utxo of fetchedData.pending) {
                const key = utxoKey(utxo);
                if (!pendingUTXOKeys.has(key) && !combinedKeysSet.has(key)) {
                    combinedUTXOs.push(utxo);
                    combinedKeysSet.add(key);
                }
            }
        }

        // Filter out UTXOs spent locally
        let finalUTXOs = combinedUTXOs.filter((utxo) => !spentUTXOKeys.has(utxoKey(utxo)));

        // Optionally filter out UTXOs that are known-spent in the fetch
        if (filterSpentUTXOs && fetchedSpentKeys.size > 0) {
            finalUTXOs = finalUTXOs.filter((utxo) => !fetchedSpentKeys.has(utxoKey(utxo)));
        }

        return finalUTXOs;
    }

    /**
     * Fetch UTXOs for a specific amount needed, merging from pending and confirmed UTXOs.
     *
     * @param {object} options The UTXO fetch options
     * @param {string} options.address The address to fetch UTXOs from
     * @param {bigint} options.amount The amount of UTXOs to retrieve
     * @param {boolean} [options.optimize=true] Optimize the UTXOs (e.g., remove dust)
     * @param {boolean} [options.mergePendingUTXOs=true] - Whether to merge pending UTXOs
     * @param {boolean} [options.filterSpentUTXOs=true] - Whether to filter out spent UTXOs
     * @param {boolean} [options.throwErrors=false] - Whether to throw errors if UTXOs are insufficient
     * @returns {Promise<UTXOs>} The fetched UTXOs
     * @throws {Error} If something goes wrong or if not enough UTXOs are available (when throwErrors=true)
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
            utxoUntilAmount.push(utxo);
            currentValue += utxo.value;
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
     * Checks if we need to fetch fresh UTXOs or can return the cached data.
     * - If less than 10s since last fetch, return cached data
     * - Otherwise, fetch new data from the provider
     */
    private async maybeFetchUTXOs(address: string, optimize: boolean): Promise<IUTXOsData> {
        const now = Date.now();
        const age = now - this.lastFetchTimestamp;

        // Purge after certain time
        if (now - this.lastCleanup > AUTO_PURGE_AFTER) {
            this.clean();
        }

        // If it's been less than FETCH_COOLDOWN ms, return cached data if available
        if (this.lastFetchedData && age < FETCH_COOLDOWN) {
            return this.lastFetchedData;
        }

        // Otherwise, fetch from the RPC
        this.lastFetchedData = await this.fetchUTXOs(address, optimize);
        this.lastFetchTimestamp = now;

        // Remove any pending UTXOs that have become confirmed or known spent
        this.syncPendingDepthWithFetched();

        return this.lastFetchedData;
    }

    /**
     * Generic method to fetch all UTXOs in one call (confirmed, pending, spent).
     */
    private async fetchUTXOs(address: string, optimize: boolean = false): Promise<IUTXOsData> {
        const addressStr: string = address.toString();
        const payload: JsonRpcPayload = this.provider.buildJsonRpcPayload(
            JSONRpcMethods.GET_UTXOS,
            [addressStr, optimize],
        );

        const rawUTXOs: JsonRpcResult = await this.provider.callPayloadSingle(payload);
        if ('error' in rawUTXOs) {
            throw new Error(`Error fetching block: ${rawUTXOs.error}`);
        }

        const result: RawIUTXOsData = (rawUTXOs.result as RawIUTXOsData) || {
            confirmed: [],
            pending: [],
            spentTransactions: [],
        };

        return {
            confirmed: result.confirmed.map((utxo: IUTXO) => new UTXO(utxo)),
            pending: result.pending.map((utxo: IUTXO) => new UTXO(utxo)),
            spentTransactions: result.spentTransactions.map((utxo: IUTXO) => new UTXO(utxo)),
        };
    }

    /**
     * Whenever we fetch new data, some pending UTXOs may have confirmed
     * or become known-spent. We remove them from pending state and depth map.
     */
    private syncPendingDepthWithFetched(): void {
        if (!this.lastFetchedData) {
            return;
        }

        const confirmedKeys = new Set(
            this.lastFetchedData.confirmed.map((u) => `${u.transactionId}:${u.outputIndex}`),
        );

        const spentKeys = new Set(
            this.lastFetchedData.spentTransactions.map(
                (u) => `${u.transactionId}:${u.outputIndex}`,
            ),
        );

        this.pendingUTXOs = this.pendingUTXOs.filter((u) => {
            const key = `${u.transactionId}:${u.outputIndex}`;
            // If it’s now confirmed or known spent, remove it from pending
            if (confirmedKeys.has(key) || spentKeys.has(key)) {
                delete this.pendingUtxoDepth[key];
                return false;
            }
            return true;
        });
    }
}
