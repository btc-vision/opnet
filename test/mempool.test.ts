import { describe, expect, it, vi, beforeEach } from 'vitest';
import { JSONRpcProvider } from '../src/providers/JSONRpcProvider.js';
import { networks } from '@btc-vision/bitcoin';
import { AddressTypes } from '@btc-vision/transaction';
import type { JsonRpcPayload } from '../src/providers/interfaces/JSONRpc.js';
import type { JsonRpcCallResult } from '../src/providers/interfaces/JSONRpcResult.js';
import type { MempoolInfo } from '../src/providers/interfaces/mempool/MempoolInfo.js';
import type { IMempoolTransactionData } from '../src/providers/interfaces/mempool/MempoolTransactionData.js';

// ============================================================================
// Mock provider that intercepts _send
// ============================================================================

function createMockProvider(): JSONRpcProvider & {
    mockSend: ReturnType<typeof vi.fn>;
} {
    const provider = new JSONRpcProvider({
        url: 'https://mock.opnet.org',
        network: networks.regtest,
    });

    const mockSend = vi.fn<(payload: JsonRpcPayload | JsonRpcPayload[]) => Promise<JsonRpcCallResult>>();

    // Override the internal _send
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (provider as any)._send = mockSend;

    return Object.assign(provider, { mockSend });
}

// ============================================================================
// Unit Tests
// ============================================================================

describe('Mempool API - Unit Tests', () => {
    let provider: ReturnType<typeof createMockProvider>;

    beforeEach(() => {
        provider = createMockProvider();
    });

    // ========================================================================
    // getMempoolInfo
    // ========================================================================

    describe('getMempoolInfo', () => {
        it('should return mempool info with count, opnetCount, and size', async () => {
            const mockInfo: MempoolInfo = {
                count: 42,
                opnetCount: 5,
                size: 123456,
            };

            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: mockInfo,
                },
            ]);

            const result = await provider.getMempoolInfo();

            expect(result).toEqual(mockInfo);
            expect(result.count).toBe(42);
            expect(result.opnetCount).toBe(5);
            expect(result.size).toBe(123456);
        });

        it('should call the correct JSON-RPC method', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { count: 0, opnetCount: 0, size: 0 },
                },
            ]);

            await provider.getMempoolInfo();

            expect(provider.mockSend).toHaveBeenCalledOnce();
            const payload = provider.mockSend.mock.calls[0][0] as JsonRpcPayload;
            expect(payload.method).toBe('btc_getMempoolInfo');
            expect(payload.params).toEqual([]);
        });

        it('should throw on error response', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    error: { code: -32000, message: 'Internal error' },
                },
            ]);

            await expect(provider.getMempoolInfo()).rejects.toThrow('Error fetching mempool info');
        });

        it('should handle empty mempool', async () => {
            const mockInfo: MempoolInfo = {
                count: 0,
                opnetCount: 0,
                size: 0,
            };

            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: mockInfo,
                },
            ]);

            const result = await provider.getMempoolInfo();

            expect(result.count).toBe(0);
            expect(result.opnetCount).toBe(0);
            expect(result.size).toBe(0);
        });

        it('should handle large mempool counts', async () => {
            const mockInfo: MempoolInfo = {
                count: 100000,
                opnetCount: 50000,
                size: 999999999,
            };

            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: mockInfo,
                },
            ]);

            const result = await provider.getMempoolInfo();

            expect(result.count).toBe(100000);
            expect(result.opnetCount).toBe(50000);
            expect(result.size).toBe(999999999);
        });
    });

    // ========================================================================
    // getPendingTransaction
    // ========================================================================

    describe('getPendingTransaction', () => {
        const mockTx: IMempoolTransactionData = {
            id: 'abc123def456abc123def456abc123def456abc123def456abc123def456abc1',
            firstSeen: '2023-11-14T22:13:20.000Z',
            blockHeight: '0xcf080',
            transactionType: 'Interaction',
            theoreticalGasLimit: '0xf4240',
            priorityFee: '0x1f4',
            from: 'bcrt1psender...',
            contractAddress: 'bcrt1pcontract...',
            calldata: 'deadbeef',
            psbt: false,
            inputs: [
                {
                    transactionId:
                        'def456abc123def456abc123def456abc123def456abc123def456abc123def4',
                    outputIndex: 0,
                },
            ],
            outputs: [
                {
                    address: 'bcrt1qtest...',
                    outputIndex: 0,
                    value: '100000',
                    scriptPubKey: '0014abc123',
                },
            ],
            raw: 'deadbeef',
        };

        it('should return pending transaction data by hash', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: mockTx,
                },
            ]);

            const result = await provider.getPendingTransaction(mockTx.id);

            expect(result).not.toBeNull();
            expect(result!.id).toBe(mockTx.id);
            expect(result!.transactionType).toBe('Interaction');
            expect(result!.psbt).toBe(false);
            expect(result!.inputs).toHaveLength(1);
            expect(result!.outputs).toHaveLength(1);
        });

        it('should pass the hash as param', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: mockTx,
                },
            ]);

            const txHash = 'abc123def456abc123def456abc123def456abc123def456abc123def456abc1';
            await provider.getPendingTransaction(txHash);

            expect(provider.mockSend).toHaveBeenCalledOnce();
            const payload = provider.mockSend.mock.calls[0][0] as JsonRpcPayload;
            expect(payload.method).toBe('btc_getPendingTransaction');
            expect(payload.params).toEqual([txHash]);
        });

        it('should return null when the node reports the transaction is not found', async () => {
            // The node returns a JSON-RPC error (not a null result) for missing transactions.
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    error: {
                        code: -32000,
                        message: 'Pending transaction 0000000000000000000000000000000000000000000000000000000000000000 not found.',
                    },
                },
            ]);

            const result = await provider.getPendingTransaction(
                '0000000000000000000000000000000000000000000000000000000000000000',
            );

            expect(result).toBeNull();
        });

        it('should throw on error response', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    error: { code: -32000, message: 'Internal error' },
                },
            ]);

            await expect(
                provider.getPendingTransaction(
                    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                ),
            ).rejects.toThrow('Error fetching pending transaction');
        });

        it('should throw for an invalid hash (too short)', async () => {
            await expect(provider.getPendingTransaction('abc123')).rejects.toThrow(
                'getPendingTransaction: expected a 64-character hex txid',
            );
        });

        it('should throw for an empty hash', async () => {
            await expect(provider.getPendingTransaction('')).rejects.toThrow(
                'getPendingTransaction: expected a 64-character hex txid',
            );
        });

        it('should throw for a hash with non-hex characters', async () => {
            await expect(
                provider.getPendingTransaction(
                    'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
                ),
            ).rejects.toThrow('getPendingTransaction: expected a 64-character hex txid');
        });

        it('should handle Generic transaction', async () => {
            const nonOPNetTx: IMempoolTransactionData = {
                ...mockTx,
                transactionType: 'Generic',
                theoreticalGasLimit: undefined,
                priorityFee: undefined,
                from: undefined,
                contractAddress: undefined,
                calldata: undefined,
            };

            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: nonOPNetTx,
                },
            ]);

            const result = await provider.getPendingTransaction(nonOPNetTx.id);

            expect(result).not.toBeNull();
            expect(result!.transactionType).toBe('Generic');
        });

        it('should handle PSBT transaction', async () => {
            const psbtTx: IMempoolTransactionData = {
                ...mockTx,
                psbt: true,
            };

            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: psbtTx,
                },
            ]);

            const result = await provider.getPendingTransaction(psbtTx.id);

            expect(result).not.toBeNull();
            expect(result!.psbt).toBe(true);
        });

        it('should handle transaction with multiple inputs and outputs', async () => {
            const multiTx: IMempoolTransactionData = {
                ...mockTx,
                inputs: [
                    { transactionId: 'tx1', outputIndex: 0 },
                    { transactionId: 'tx2', outputIndex: 1 },
                    { transactionId: 'tx3', outputIndex: 2 },
                ],
                outputs: [
                    { address: 'addr1', outputIndex: 0, value: '50000', scriptPubKey: '001401' },
                    { address: 'addr2', outputIndex: 1, value: '30000', scriptPubKey: '001402' },
                    { address: null, outputIndex: 2, value: '0', scriptPubKey: '6a' },
                ],
            };

            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: multiTx,
                },
            ]);

            const result = await provider.getPendingTransaction(multiTx.id);

            expect(result).not.toBeNull();
            expect(result!.inputs).toHaveLength(3);
            expect(result!.outputs).toHaveLength(3);
            expect(result!.outputs[2].address).toBeNull();
        });
    });

    // ========================================================================
    // getLatestPendingTransactions
    // ========================================================================

    describe('getLatestPendingTransactions', () => {
        const mockTx1: IMempoolTransactionData = {
            id: 'a000000000000000000000000000000000000000000000000000000000000001',
            firstSeen: '2023-11-14T22:13:20.000Z',
            blockHeight: '0xcf080',
            transactionType: 'Interaction',
            theoreticalGasLimit: '0xf4240',
            priorityFee: '0x1f4',
            from: 'bcrt1psender...',
            contractAddress: 'bcrt1pcontract...',
            calldata: 'aabbccdd',
            psbt: false,
            inputs: [{ transactionId: 'input1', outputIndex: 0 }],
            outputs: [
                { address: 'addr1', outputIndex: 0, value: '100000', scriptPubKey: '0014abc' },
            ],
            raw: 'deadbeef01',
        };

        const mockTx2: IMempoolTransactionData = {
            id: 'a000000000000000000000000000000000000000000000000000000000000002',
            firstSeen: '2023-11-14T22:13:21.000Z',
            blockHeight: '0xcf080',
            transactionType: 'Generic',
            psbt: false,
            inputs: [{ transactionId: 'input2', outputIndex: 1 }],
            outputs: [
                { address: 'addr2', outputIndex: 0, value: '200000', scriptPubKey: '0014def' },
            ],
            raw: 'deadbeef02',
        };

        it('should return latest pending transactions with no filters', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: [mockTx1, mockTx2] },
                },
            ]);

            const result = await provider.getLatestPendingTransactions();

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(mockTx1.id);
            expect(result[1].id).toBe(mockTx2.id);
        });

        it('should pass correct params with no filters', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: [] },
                },
            ]);

            await provider.getLatestPendingTransactions();

            const payload = provider.mockSend.mock.calls[0][0] as JsonRpcPayload;
            expect(payload.method).toBe('btc_getLatestPendingTransactions');
            expect(payload.params).toEqual([null, null, null]);
        });

        it('should pass single address filter', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(AddressTypes.P2WPKH);
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: [mockTx1] },
                },
            ]);

            await provider.getLatestPendingTransactions({ address: 'bcrt1qtest...' });

            const payload = provider.mockSend.mock.calls[0][0] as JsonRpcPayload;
            expect(payload.params).toEqual(['bcrt1qtest...', null, null]);
        });

        it('should pass limit parameter', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: [mockTx1] },
                },
            ]);

            await provider.getLatestPendingTransactions({ limit: 10 });

            const payload = provider.mockSend.mock.calls[0][0] as JsonRpcPayload;
            expect(payload.params).toEqual([null, null, 10]);
        });

        it('should return empty array when no transactions found', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: [] },
                },
            ]);

            const result = await provider.getLatestPendingTransactions();

            expect(result).toEqual([]);
        });

        it('should throw on error response', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    error: { code: -32000, message: 'Internal error' },
                },
            ]);

            await expect(provider.getLatestPendingTransactions()).rejects.toThrow(
                'Error fetching latest pending transactions',
            );
        });

        it('should handle null transactions field gracefully', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: null },
                },
            ]);

            const result = await provider.getLatestPendingTransactions();

            expect(result).toEqual([]);
        });

        it('should handle many transactions', async () => {
            const manyTxs: IMempoolTransactionData[] = Array.from({ length: 100 }, (_, i) => ({
                id: `a${String(i).padStart(63, '0')}`,
                firstSeen: new Date(1700000000000 + i * 1000).toISOString(),
                blockHeight: '0xcf080',
                transactionType: i % 2 === 0 ? 'Interaction' : 'Generic',
                ...(i % 2 === 0
                    ? {
                          theoreticalGasLimit: '0xf4240',
                          priorityFee: `0x${(i * 100).toString(16)}`,
                          from: `bcrt1psender${i}`,
                          contractAddress: `bcrt1pcontract${i}`,
                          calldata: 'aa',
                      }
                    : {}),
                psbt: false,
                inputs: [{ transactionId: `input_${i}`, outputIndex: 0 }],
                outputs: [
                    {
                        address: `addr_${i}`,
                        outputIndex: 0,
                        value: String(i * 1000),
                        scriptPubKey: '0014',
                    },
                ],
                raw: `raw_${i}`,
            }));

            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: manyTxs },
                },
            ]);

            const result = await provider.getLatestPendingTransactions();

            expect(result).toHaveLength(100);
            expect(result[0].transactionType).toBe('Interaction');
            expect(result[1].transactionType).toBe('Generic');
        });

        it('should handle null result gracefully', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: null,
                },
            ]);

            const result = await provider.getLatestPendingTransactions();

            expect(result).toEqual([]);
        });

        it('should throw for a malformed response shape', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: 42,
                },
            ]);

            await expect(provider.getLatestPendingTransactions()).rejects.toThrow(
                'unexpected response shape',
            );
        });

        it('should throw when transactions field is not an array', async () => {
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: 'not-an-array' },
                },
            ]);

            await expect(provider.getLatestPendingTransactions()).rejects.toThrow(
                'expected transactions to be an array',
            );
        });

        it('should throw for an invalid address', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(null);

            await expect(
                provider.getLatestPendingTransactions({ address: 'not-a-valid-address' }),
            ).rejects.toThrow('getLatestPendingTransactions: invalid address');
        });

        it('should throw for a non-integer limit', async () => {
            await expect(
                provider.getLatestPendingTransactions({ limit: 3.7 }),
            ).rejects.toThrow('limit must be a positive integer');
        });

        it('should throw for a zero limit', async () => {
            await expect(
                provider.getLatestPendingTransactions({ limit: 0 }),
            ).rejects.toThrow('limit must be a positive integer');
        });

        it('should throw for a negative limit', async () => {
            await expect(
                provider.getLatestPendingTransactions({ limit: -1 }),
            ).rejects.toThrow('limit must be a positive integer');
        });
    });

    // ========================================================================
    // getLatestPendingTransactionsByAddresses
    // ========================================================================

    describe('getLatestPendingTransactionsByAddresses', () => {
        const mockTx1: IMempoolTransactionData = {
            id: 'a000000000000000000000000000000000000000000000000000000000000001',
            firstSeen: '2023-11-14T22:13:20.000Z',
            blockHeight: '0xcf080',
            transactionType: 'Interaction',
            theoreticalGasLimit: '0xf4240',
            priorityFee: '0x1f4',
            from: 'bcrt1psender...',
            contractAddress: 'bcrt1pcontract...',
            calldata: 'aabbccdd',
            psbt: false,
            inputs: [{ transactionId: 'input1', outputIndex: 0 }],
            outputs: [
                { address: 'addr1', outputIndex: 0, value: '100000', scriptPubKey: '0014abc' },
            ],
            raw: 'deadbeef01',
        };

        const mockTx2: IMempoolTransactionData = {
            id: 'a000000000000000000000000000000000000000000000000000000000000002',
            firstSeen: '2023-11-14T22:13:21.000Z',
            blockHeight: '0xcf080',
            transactionType: 'Generic',
            psbt: false,
            inputs: [{ transactionId: 'input2', outputIndex: 1 }],
            outputs: [
                { address: 'addr2', outputIndex: 0, value: '200000', scriptPubKey: '0014def' },
            ],
            raw: 'deadbeef02',
        };

        it('should pass addresses filter', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(AddressTypes.P2WPKH);
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: [mockTx1, mockTx2] },
                },
            ]);

            await provider.getLatestPendingTransactionsByAddresses({ addresses: ['addr1', 'addr2'] });

            const payload = provider.mockSend.mock.calls[0][0] as JsonRpcPayload;
            expect(payload.params).toEqual([null, ['addr1', 'addr2'], null]);
        });

        it('should pass addresses and limit filter', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(AddressTypes.P2WPKH);
            provider.mockSend.mockResolvedValue([
                {
                    jsonrpc: '2.0',
                    id: 1,
                    result: { transactions: [mockTx1] },
                },
            ]);

            await provider.getLatestPendingTransactionsByAddresses({ addresses: ['addr1', 'addr2'], limit: 5 });

            const payload = provider.mockSend.mock.calls[0][0] as JsonRpcPayload;
            expect(payload.params).toEqual([null, ['addr1', 'addr2'], 5]);
        });

        it('should throw for an empty addresses array', async () => {
            await expect(
                provider.getLatestPendingTransactionsByAddresses({ addresses: [] }),
            ).rejects.toThrow('addresses array must not be empty');
        });

        it('should throw for an invalid address in the array', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(null);

            await expect(
                provider.getLatestPendingTransactionsByAddresses({ addresses: ['bad-address'] }),
            ).rejects.toThrow('getLatestPendingTransactionsByAddresses: invalid address');
        });

        it('should throw for a non-integer limit', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(AddressTypes.P2WPKH);

            await expect(
                provider.getLatestPendingTransactionsByAddresses({ addresses: ['addr1'], limit: 3.7 }),
            ).rejects.toThrow('limit must be a positive integer');
        });

        it('should throw for a zero limit', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(AddressTypes.P2WPKH);

            await expect(
                provider.getLatestPendingTransactionsByAddresses({ addresses: ['addr1'], limit: 0 }),
            ).rejects.toThrow('limit must be a positive integer');
        });

        it('should throw for a negative limit', async () => {
            vi.spyOn(provider, 'validateAddress').mockReturnValue(AddressTypes.P2WPKH);

            await expect(
                provider.getLatestPendingTransactionsByAddresses({ addresses: ['addr1'], limit: -1 }),
            ).rejects.toThrow('limit must be a positive integer');
        });
    });
});

// ============================================================================
// Integration Tests - Real Regtest Network
// ============================================================================

describe('Mempool API - Integration Tests (regtest.opnet.org)', () => {
    const REGTEST_URL = 'https://regtest.opnet.org';
    let provider: JSONRpcProvider;

    beforeEach(() => {
        provider = new JSONRpcProvider({ url: REGTEST_URL, network: networks.regtest });
    });

    describe('getMempoolInfo', () => {
        it('should fetch mempool info from regtest', async () => {
            const info = await provider.getMempoolInfo();

            expect(typeof info.count).toBe('number');
            expect(typeof info.opnetCount).toBe('number');
            expect(typeof info.size).toBe('number');
            expect(info.count).toBeGreaterThanOrEqual(0);
            expect(info.opnetCount).toBeGreaterThanOrEqual(0);
            expect(info.size).toBeGreaterThanOrEqual(0);
            expect(info.opnetCount).toBeLessThanOrEqual(info.count);

            console.log(
                `Mempool: ${info.count} txs (${info.opnetCount} OPNet), size: ${info.size}`,
            );
        }, 30000);
    });

    describe('getLatestPendingTransactions', () => {
        it('should fetch latest pending transactions', async () => {
            const txs = await provider.getLatestPendingTransactions();

            expect(Array.isArray(txs)).toBe(true);

            if (txs.length > 0) {
                const tx = txs[0];
                expect(typeof tx.id).toBe('string');
                expect(typeof tx.firstSeen).toBe('string');
                expect(typeof tx.blockHeight).toBe('string');
                expect(typeof tx.transactionType).toBe('string');
                expect(typeof tx.psbt).toBe('boolean');
                expect(Array.isArray(tx.inputs)).toBe(true);
                expect(Array.isArray(tx.outputs)).toBe(true);
                expect(typeof tx.raw).toBe('string');
            }

            console.log(`Found ${txs.length} pending transactions`);
        }, 30000);

        it('should respect limit parameter', async () => {
            const txs = await provider.getLatestPendingTransactions({ limit: 5 });

            expect(Array.isArray(txs)).toBe(true);
            expect(txs.length).toBeLessThanOrEqual(5);

            console.log(`Fetched ${txs.length} pending transactions (limit 5)`);
        }, 30000);
    });

    describe('getLatestPendingTransactionsByAddresses', () => {
        it('should filter transactions by address', async () => {
            const allTxs = await provider.getLatestPendingTransactions({ limit: 1 });

            const addressableOutput = allTxs.flatMap((tx) => tx.outputs).find((o) => o.address !== null);

            if (!addressableOutput?.address) {
                console.log('No addressable outputs in pending transactions — skipping');
                return;
            }

            const txs = await provider.getLatestPendingTransactionsByAddresses({
                addresses: [addressableOutput.address],
            });

            expect(Array.isArray(txs)).toBe(true);
            console.log(
                `Found ${txs.length} transactions for address ${addressableOutput.address}`,
            );
        }, 30000);
    });

    describe('getPendingTransaction', () => {
        it('should return null for non-existent transaction', async () => {
            const fakeTxHash =
                '0000000000000000000000000000000000000000000000000000000000000000';

            const result = await provider.getPendingTransaction(fakeTxHash);

            // Should be null since this tx doesn't exist
            expect(result).toBeNull();
        }, 30000);

        it('should fetch a pending transaction if one exists', async () => {
            // First get list of pending transactions
            const txs = await provider.getLatestPendingTransactions({ limit: 1 });

            if (txs.length === 0) {
                console.log('No pending transactions to test getPendingTransaction');
                return;
            }

            const txHash = txs[0].id;
            const result = await provider.getPendingTransaction(txHash);

            expect(result).not.toBeNull();
            expect(result!.id).toBe(txHash);
            expect(typeof result!.transactionType).toBe('string');
            expect(Array.isArray(result!.inputs)).toBe(true);
            expect(Array.isArray(result!.outputs)).toBe(true);

            console.log(
                `Fetched pending tx ${txHash.slice(0, 16)}... (type: ${result!.transactionType})`,
            );
        }, 30000);
    });
});
