import { describe, expect, it, beforeEach, vi } from 'vitest';
import { UTXOsManager } from '../build/utxos/UTXOsManager.js';
import { UTXO } from '../build/bitcoin/UTXOs.js';
import type { IProviderForUTXO } from '../build/utxos/interfaces/IProviderForUTXO.js';
import type { JsonRpcPayload } from '../build/providers/interfaces/JSONRpc.js';
import type { JsonRpcResult, JsonRpcCallResult } from '../build/providers/interfaces/JSONRpcResult.js';
import type { RawIUTXOsData } from '../build/utxos/interfaces/IUTXOsManager.js';

/**
 * Helper to create a mock UTXO for testing
 */
function createMockUTXO(
    transactionId: string,
    outputIndex: number,
    value: bigint,
    isCSV: boolean = false,
): UTXO {
    const raw = Buffer.from('mock-raw-tx-data').toString('base64');
    return new UTXO(
        {
            transactionId,
            outputIndex,
            value: value.toString(),
            scriptPubKey: {
                asm: 'mock-asm',
                hex: 'mock-hex',
                type: 'witness_v1_taproot',
                address: 'bc1p...',
            },
            raw,
        },
        isCSV,
    );
}

/**
 * Helper to create mock raw UTXO data as returned by the RPC
 */
function createMockRawUTXOsData(
    confirmed: Array<{ txId: string; index: number; value: string }>,
    pending: Array<{ txId: string; index: number; value: string }> = [],
    spentTransactions: Array<{ txId: string; index: number }> = [],
): RawIUTXOsData {
    const rawTransactions: string[] = [];

    const mapToRawUTXO = (item: { txId: string; index: number; value: string }) => {
        const rawIndex = rawTransactions.length;
        rawTransactions.push(Buffer.from(`raw-tx-${item.txId}`).toString('base64'));
        return {
            transactionId: item.txId,
            outputIndex: item.index,
            value: item.value,
            scriptPubKey: {
                asm: 'mock-asm',
                hex: 'mock-hex',
                type: 'witness_v1_taproot' as const,
                address: 'bc1p...',
            },
            raw: rawIndex,
        };
    };

    return {
        confirmed: confirmed.map(mapToRawUTXO),
        pending: pending.map(mapToRawUTXO),
        spentTransactions: spentTransactions.map((s) => ({
            transactionId: s.txId,
            outputIndex: s.index,
        })),
        raw: rawTransactions,
    };
}

/**
 * Create a mock provider for testing
 */
function createMockProvider(): IProviderForUTXO & {
    mockCallPayloadSingle: ReturnType<typeof vi.fn>;
    mockCallMultiplePayloads: ReturnType<typeof vi.fn>;
} {
    const mockCallPayloadSingle = vi.fn<[JsonRpcPayload], Promise<JsonRpcResult>>();
    const mockCallMultiplePayloads = vi.fn<[JsonRpcPayload[]], Promise<JsonRpcCallResult>>();

    return {
        buildJsonRpcPayload: vi.fn((method, params) => ({
            method,
            params,
            id: 1,
            jsonrpc: '2.0' as const,
        })),
        callPayloadSingle: mockCallPayloadSingle,
        callMultiplePayloads: mockCallMultiplePayloads,
        mockCallPayloadSingle,
        mockCallMultiplePayloads,
    };
}

describe('UTXOsManager', () => {
    let manager: UTXOsManager;
    let mockProvider: ReturnType<typeof createMockProvider>;

    beforeEach(() => {
        mockProvider = createMockProvider();
        manager = new UTXOsManager(mockProvider);
    });

    describe('constructor', () => {
        it('should create a new UTXOsManager instance', () => {
            expect(manager).toBeInstanceOf(UTXOsManager);
        });
    });

    describe('getPendingUTXOs', () => {
        it('should return empty array for new address', () => {
            const result = manager.getPendingUTXOs('bc1q...');
            expect(result).toEqual([]);
        });

        it('should return pending UTXOs after spentUTXO call', () => {
            const address = 'bc1qtest...';
            const spent: UTXO[] = [];
            const newUTXOs = [createMockUTXO('tx1', 0, 1000n)];

            manager.spentUTXO(address, spent, newUTXOs);

            const pending = manager.getPendingUTXOs(address);
            expect(pending).toHaveLength(1);
            expect(pending[0].transactionId).toBe('tx1');
        });
    });

    describe('spentUTXO', () => {
        it('should add new UTXOs to pending', () => {
            const address = 'bc1qtest...';
            const newUTXOs = [
                createMockUTXO('tx1', 0, 1000n),
                createMockUTXO('tx2', 1, 2000n),
            ];

            manager.spentUTXO(address, [], newUTXOs);

            const pending = manager.getPendingUTXOs(address);
            expect(pending).toHaveLength(2);
        });

        it('should remove spent UTXOs from pending', () => {
            const address = 'bc1qtest...';
            const utxo1 = createMockUTXO('tx1', 0, 1000n);
            const utxo2 = createMockUTXO('tx2', 1, 2000n);

            // First add some pending UTXOs
            manager.spentUTXO(address, [], [utxo1, utxo2]);
            expect(manager.getPendingUTXOs(address)).toHaveLength(2);

            // Now spend one of them
            manager.spentUTXO(address, [utxo1], []);
            expect(manager.getPendingUTXOs(address)).toHaveLength(1);
            expect(manager.getPendingUTXOs(address)[0].transactionId).toBe('tx2');
        });

        it('should throw error when exceeding mempool chain limit', () => {
            const address = 'bc1qtest...';

            // Build a chain of 25 transactions (the limit)
            let lastUTXO = createMockUTXO('tx0', 0, 1000n);
            manager.spentUTXO(address, [], [lastUTXO]);

            for (let i = 1; i < 25; i++) {
                const newUTXO = createMockUTXO(`tx${i}`, 0, 1000n);
                manager.spentUTXO(address, [lastUTXO], [newUTXO]);
                lastUTXO = newUTXO;
            }

            // The 26th transaction should throw
            const finalUTXO = createMockUTXO('tx25', 0, 1000n);
            expect(() => {
                manager.spentUTXO(address, [lastUTXO], [finalUTXO]);
            }).toThrow('too-long-mempool-chain');
        });

        it('should track UTXOs separately per address', () => {
            const address1 = 'bc1qaddr1...';
            const address2 = 'bc1qaddr2...';

            manager.spentUTXO(address1, [], [createMockUTXO('tx1', 0, 1000n)]);
            manager.spentUTXO(address2, [], [createMockUTXO('tx2', 0, 2000n)]);

            expect(manager.getPendingUTXOs(address1)).toHaveLength(1);
            expect(manager.getPendingUTXOs(address2)).toHaveLength(1);
            expect(manager.getPendingUTXOs(address1)[0].transactionId).toBe('tx1');
            expect(manager.getPendingUTXOs(address2)[0].transactionId).toBe('tx2');
        });
    });

    describe('clean', () => {
        it('should clean data for a specific address', () => {
            const address1 = 'bc1qaddr1...';
            const address2 = 'bc1qaddr2...';

            manager.spentUTXO(address1, [], [createMockUTXO('tx1', 0, 1000n)]);
            manager.spentUTXO(address2, [], [createMockUTXO('tx2', 0, 2000n)]);

            manager.clean(address1);

            expect(manager.getPendingUTXOs(address1)).toHaveLength(0);
            expect(manager.getPendingUTXOs(address2)).toHaveLength(1);
        });

        it('should clean all data when no address specified', () => {
            const address1 = 'bc1qaddr1...';
            const address2 = 'bc1qaddr2...';

            manager.spentUTXO(address1, [], [createMockUTXO('tx1', 0, 1000n)]);
            manager.spentUTXO(address2, [], [createMockUTXO('tx2', 0, 2000n)]);

            manager.clean();

            expect(manager.getPendingUTXOs(address1)).toHaveLength(0);
            expect(manager.getPendingUTXOs(address2)).toHaveLength(0);
        });
    });

    describe('getUTXOs', () => {
        it('should fetch UTXOs from provider', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
                { txId: 'tx2', index: 1, value: '2000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOs({ address });

            expect(utxos).toHaveLength(2);
            expect(utxos[0].transactionId).toBe('tx1');
            expect(utxos[1].transactionId).toBe('tx2');
        });

        it('should merge pending UTXOs when mergePendingUTXOs is true', async () => {
            const address = 'bc1qtest...';

            // Add a pending UTXO locally
            manager.spentUTXO(address, [], [createMockUTXO('pending-tx', 0, 500n)]);

            const mockData = createMockRawUTXOsData([
                { txId: 'confirmed-tx', index: 0, value: '1000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOs({
                address,
                mergePendingUTXOs: true,
            });

            expect(utxos).toHaveLength(2);
            const txIds = utxos.map((u) => u.transactionId);
            expect(txIds).toContain('confirmed-tx');
            expect(txIds).toContain('pending-tx');
        });

        it('should not merge pending UTXOs when mergePendingUTXOs is false', async () => {
            const address = 'bc1qtest...';

            // Add a pending UTXO locally
            manager.spentUTXO(address, [], [createMockUTXO('pending-tx', 0, 500n)]);

            const mockData = createMockRawUTXOsData([
                { txId: 'confirmed-tx', index: 0, value: '1000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOs({
                address,
                mergePendingUTXOs: false,
            });

            expect(utxos).toHaveLength(1);
            expect(utxos[0].transactionId).toBe('confirmed-tx');
        });

        it('should filter out spent UTXOs', async () => {
            const address = 'bc1qtest...';

            // Mark a UTXO as spent locally
            const spentUtxo = createMockUTXO('spent-tx', 0, 1000n);
            manager.spentUTXO(address, [spentUtxo], []);

            const mockData = createMockRawUTXOsData([
                { txId: 'spent-tx', index: 0, value: '1000' },
                { txId: 'available-tx', index: 0, value: '2000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOs({
                address,
                filterSpentUTXOs: true,
            });

            expect(utxos).toHaveLength(1);
            expect(utxos[0].transactionId).toBe('available-tx');
        });

        it('should use cached data within cooldown period', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            // First call
            await manager.getUTXOs({ address });
            expect(mockProvider.mockCallPayloadSingle).toHaveBeenCalledTimes(1);

            // Second call within cooldown - should use cache
            await manager.getUTXOs({ address });
            expect(mockProvider.mockCallPayloadSingle).toHaveBeenCalledTimes(1);
        });

        it('should throw error on RPC error', async () => {
            const address = 'bc1qtest...';

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                error: { code: -1, message: 'RPC Error' },
                jsonrpc: '2.0',
                id: 1,
            } as unknown as JsonRpcResult);

            await expect(manager.getUTXOs({ address })).rejects.toThrow('Error fetching UTXOs');
        });
    });

    describe('getUTXOsForAmount', () => {
        it('should return UTXOs up to the requested amount', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
                { txId: 'tx2', index: 0, value: '2000' },
                { txId: 'tx3', index: 0, value: '3000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOsForAmount({
                address,
                amount: 2500n,
            });

            // Should return first two UTXOs (1000 + 2000 = 3000 >= 2500)
            expect(utxos).toHaveLength(2);
        });

        it('should throw error when insufficient UTXOs and throwErrors is true', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            await expect(
                manager.getUTXOsForAmount({
                    address,
                    amount: 5000n,
                    throwErrors: true,
                }),
            ).rejects.toThrow('Insufficient UTXOs');
        });

        it('should return available UTXOs when insufficient and throwErrors is false', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOsForAmount({
                address,
                amount: 5000n,
                throwErrors: false,
            });

            expect(utxos).toHaveLength(1);
        });

        it('should respect maxUTXOs limit', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '100' },
                { txId: 'tx2', index: 0, value: '100' },
                { txId: 'tx3', index: 0, value: '100' },
                { txId: 'tx4', index: 0, value: '100' },
                { txId: 'tx5', index: 0, value: '100' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOsForAmount({
                address,
                amount: 1000n,
                maxUTXOs: 3,
            });

            expect(utxos).toHaveLength(3);
        });

        it('should throw when maxUTXOs reached and throwIfUTXOsLimitReached is true', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '100' },
                { txId: 'tx2', index: 0, value: '100' },
                { txId: 'tx3', index: 0, value: '100' },
            ]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            await expect(
                manager.getUTXOsForAmount({
                    address,
                    amount: 1000n,
                    maxUTXOs: 2,
                    throwIfUTXOsLimitReached: true,
                }),
            ).rejects.toThrow('consolidate your UTXOs');
        });
    });

    describe('getMultipleUTXOs', () => {
        it('should return empty object for empty requests', async () => {
            const result = await manager.getMultipleUTXOs({ requests: [] });
            expect(result).toEqual({});
        });

        it('should fetch UTXOs for multiple addresses in a single batch call', async () => {
            const address1 = 'bc1qaddr1...';
            const address2 = 'bc1qaddr2...';

            const mockData1 = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
            ]);
            const mockData2 = createMockRawUTXOsData([
                { txId: 'tx2', index: 0, value: '2000' },
            ]);

            mockProvider.mockCallMultiplePayloads.mockResolvedValue([
                { result: mockData1, jsonrpc: '2.0', id: 1 },
                { result: mockData2, jsonrpc: '2.0', id: 2 },
            ]);

            const result = await manager.getMultipleUTXOs({
                requests: [{ address: address1 }, { address: address2 }],
            });

            expect(mockProvider.mockCallMultiplePayloads).toHaveBeenCalledTimes(1);
            expect(Object.keys(result)).toHaveLength(2);
            expect(result[address1]).toHaveLength(1);
            expect(result[address2]).toHaveLength(1);
            expect(result[address1][0].transactionId).toBe('tx1');
            expect(result[address2][0].transactionId).toBe('tx2');
        });

        it('should merge pending UTXOs when mergePendingUTXOs is true', async () => {
            const address = 'bc1qtest...';

            // Add a pending UTXO locally
            manager.spentUTXO(address, [], [createMockUTXO('pending-tx', 0, 500n)]);

            const mockData = createMockRawUTXOsData([
                { txId: 'confirmed-tx', index: 0, value: '1000' },
            ]);

            mockProvider.mockCallMultiplePayloads.mockResolvedValue([
                { result: mockData, jsonrpc: '2.0', id: 1 },
            ]);

            const result = await manager.getMultipleUTXOs({
                requests: [{ address }],
                mergePendingUTXOs: true,
            });

            expect(result[address]).toHaveLength(2);
        });

        it('should filter out spent UTXOs when filterSpentUTXOs is true', async () => {
            const address = 'bc1qtest...';

            // Mark a UTXO as spent
            const spentUtxo = createMockUTXO('spent-tx', 0, 1000n);
            manager.spentUTXO(address, [spentUtxo], []);

            const mockData = createMockRawUTXOsData([
                { txId: 'spent-tx', index: 0, value: '1000' },
                { txId: 'available-tx', index: 0, value: '2000' },
            ]);

            mockProvider.mockCallMultiplePayloads.mockResolvedValue([
                { result: mockData, jsonrpc: '2.0', id: 1 },
            ]);

            const result = await manager.getMultipleUTXOs({
                requests: [{ address }],
                filterSpentUTXOs: true,
            });

            expect(result[address]).toHaveLength(1);
            expect(result[address][0].transactionId).toBe('available-tx');
        });

        it('should update cache for each address', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
            ]);

            mockProvider.mockCallMultiplePayloads.mockResolvedValue([
                { result: mockData, jsonrpc: '2.0', id: 1 },
            ]);

            // First batch call
            await manager.getMultipleUTXOs({ requests: [{ address }] });

            // Individual getUTXOs should use cached data
            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            await manager.getUTXOs({ address });

            // Should not have made another call since cache is fresh
            expect(mockProvider.mockCallPayloadSingle).not.toHaveBeenCalled();
        });

        it('should throw error on RPC error for any address', async () => {
            const address = 'bc1qtest...';

            mockProvider.mockCallMultiplePayloads.mockResolvedValue([
                {
                    error: { code: -1, message: 'RPC Error' },
                    jsonrpc: '2.0',
                    id: 1,
                },
            ] as unknown as JsonRpcCallResult);

            await expect(
                manager.getMultipleUTXOs({ requests: [{ address }] }),
            ).rejects.toThrow('Error fetching UTXOs');
        });

        it('should handle mixed CSV and non-CSV requests', async () => {
            const address1 = 'bc1qaddr1...';
            const address2 = 'bc1qaddr2...';

            const mockData1 = createMockRawUTXOsData([
                { txId: 'tx1', index: 0, value: '1000' },
            ]);
            const mockData2 = createMockRawUTXOsData([
                { txId: 'tx2', index: 0, value: '2000' },
            ]);

            mockProvider.mockCallMultiplePayloads.mockResolvedValue([
                { result: mockData1, jsonrpc: '2.0', id: 1 },
                { result: mockData2, jsonrpc: '2.0', id: 2 },
            ]);

            const result = await manager.getMultipleUTXOs({
                requests: [
                    { address: address1, isCSV: false },
                    { address: address2, isCSV: true },
                ],
            });

            expect(result[address1][0].isCSV).toBe(false);
            expect(result[address2][0].isCSV).toBe(true);
        });

        it('should pass optimize and olderThan parameters to RPC', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([]);

            mockProvider.mockCallMultiplePayloads.mockResolvedValue([
                { result: mockData, jsonrpc: '2.0', id: 1 },
            ]);

            await manager.getMultipleUTXOs({
                requests: [{ address, optimize: false, olderThan: 100n }],
            });

            expect(mockProvider.buildJsonRpcPayload).toHaveBeenCalledWith(
                expect.any(String),
                [address, false, '100'],
            );
        });
    });

    describe('edge cases', () => {
        it('should handle empty UTXO response', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData([]);

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOs({ address });
            expect(utxos).toHaveLength(0);
        });

        it('should handle undefined result gracefully', async () => {
            const address = 'bc1qtest...';

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: undefined,
                jsonrpc: '2.0',
                id: 1,
            } as unknown as JsonRpcResult);

            const utxos = await manager.getUTXOs({ address });
            expect(utxos).toHaveLength(0);
        });

        it('should deduplicate UTXOs with same transactionId and outputIndex', async () => {
            const address = 'bc1qtest...';

            // Add a pending UTXO that will also appear in confirmed
            manager.spentUTXO(address, [], [createMockUTXO('duplicate-tx', 0, 1000n)]);

            const mockData = createMockRawUTXOsData(
                [{ txId: 'duplicate-tx', index: 0, value: '1000' }],
                [{ txId: 'duplicate-tx', index: 0, value: '1000' }],
            );

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOs({
                address,
                mergePendingUTXOs: true,
            });

            // Should only have one UTXO despite duplicates
            expect(utxos).toHaveLength(1);
        });

        it('should filter spent transactions from fetched data', async () => {
            const address = 'bc1qtest...';
            const mockData = createMockRawUTXOsData(
                [
                    { txId: 'tx1', index: 0, value: '1000' },
                    { txId: 'tx2', index: 0, value: '2000' },
                ],
                [],
                [{ txId: 'tx1', index: 0 }], // tx1 is spent
            );

            mockProvider.mockCallPayloadSingle.mockResolvedValue({
                result: mockData,
                jsonrpc: '2.0',
                id: 1,
            });

            const utxos = await manager.getUTXOs({
                address,
                filterSpentUTXOs: true,
            });

            expect(utxos).toHaveLength(1);
            expect(utxos[0].transactionId).toBe('tx2');
        });
    });
});
