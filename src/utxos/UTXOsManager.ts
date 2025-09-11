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
 * A helper interface for per-address data tracking.
 */
interface AddressData {
    spentUTXOs: UTXOs;
    pendingUTXOs: UTXOs;
    /**
     * Key: `${transactionId}:${outputIndex}`
     * Value: the unconfirmed chain depth
     */
    pendingUtxoDepth: Record<string, number>;
    lastCleanup: number;

    lastFetchTimestamp: number;
    lastFetchedData: IUTXOsData | null;
}

/**
 * Manages unspent transaction outputs (UTXOs) by address/wallet.
 * @category Bitcoin
 */
export class UTXOsManager {
    /**
     * Holds all address-specific data so we don’t mix up UTXOs between addresses/wallets.
     */
    private dataByAddress: Record<string, AddressData> = {};

    public constructor(private readonly provider: AbstractRpcProvider) {}

    /**
     * Mark UTXOs as spent and track new UTXOs created by the transaction, _per address_.
     *
     * Enforces a mempool chain limit of 25 unconfirmed transaction descendants.
     *
     * @param address - The address these spent/new UTXOs belong to
     * @param {UTXOs} spent - The UTXOs that were spent.
     * @param {UTXOs} newUTXOs - The new UTXOs created by the transaction.
     * @throws {Error} If adding the new unconfirmed outputs would exceed the mempool chain limit.
     */
    public spentUTXO(address: string, spent: UTXOs, newUTXOs: UTXOs): void {
        const addressData = this.getAddressData(address);
        const utxoKey = (u: UTXO) => `${u.transactionId}:${u.outputIndex}`;

        // Remove spent UTXOs from that address’s pending
        addressData.pendingUTXOs = addressData.pendingUTXOs.filter((utxo) => {
            return !spent.some(
                (spentUtxo) =>
                    spentUtxo.transactionId === utxo.transactionId &&
                    spentUtxo.outputIndex === utxo.outputIndex,
            );
        });

        // Also remove them from the depth map if they were pending
        for (const spentUtxo of spent) {
            const key = utxoKey(spentUtxo);
            delete addressData.pendingUtxoDepth[key];
        }

        // Add spent UTXOs to the "spent" list
        addressData.spentUTXOs.push(...spent);

        // Determine the parent depth for new UTXOs. If a spent UTXO was pending,
        // it contributes to the chain depth. If it was confirmed, depth = 0 for that.
        let maxParentDepth = 0;
        for (const spentUtxo of spent) {
            const key = utxoKey(spentUtxo);
            const parentDepth = addressData.pendingUtxoDepth[key] ?? 0;
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

        // Push the new UTXOs into this address’s pending and set their depth
        for (const nu of newUTXOs) {
            addressData.pendingUTXOs.push(nu);
            addressData.pendingUtxoDepth[utxoKey(nu)] = newDepth;
        }
    }

    /**
     * Get the pending UTXOs for a specific address.
     * @param address
     */
    public getPendingUTXOs(address: string): UTXOs {
        const addressData = this.getAddressData(address);
        return addressData.pendingUTXOs;
    }

    /**
     * Clean (reset) the data for a particular address or for all addresses if none is passed.
     */
    public clean(address?: string): void {
        if (address) {
            // Reset a single address
            const addressData = this.getAddressData(address);
            addressData.spentUTXOs = [];
            addressData.pendingUTXOs = [];
            addressData.pendingUtxoDepth = {};
            addressData.lastCleanup = Date.now();
            addressData.lastFetchTimestamp = 0;
            addressData.lastFetchedData = null;
        } else {
            // Reset everything
            this.dataByAddress = {};
        }
    }

    /**
     * Get UTXOs with configurable options, specifically for an address.
     *
     * If the last UTXO fetch for that address was <10s ago, returns cached data.
     * Otherwise, fetches fresh data from the provider.
     *
     * @param {object} options - The UTXO fetch options
     * @param {string} options.address - The address to get the UTXOs for
     * @param {boolean} [options.optimize=true] - Whether to optimize the UTXOs
     * @param {boolean} [options.mergePendingUTXOs=true] - Merge locally pending UTXOs
     * @param {boolean} [options.filterSpentUTXOs=true] - Filter out known-spent UTXOs
     * @param {boolean} [options.isCSV=false] - Whether to this UTXO as a CSV UTXO
     * @param {bigint} [options.olderThan] - Only fetch UTXOs older than this value
     * @returns {Promise<UTXOs>} The UTXOs
     * @throws {Error} If something goes wrong
     */
    public async getUTXOs({
        address,
        isCSV = false,
        optimize = true,
        mergePendingUTXOs = true,
        filterSpentUTXOs = true,
        olderThan = undefined,
    }: RequestUTXOsParams): Promise<UTXOs> {
        const addressData = this.getAddressData(address);
        const fetchedData = await this.maybeFetchUTXOs(address, optimize, olderThan, isCSV);

        const utxoKey = (utxo: UTXO) => `${utxo.transactionId}:${utxo.outputIndex}`;
        const pendingUTXOKeys = new Set(addressData.pendingUTXOs.map(utxoKey));
        const spentUTXOKeys = new Set(addressData.spentUTXOs.map(utxoKey));
        const fetchedSpentKeys = new Set(fetchedData.spentTransactions.map(utxoKey));

        // Start with confirmed UTXOs
        const combinedUTXOs: UTXOs = [];
        const combinedKeysSet = new Set<string>();

        for (const utxo of fetchedData.confirmed) {
            const key = utxoKey(utxo);
            if (!combinedKeysSet.has(key)) {
                combinedUTXOs.push(utxo);
                combinedKeysSet.add(key);
            }
        }

        // Merge pending UTXOs if requested
        if (mergePendingUTXOs) {
            // Add currently pending
            for (const utxo of addressData.pendingUTXOs) {
                const key = utxoKey(utxo);
                if (!combinedKeysSet.has(key)) {
                    combinedUTXOs.push(utxo);
                    combinedKeysSet.add(key);
                }
            }
            // Add fetched pending UTXOs that aren't already known
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

        // Optionally filter out UTXOs that are known spent in the fetch
        if (filterSpentUTXOs && fetchedSpentKeys.size > 0) {
            finalUTXOs = finalUTXOs.filter((utxo) => !fetchedSpentKeys.has(utxoKey(utxo)));
        }

        return finalUTXOs;
    }

    /**
     * Fetch UTXOs for a specific amount needed, from a single address,
     * merging from pending and confirmed UTXOs.
     *
     * @param {object} options
     * @param {string} options.address The address to fetch UTXOs for
     * @param {bigint} options.amount The needed amount
     * @param {boolean} [options.optimize=true] Optimize the UTXOs
     * @param {boolean} [options.csvAddress] Use CSV UTXOs in priority
     * @param {boolean} [options.mergePendingUTXOs=true] Merge pending
     * @param {boolean} [options.filterSpentUTXOs=true] Filter out spent
     * @param {boolean} [options.throwErrors=false] Throw error if insufficient
     * @param {bigint} [options.olderThan] Only fetch UTXOs older than this value
     * @returns {Promise<UTXOs>}
     */
    public async getUTXOsForAmount({
        address,
        amount,
        csvAddress,
        optimize = true,
        mergePendingUTXOs = true,
        filterSpentUTXOs = true,
        throwErrors = false,
        olderThan = undefined,
        maxUTXOs = 5000,
        throwIfUTXOsLimitReached = false,
    }: RequestUTXOsParamsWithAmount): Promise<UTXOs> {
        const utxosPromises: Promise<UTXO[]>[] = [];

        if (csvAddress) {
            utxosPromises.push(
                this.getUTXOs({
                    address: csvAddress,
                    optimize: true,
                    mergePendingUTXOs: false,
                    filterSpentUTXOs: true,
                    olderThan: 1n,
                    isCSV: true,
                }),
            );
        }

        utxosPromises.push(
            this.getUTXOs({
                address,
                optimize,
                mergePendingUTXOs,
                filterSpentUTXOs,
                olderThan,
            }),
        );

        const combinedUTXOs: UTXOs = (await Promise.all(utxosPromises)).flat();
        const utxoUntilAmount: UTXOs = [];

        let currentValue = 0n;
        for (const utxo of combinedUTXOs) {
            if (maxUTXOs && utxoUntilAmount.length >= maxUTXOs) {
                if (throwIfUTXOsLimitReached) {
                    throw new Error(
                        `Woah. You must consolidate your UTXOs (${combinedUTXOs.length})! This transaction is too large.`,
                    );
                }

                break;
            }

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
     * Return the AddressData object for a given address. Initializes it if nonexistent.
     */
    private getAddressData(address: string): AddressData {
        if (!this.dataByAddress[address]) {
            this.dataByAddress[address] = {
                spentUTXOs: [],
                pendingUTXOs: [],
                pendingUtxoDepth: {},
                lastCleanup: Date.now(),
                lastFetchTimestamp: 0,
                lastFetchedData: null,
            };
        }
        return this.dataByAddress[address];
    }

    /**
     * Checks if we need to fetch fresh UTXOs or can return the cached data (per address).
     */
    private async maybeFetchUTXOs(
        address: string,
        optimize: boolean,
        olderThan: bigint | undefined,
        isCSV: boolean = false,
    ): Promise<IUTXOsData> {
        const addressData = this.getAddressData(address);
        const now = Date.now();
        const age = now - addressData.lastFetchTimestamp;

        // Purge if it's been too long for this address
        if (now - addressData.lastCleanup > AUTO_PURGE_AFTER) {
            this.clean(address); // Clean only this address data
        }

        // If it's been less than FETCH_COOLDOWN ms, return cached data if available
        if (addressData.lastFetchedData && age < FETCH_COOLDOWN) {
            return addressData.lastFetchedData;
        }

        // Otherwise, fetch from the RPC
        addressData.lastFetchedData = await this.fetchUTXOs(address, optimize, olderThan, isCSV);
        addressData.lastFetchTimestamp = now;

        // Remove any pending UTXOs that have become confirmed or known spent
        this.syncPendingDepthWithFetched(address);

        return addressData.lastFetchedData;
    }

    /**
     * Generic method to fetch all UTXOs in one call (confirmed, pending, spent) for a given address.
     */
    private async fetchUTXOs(
        address: string,
        optimize: boolean = false,
        olderThan: bigint | undefined,
        isCSV: boolean = false,
    ): Promise<IUTXOsData> {
        const data: [string, boolean?, string?] = [address, optimize];
        if (olderThan !== undefined) {
            data.push(olderThan.toString());
        }

        const payload: JsonRpcPayload = this.provider.buildJsonRpcPayload(
            JSONRpcMethods.GET_UTXOS,
            data,
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
            confirmed: result.confirmed.map((utxo: IUTXO) => new UTXO(utxo, isCSV)),
            pending: result.pending.map((utxo: IUTXO) => new UTXO(utxo, isCSV)),
            spentTransactions: result.spentTransactions.map((utxo: IUTXO) => new UTXO(utxo, isCSV)),
        };
    }

    /**
     * After fetching new data for a single address, some pending UTXOs may have confirmed
     * or become known-spent. Remove them from pending state/depth map.
     */
    private syncPendingDepthWithFetched(address: string): void {
        const addressData = this.getAddressData(address);
        const fetched = addressData.lastFetchedData;
        if (!fetched) return;

        const confirmedKeys = new Set(
            fetched.confirmed.map((u) => `${u.transactionId}:${u.outputIndex}`),
        );
        const spentKeys = new Set(
            fetched.spentTransactions.map((u) => `${u.transactionId}:${u.outputIndex}`),
        );

        addressData.pendingUTXOs = addressData.pendingUTXOs.filter((u) => {
            const key = `${u.transactionId}:${u.outputIndex}`;
            // If it’s now confirmed or known spent, remove it from pending
            if (confirmedKeys.has(key) || spentKeys.has(key)) {
                delete addressData.pendingUtxoDepth[key];
                return false;
            }
            return true;
        });
    }
}
