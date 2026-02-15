import type { Network } from '@btc-vision/bitcoin';
import {
    Address,
    type BroadcastedTransaction,
    type ChallengeSolution,
    type IP2WSHAddress,
} from '@btc-vision/transaction';
import { describe, expect, it, vi } from 'vitest';
import type { UTXO } from '../build/bitcoin/UTXOs.js';
import { CallResult } from '../build/contracts/CallResult.js';
import type { ICallResultData } from '../build/contracts/interfaces/ICallResult.js';
import type { IProviderForCallResult } from '../build/contracts/interfaces/IProviderForCallResult.js';
import type { TransactionParameters } from '../build/contracts/CallResult.js';

function createMockProvider(): IProviderForCallResult {
    return {
        network: 'regtest' as unknown as Network,
        utxoManager: {
            getUTXOsForAmount: vi.fn().mockResolvedValue([
                {
                    transactionId: 'mock-tx-id',
                    outputIndex: 0,
                    value: 100000n,
                    scriptPubKey: { hex: 'mock-hex', address: 'bcrt1p...' },
                },
            ] as UTXO[]),
            spentUTXO: vi.fn(),
            clean: vi.fn(),
        },
        getChallenge: vi.fn().mockResolvedValue({} as ChallengeSolution),
        sendRawTransaction: vi.fn().mockResolvedValue({} as BroadcastedTransaction),
        getCSV1ForAddress: vi.fn().mockReturnValue({
            address: 'bcrt1q-csv...',
            witnessScript: Buffer.from('witness'),
        } as IP2WSHAddress),
    };
}

function createMockCallResultData(overrides: Partial<ICallResultData> = {}): ICallResultData {
    return {
        result: Buffer.from([]).toString('base64'),
        events: [],
        accessList: {},
        ...overrides,
    };
}

function createCallResult(
    dataOverrides: Partial<ICallResultData> = {},
    provider?: IProviderForCallResult,
): CallResult {
    return new CallResult(
        createMockCallResultData(dataOverrides),
        provider ?? createMockProvider(),
    );
}

function createMockTransactionParams(
    overrides: Partial<TransactionParameters> = {},
): TransactionParameters {
    return {
        signer: null,
        mldsaSigner: null,
        refundTo: 'bcrt1p-refund-address',
        maximumAllowedSatToSpend: 1000000n,
        network: 'regtest' as unknown as Network,
        ...overrides,
    };
}

// ==========================================
// SECTION 1: Constant Function Validation
// ==========================================

describe('CallResult - Constant Function Validation', () => {
    it('should throw when sendTransaction is called on a constant function', async () => {
        const callResult = createCallResult();
        callResult.constant = true;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        await expect(callResult.sendTransaction(params)).rejects.toThrow(
            'Cannot send a transaction on a constant (view) function',
        );
    });

    it('should throw when signTransaction is called on a constant function', async () => {
        const callResult = createCallResult();
        callResult.constant = true;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        await expect(callResult.signTransaction(params)).rejects.toThrow(
            'Cannot send a transaction on a constant (view) function',
        );
    });

    it('should not throw for non-constant functions', async () => {
        const callResult = createCallResult();
        callResult.constant = false;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        // Should not throw the constant error; it will fail later in the flow
        // (e.g. signing) but that's not what we're testing here
        await expect(callResult.signTransaction(params)).rejects.not.toThrow(
            'Cannot send a transaction on a constant (view) function',
        );
    });

    it('should default constant to false', () => {
        const callResult = createCallResult();
        expect(callResult.constant).toBe(false);
    });
});

// ==========================================
// SECTION 2: Payable Function Validation
// ==========================================

describe('CallResult - Payable Function Validation', () => {
    it('should throw when payable function is called without setTransactionDetails', async () => {
        const callResult = createCallResult();
        callResult.payable = true;
        callResult.hasTransactionDetails = false;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams({
            extraInputs: [
                {
                    transactionId: 'extra-tx',
                    outputIndex: 0,
                    value: 50000n,
                    scriptPubKey: { hex: 'hex', address: 'addr' },
                } as UTXO,
            ],
        });

        await expect(callResult.sendTransaction(params)).rejects.toThrow(
            'Payable function requires setTransactionDetails()',
        );
    });

    it('should throw when payable function is called without extraInputs or extraOutputs', async () => {
        const callResult = createCallResult();
        callResult.payable = true;
        callResult.hasTransactionDetails = true;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        await expect(callResult.sendTransaction(params)).rejects.toThrow(
            'Payable function requires extraInputs or extraOutputs',
        );
    });

    it('should throw when payable function has empty extraInputs and no extraOutputs', async () => {
        const callResult = createCallResult();
        callResult.payable = true;
        callResult.hasTransactionDetails = true;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams({
            extraInputs: [],
            extraOutputs: [],
        });

        await expect(callResult.sendTransaction(params)).rejects.toThrow(
            'Payable function requires extraInputs or extraOutputs',
        );
    });

    it('should not throw payable error when extraInputs are provided', async () => {
        const callResult = createCallResult();
        callResult.payable = true;
        callResult.hasTransactionDetails = true;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams({
            extraInputs: [
                {
                    transactionId: 'extra-tx',
                    outputIndex: 0,
                    value: 50000n,
                    scriptPubKey: { hex: 'hex', address: 'addr' },
                } as UTXO,
            ],
        });

        // Should pass the payable checks; will fail later in signing flow
        await expect(callResult.signTransaction(params)).rejects.not.toThrow(
            'Payable function requires',
        );
    });

    it('should not throw payable error when extraOutputs are provided', async () => {
        const callResult = createCallResult();
        callResult.payable = true;
        callResult.hasTransactionDetails = true;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams({
            extraOutputs: [
                {
                    address: 'bcrt1p-output-address',
                    value: 10000,
                },
            ],
        });

        // Should pass the payable checks; will fail later in signing flow
        await expect(callResult.signTransaction(params)).rejects.not.toThrow(
            'Payable function requires',
        );
    });

    it('should not throw for non-payable functions without extras', async () => {
        const callResult = createCallResult();
        callResult.payable = false;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        // Should not throw payable errors
        await expect(callResult.signTransaction(params)).rejects.not.toThrow(
            'Payable function requires',
        );
    });

    it('should default payable to false', () => {
        const callResult = createCallResult();
        expect(callResult.payable).toBe(false);
    });

    it('should default hasTransactionDetails to false', () => {
        const callResult = createCallResult();
        expect(callResult.hasTransactionDetails).toBe(false);
    });
});

// ==========================================
// SECTION 3: Constant takes priority
// ==========================================

describe('CallResult - Validation Priority', () => {
    it('should throw constant error before payable error when both are set', async () => {
        const callResult = createCallResult();
        callResult.constant = true;
        callResult.payable = true;
        callResult.hasTransactionDetails = false;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        await expect(callResult.signTransaction(params)).rejects.toThrow(
            'Cannot send a transaction on a constant (view) function',
        );
    });

    it('should throw constant error before missing address/calldata', async () => {
        const callResult = createCallResult();
        callResult.constant = true;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        await expect(callResult.signTransaction(params)).rejects.toThrow(
            'Cannot send a transaction on a constant (view) function',
        );
    });

    it('should throw payable setTransactionDetails error before extraInputs error', async () => {
        const callResult = createCallResult();
        callResult.payable = true;
        callResult.hasTransactionDetails = false;
        callResult.to = 'bcrt1p-to-address';
        callResult.address = Address.fromString(
            '0x' + 'ab'.repeat(32),
        );
        callResult.calldata = Buffer.from('test-calldata');

        const params = createMockTransactionParams();

        await expect(callResult.signTransaction(params)).rejects.toThrow(
            'Payable function requires setTransactionDetails()',
        );
    });
});
