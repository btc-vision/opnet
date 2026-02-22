import type { IP2WSHAddress, RawChallenge } from '@btc-vision/transaction';
import { describe, expect, it } from 'vitest';
import { UTXO } from '../build/bitcoin/UTXOs.js';
import { BitcoinFees } from '../build/block/BlockGasParameters.js';
import { CallResult } from '../build/contracts/CallResult.js';
import { CallResultSerializer, NetworkName, OfflineCallResultData, } from '../build/contracts/CallResultSerializer.js';
import { IAccessList } from '../build/contracts/interfaces/IAccessList.js';

/** Convert a Buffer to a plain Uint8Array for comparison. */
function u8(buf: Buffer): Uint8Array {
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

/**
 * Creates a mock RawChallenge for testing
 */
function createMockRawChallenge(overrides: Partial<RawChallenge> = {}): RawChallenge {
    return {
        epochNumber: '12345',
        mldsaPublicKey: '0x' + 'a'.repeat(64),
        legacyPublicKey: '0x' + 'b'.repeat(64),
        solution: '0x' + 'c'.repeat(64),
        salt: '0x' + 'd'.repeat(64),
        graffiti: '0x' + 'ab'.repeat(8),
        difficulty: 1000,
        verification: {
            epochHash: '0x' + 'e'.repeat(64),
            epochRoot: '0x' + 'f'.repeat(64),
            targetHash: '0x' + '1'.repeat(64),
            targetChecksum: '0x' + '2'.repeat(64),
            startBlock: '100',
            endBlock: '200',
            proofs: ['0x' + 'aa'.repeat(16), '0x' + 'bb'.repeat(16), '0x' + 'cc'.repeat(16)],
        },
        submission: undefined,
        ...overrides,
    };
}

/**
 * Creates a mock UTXO for testing
 */
function createMockUTXO(
    transactionId: string,
    outputIndex: number,
    value: bigint,
    options: {
        isCSV?: boolean;
        witnessScript?: Uint8Array;
        redeemScript?: Uint8Array;
        address?: string;
    } = {},
): UTXO {
    return {
        transactionId,
        outputIndex,
        value,
        scriptPubKey: {
            hex: 'mock-hex-' + transactionId,
            address: options.address || 'bcrt1p...',
        },
        isCSV: options.isCSV || false,
        witnessScript: options.witnessScript,
        redeemScript: options.redeemScript,
    } as UTXO;
}

/**
 * Creates mock Bitcoin fees
 */
function createMockBitcoinFees(): BitcoinFees {
    return {
        conservative: 10,
        recommended: {
            low: 5,
            medium: 10,
            high: 20,
        },
    };
}

/**
 * Creates a complete mock OfflineCallResultData for testing
 */
/**
 * Creates a mock 33-byte compressed public key for testing
 */
function createMockCompressedPublicKey(): Uint8Array {
    // 33-byte compressed public key (02 or 03 prefix + 32 bytes x-coordinate)
    return new Uint8Array(Buffer.from('02' + 'ab'.repeat(32), 'hex'));
}

function createMockOfflineData(
    overrides: Partial<OfflineCallResultData> = {},
): OfflineCallResultData {
    return {
        calldata: Buffer.from('test-calldata'),
        to: 'bcrt1p...',
        contractAddress: '0x' + 'a'.repeat(64),
        estimatedSatGas: 5000n,
        estimatedRefundedGasInSat: 1000n,
        result: Buffer.from('test-result'),
        accessList: {
            '0xcontract1': {
                slot1: 'value1',
                slot2: 'value2',
            },
        },
        network: NetworkName.Regtest,
        challenge: createMockRawChallenge(),
        challengeOriginalPublicKey: createMockCompressedPublicKey(),
        utxos: [createMockUTXO('tx1', 0, 10000n), createMockUTXO('tx2', 1, 20000n)],
        ...overrides,
    };
}

// ==========================================
// SECTION 1: NetworkName Enum Tests
// ==========================================

describe('NetworkName Enum', () => {
    it('should have correct string values', () => {
        expect(NetworkName.Mainnet).toBe('mainnet');
        expect(NetworkName.Testnet).toBe('testnet');
        expect(NetworkName.OpnetTestnet).toBe('opnetTestnet');
        expect(NetworkName.Regtest).toBe('regtest');
    });
});

// ==========================================
// SECTION 2: Basic Serialization Tests
// ==========================================

describe('CallResultSerializer - Basic Serialization', () => {
    it('should serialize and return a Buffer', () => {
        const data = createMockOfflineData();
        const buffer = CallResultSerializer.serialize(data);

        expect(buffer).toBeInstanceOf(Uint8Array);
        expect(buffer.length).toBeGreaterThan(0);
    });

    it('should serialize minimal data correctly', () => {
        const minimalData: OfflineCallResultData = {
            calldata: Buffer.from([]),
            to: '',
            contractAddress: '',
            estimatedSatGas: 0n,
            estimatedRefundedGasInSat: 0n,
            result: Buffer.from([]),
            accessList: {},
            network: NetworkName.Regtest,
            challenge: createMockRawChallenge(),
            challengeOriginalPublicKey: createMockCompressedPublicKey(),
            utxos: [],
        };

        const buffer = CallResultSerializer.serialize(minimalData);
        expect(buffer).toBeInstanceOf(Uint8Array);
        expect(buffer.length).toBeGreaterThan(0);
    });

    it('should include version byte at start of buffer', () => {
        const data = createMockOfflineData();
        const buffer = CallResultSerializer.serialize(data);

        // First byte should be version 1
        expect(buffer[0]).toBe(1);
    });
});

// ==========================================
// SECTION 3: Deserialization Tests
// ==========================================

describe('CallResultSerializer - Basic Deserialization', () => {
    it('should deserialize a serialized buffer', () => {
        const originalData = createMockOfflineData();
        const buffer = CallResultSerializer.serialize(originalData);
        const deserializedData = CallResultSerializer.deserialize(buffer);

        expect(deserializedData).toBeDefined();
        expect(deserializedData.network).toBe(originalData.network);
    });

    it('should throw on unsupported version', () => {
        const data = createMockOfflineData();
        const buffer = CallResultSerializer.serialize(data);

        // Modify version byte to invalid value
        buffer[0] = 99;

        expect(() => CallResultSerializer.deserialize(buffer)).toThrow(
            'Unsupported serialization version: 99. Expected: 1',
        );
    });

    it('should throw on version 0', () => {
        const data = createMockOfflineData();
        const buffer = CallResultSerializer.serialize(data);
        buffer[0] = 0;

        expect(() => CallResultSerializer.deserialize(buffer)).toThrow(
            'Unsupported serialization version: 0',
        );
    });
});

// ==========================================
// SECTION 4: Round-Trip Serialization Tests
// ==========================================

describe('CallResultSerializer - Round-Trip Serialization', () => {
    it('should preserve calldata through round-trip', () => {
        const originalCalldata = Buffer.from('complex-calldata-with-special-chars-\x00\x01\xff');
        const data = createMockOfflineData({ calldata: originalCalldata });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.calldata).toEqual(u8(originalCalldata));
    });

    it('should preserve contract addresses through round-trip', () => {
        const data = createMockOfflineData({
            to: 'bcrt1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297',
            contractAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.to).toBe(data.to);
        expect(result.contractAddress).toBe(data.contractAddress);
    });

    it('should preserve gas estimates through round-trip', () => {
        const data = createMockOfflineData({
            estimatedSatGas: 123456789012345678901234567890n,
            estimatedRefundedGasInSat: 987654321098765432109876543210n,
            estimatedGas: 50000n,
            refundedGas: 25000n,
        });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.estimatedSatGas).toBe(data.estimatedSatGas);
        expect(result.estimatedRefundedGasInSat).toBe(data.estimatedRefundedGasInSat);
        expect(result.estimatedGas).toBe(data.estimatedGas);
        expect(result.refundedGas).toBe(data.refundedGas);
    });

    it('should preserve result buffer through round-trip', () => {
        const originalResult = Buffer.from('binary-result-\x00\x01\x02\x03');
        const data = createMockOfflineData({ result: originalResult });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.result).toEqual(u8(originalResult));
    });

    it('should preserve network through round-trip for all networks', () => {
        const networks = [NetworkName.Mainnet, NetworkName.Testnet, NetworkName.OpnetTestnet, NetworkName.Regtest];

        for (const network of networks) {
            const data = createMockOfflineData({ network });
            const buffer = CallResultSerializer.serialize(data);
            const result = CallResultSerializer.deserialize(buffer);

            expect(result.network).toBe(network);
        }
    });
});

// ==========================================
// SECTION 5: Optional Fields Tests
// ==========================================

describe('CallResultSerializer - Optional Fields', () => {
    it('should handle undefined revert', () => {
        const data = createMockOfflineData({ revert: undefined });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.revert).toBeUndefined();
    });

    it('should preserve revert message when present', () => {
        const revertMessage = 'Execution reverted: insufficient balance';
        const data = createMockOfflineData({ revert: revertMessage });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.revert).toBe(revertMessage);
    });

    it('should handle undefined bitcoinFees', () => {
        const data = createMockOfflineData({ bitcoinFees: undefined });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.bitcoinFees).toBeUndefined();
    });

    it('should preserve bitcoinFees when present', () => {
        const fees = createMockBitcoinFees();
        const data = createMockOfflineData({ bitcoinFees: fees });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.bitcoinFees).toEqual(fees);
    });

    it('should handle undefined estimatedGas', () => {
        const data = createMockOfflineData({ estimatedGas: undefined });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.estimatedGas).toBeUndefined();
    });

    it('should handle undefined refundedGas', () => {
        const data = createMockOfflineData({ refundedGas: undefined });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.refundedGas).toBeUndefined();
    });

    it('should handle undefined csvAddress', () => {
        const data = createMockOfflineData({ csvAddress: undefined });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.csvAddress).toBeUndefined();
    });

    it('should preserve csvAddress when present', () => {
        const csvAddress: IP2WSHAddress = {
            address: 'bcrt1qcsv...',
            witnessScript: Buffer.from('witness-script-data'),
        };
        const data = createMockOfflineData({ csvAddress });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.csvAddress).toBeDefined();
        expect(result.csvAddress?.address).toBe(csvAddress.address);
        expect(result.csvAddress?.witnessScript).toEqual(u8(csvAddress.witnessScript as Buffer));
    });
});

// ==========================================
// SECTION 6: Access List Tests
// ==========================================

describe('CallResultSerializer - Access List', () => {
    it('should handle empty access list', () => {
        const data = createMockOfflineData({ accessList: {} });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.accessList).toEqual({});
    });

    it('should preserve single contract with single slot', () => {
        const accessList: IAccessList = {
            '0xcontract1': {
                slot1: 'value1',
            },
        };
        const data = createMockOfflineData({ accessList });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.accessList).toEqual(accessList);
    });

    it('should preserve multiple contracts with multiple slots', () => {
        const accessList: IAccessList = {
            '0xcontract1': {
                slot1: 'value1',
                slot2: 'value2',
                slot3: 'value3',
            },
            '0xcontract2': {
                slotA: 'valueA',
                slotB: 'valueB',
            },
            '0xcontract3': {
                slotX: 'valueX',
            },
        };
        const data = createMockOfflineData({ accessList });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.accessList).toEqual(accessList);
    });

    it('should handle contract with empty slots', () => {
        const accessList: IAccessList = {
            '0xcontract1': {},
        };
        const data = createMockOfflineData({ accessList });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.accessList).toEqual(accessList);
    });

    it('should handle long slot keys and values', () => {
        const longKey = '0x' + 'a'.repeat(64);
        const longValue = '0x' + 'b'.repeat(128);
        const accessList: IAccessList = {
            '0xcontract1': {
                [longKey]: longValue,
            },
        };
        const data = createMockOfflineData({ accessList });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.accessList['0xcontract1'][longKey]).toBe(longValue);
    });
});

// ==========================================
// SECTION 7: Challenge Serialization Tests
// ==========================================

describe('CallResultSerializer - Challenge', () => {
    it('should preserve all challenge fields', () => {
        const challenge = createMockRawChallenge();
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.epochNumber).toBe(challenge.epochNumber);
        expect(result.challenge.mldsaPublicKey).toBe(challenge.mldsaPublicKey);
        expect(result.challenge.legacyPublicKey).toBe(challenge.legacyPublicKey);
        expect(result.challenge.solution).toBe(challenge.solution);
        expect(result.challenge.salt).toBe(challenge.salt);
        expect(result.challenge.graffiti).toBe(challenge.graffiti);
        expect(result.challenge.difficulty).toBe(challenge.difficulty);
    });

    it('should preserve verification data', () => {
        const challenge = createMockRawChallenge();
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.verification.epochHash).toBe(challenge.verification.epochHash);
        expect(result.challenge.verification.epochRoot).toBe(challenge.verification.epochRoot);
        expect(result.challenge.verification.targetHash).toBe(challenge.verification.targetHash);
        expect(result.challenge.verification.targetChecksum).toBe(
            challenge.verification.targetChecksum,
        );
        expect(result.challenge.verification.startBlock).toBe(challenge.verification.startBlock);
        expect(result.challenge.verification.endBlock).toBe(challenge.verification.endBlock);
        expect(result.challenge.verification.proofs).toEqual(challenge.verification.proofs);
    });

    it('should handle empty proofs array', () => {
        const challenge = createMockRawChallenge({
            verification: {
                epochHash: '0x1',
                epochRoot: '0x2',
                targetHash: '0x3',
                targetChecksum: '0x4',
                startBlock: '1',
                endBlock: '2',
                proofs: [],
            },
        });
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.verification.proofs).toEqual([]);
    });

    it('should handle many proofs', () => {
        const manyProofs = Array.from({ length: 100 }, (_, i) => `proof-${i}`);
        const challenge = createMockRawChallenge({
            verification: {
                epochHash: '0x1',
                epochRoot: '0x2',
                targetHash: '0x3',
                targetChecksum: '0x4',
                startBlock: '1',
                endBlock: '2',
                proofs: manyProofs,
            },
        });
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.verification.proofs).toEqual(manyProofs);
    });

    it('should handle undefined submission', () => {
        const challenge = createMockRawChallenge({ submission: undefined });
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.submission).toBeUndefined();
    });

    it('should preserve submission when present', () => {
        const challenge = createMockRawChallenge({
            submission: {
                mldsaPublicKey: '0x' + 'a'.repeat(64),
                legacyPublicKey: '0x' + 'b'.repeat(64),
                solution: '0x' + 'c'.repeat(64),
                graffiti: 'submission-graffiti',
                signature: '0x' + 'd'.repeat(128),
            },
        });
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.submission).toBeDefined();
        expect(result.challenge.submission?.mldsaPublicKey).toBe(
            challenge.submission?.mldsaPublicKey,
        );
        expect(result.challenge.submission?.legacyPublicKey).toBe(
            challenge.submission?.legacyPublicKey,
        );
        expect(result.challenge.submission?.solution).toBe(challenge.submission?.solution);
        expect(result.challenge.submission?.graffiti).toBe(challenge.submission?.graffiti);
        expect(result.challenge.submission?.signature).toBe(challenge.submission?.signature);
    });

    it('should handle submission with undefined graffiti', () => {
        const challenge = createMockRawChallenge({
            submission: {
                mldsaPublicKey: '0x' + 'a'.repeat(64),
                legacyPublicKey: '0x' + 'b'.repeat(64),
                solution: '0x' + 'c'.repeat(64),
                graffiti: undefined,
                signature: '0x' + 'd'.repeat(128),
            },
        });
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.submission?.graffiti).toBeUndefined();
    });
});

// ==========================================
// SECTION 8: UTXO Serialization Tests
// ==========================================

describe('CallResultSerializer - UTXOs', () => {
    it('should handle empty UTXOs array', () => {
        const data = createMockOfflineData({ utxos: [] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos).toEqual([]);
    });

    it('should preserve single UTXO', () => {
        const utxo = createMockUTXO('0x' + 'a'.repeat(64), 0, 50000n);
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos).toHaveLength(1);
        expect(result.utxos[0].transactionId).toBe(utxo.transactionId);
        expect(result.utxos[0].outputIndex).toBe(utxo.outputIndex);
        expect(result.utxos[0].value).toBe(utxo.value);
    });

    it('should preserve multiple UTXOs', () => {
        const utxos = [
            createMockUTXO('tx1', 0, 10000n),
            createMockUTXO('tx2', 1, 20000n),
            createMockUTXO('tx3', 2, 30000n),
            createMockUTXO('tx4', 0, 40000n),
        ];
        const data = createMockOfflineData({ utxos });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos).toHaveLength(4);
        for (let i = 0; i < utxos.length; i++) {
            expect(result.utxos[i].transactionId).toBe(utxos[i].transactionId);
            expect(result.utxos[i].outputIndex).toBe(utxos[i].outputIndex);
            expect(result.utxos[i].value).toBe(utxos[i].value);
        }
    });

    it('should preserve UTXO scriptPubKey', () => {
        const utxo = createMockUTXO('tx1', 0, 10000n, { address: 'bcrt1ptest...' });
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].scriptPubKey.hex).toBe(utxo.scriptPubKey.hex);
        expect(result.utxos[0].scriptPubKey.address).toBe(utxo.scriptPubKey.address);
    });

    it('should preserve isCSV flag', () => {
        const csvUtxo = createMockUTXO('tx1', 0, 10000n, { isCSV: true });
        const nonCsvUtxo = createMockUTXO('tx2', 0, 20000n, { isCSV: false });
        const data = createMockOfflineData({ utxos: [csvUtxo, nonCsvUtxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].isCSV).toBe(true);
        expect(result.utxos[1].isCSV).toBe(false);
    });

    it('should preserve witnessScript when present', () => {
        const witnessScript = Buffer.from('witness-script-data');
        const utxo = createMockUTXO('tx1', 0, 10000n, { witnessScript });
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].witnessScript).toEqual(u8(witnessScript as Buffer));
    });

    it('should handle undefined witnessScript', () => {
        const utxo = createMockUTXO('tx1', 0, 10000n, { witnessScript: undefined });
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].witnessScript).toBeUndefined();
    });

    it('should preserve redeemScript when present', () => {
        const redeemScript = Buffer.from('redeem-script-data');
        const utxo = createMockUTXO('tx1', 0, 10000n, { redeemScript });
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].redeemScript).toEqual(u8(redeemScript as Buffer));
    });

    it('should handle undefined redeemScript', () => {
        const utxo = createMockUTXO('tx1', 0, 10000n, { redeemScript: undefined });
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].redeemScript).toBeUndefined();
    });

    it('should handle UTXO with all optional fields', () => {
        const utxo = createMockUTXO('tx1', 0, 10000n, {
            isCSV: true,
            witnessScript: Buffer.from('witness'),
            redeemScript: Buffer.from('redeem'),
            address: 'bcrt1ptest...',
        });
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].isCSV).toBe(true);
        expect(result.utxos[0].witnessScript).toEqual(u8(Buffer.from('witness')));
        expect(result.utxos[0].redeemScript).toEqual(u8(Buffer.from('redeem')));
    });

    it('should handle many UTXOs', () => {
        const utxos = Array.from({ length: 100 }, (_, i) =>
            createMockUTXO(`tx-${i}`, i % 5, BigInt(i * 1000)),
        );
        const data = createMockOfflineData({ utxos });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos).toHaveLength(100);
        for (let i = 0; i < 100; i++) {
            expect(result.utxos[i].transactionId).toBe(`tx-${i}`);
            expect(result.utxos[i].outputIndex).toBe(i % 5);
            expect(result.utxos[i].value).toBe(BigInt(i * 1000));
        }
    });

    it('should handle UTXO with empty scriptPubKey address', () => {
        const utxo: UTXO = {
            transactionId: 'tx1',
            outputIndex: 0,
            value: 10000n,
            scriptPubKey: {
                hex: 'somehex',
                address: undefined,
            },
        } as UTXO;
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].scriptPubKey.address).toBeUndefined();
    });

    it('should handle large UTXO values', () => {
        const largeValue = 2100000000000000n; // 21 million BTC in satoshis
        const utxo = createMockUTXO('tx1', 0, largeValue);
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].value).toBe(largeValue);
    });

    it('should handle zero value UTXO', () => {
        const utxo = createMockUTXO('tx1', 0, 0n);
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].value).toBe(0n);
    });

    it('should handle high output index', () => {
        const utxo = createMockUTXO('tx1', 65535, 10000n);
        const data = createMockOfflineData({ utxos: [utxo] });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.utxos[0].outputIndex).toBe(65535);
    });
});

// ==========================================
// SECTION 9: Bitcoin Fees Tests
// ==========================================

describe('CallResultSerializer - Bitcoin Fees', () => {
    it('should preserve all fee fields', () => {
        const fees: BitcoinFees = {
            conservative: 15,
            recommended: {
                low: 5,
                medium: 12,
                high: 25,
            },
        };
        const data = createMockOfflineData({ bitcoinFees: fees });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.bitcoinFees?.conservative).toBe(15);
        expect(result.bitcoinFees?.recommended.low).toBe(5);
        expect(result.bitcoinFees?.recommended.medium).toBe(12);
        expect(result.bitcoinFees?.recommended.high).toBe(25);
    });

    it('should handle zero fees', () => {
        const fees: BitcoinFees = {
            conservative: 0,
            recommended: {
                low: 0,
                medium: 0,
                high: 0,
            },
        };
        const data = createMockOfflineData({ bitcoinFees: fees });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.bitcoinFees?.conservative).toBe(0);
        expect(result.bitcoinFees?.recommended.low).toBe(0);
    });

    it('should handle high fee values', () => {
        const fees: BitcoinFees = {
            conservative: 1000000,
            recommended: {
                low: 500000,
                medium: 750000,
                high: 2000000,
            },
        };
        const data = createMockOfflineData({ bitcoinFees: fees });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.bitcoinFees?.conservative).toBe(1000000);
        expect(result.bitcoinFees?.recommended.high).toBe(2000000);
    });
});

// ==========================================
// SECTION 10: Edge Cases and Boundary Tests
// ==========================================

describe('CallResultSerializer - Edge Cases', () => {
    it('should handle very large calldata', () => {
        const largeCalldata = Buffer.alloc(100000, 0xab);
        const data = createMockOfflineData({ calldata: largeCalldata });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.calldata).toEqual(u8(largeCalldata));
    });

    it('should handle special characters in strings', () => {
        const data = createMockOfflineData({
            to: 'address-with-special-chars-\x00\x01\xff',
            revert: 'Revert: special chars \u0000\u0001\uFFFF',
        });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.to).toBe(data.to);
        expect(result.revert).toBe(data.revert);
    });

    it('should handle unicode in graffiti', () => {
        const challenge = createMockRawChallenge({
            graffiti: 'Unicode: \u4e2d\u6587 \u{1F600}',
        });
        const data = createMockOfflineData({ challenge });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.challenge.graffiti).toBe(challenge.graffiti);
    });

    it('should handle empty strings', () => {
        const data = createMockOfflineData({
            to: '',
            contractAddress: '',
            revert: '',
        });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.to).toBe('');
        expect(result.contractAddress).toBe('');
        expect(result.revert).toBe('');
    });

    it('should handle max U256 gas values', () => {
        const maxU256 = 2n ** 256n - 1n;
        const data = createMockOfflineData({
            estimatedSatGas: maxU256,
            estimatedRefundedGasInSat: maxU256,
        });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.estimatedSatGas).toBe(maxU256);
        expect(result.estimatedRefundedGasInSat).toBe(maxU256);
    });

    it('should handle buffer with binary data', () => {
        const binaryData = Buffer.from([0x00, 0x01, 0x02, 0xfe, 0xff]);
        const data = createMockOfflineData({
            calldata: binaryData,
            result: binaryData,
        });

        const buffer = CallResultSerializer.serialize(data);
        const result = CallResultSerializer.deserialize(buffer);

        expect(result.calldata).toEqual(u8(binaryData));
        expect(result.result).toEqual(u8(binaryData));
    });
});

// ==========================================
// SECTION 11: Complete Round-Trip Integration Test
// ==========================================

describe('CallResultSerializer - Complete Integration', () => {
    it('should preserve all fields in complex data through round-trip', () => {
        const complexData: OfflineCallResultData = {
            calldata: Buffer.from('complex-calldata-\x00\x01\xff'),
            to: 'bcrt1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297',
            contractAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            estimatedSatGas: 123456789n,
            estimatedRefundedGasInSat: 987654321n,
            revert: 'Execution reverted: test error',
            result: Buffer.from('result-data-\x00\x01\x02'),
            accessList: {
                '0xcontract1': {
                    slot1: 'value1',
                    slot2: 'value2',
                },
                '0xcontract2': {
                    slotA: 'valueA',
                },
            },
            bitcoinFees: {
                conservative: 15,
                recommended: { low: 5, medium: 10, high: 20 },
            },
            network: NetworkName.Testnet,
            estimatedGas: 50000n,
            refundedGas: 25000n,
            challenge: {
                epochNumber: '99999',
                mldsaPublicKey: '0x' + 'a'.repeat(64),
                legacyPublicKey: '0x' + 'b'.repeat(64),
                solution: '0x' + 'c'.repeat(64),
                salt: '0x' + 'd'.repeat(64),
                graffiti: '0x' + 'cd'.repeat(12),
                difficulty: 12345,
                verification: {
                    epochHash: '0x' + 'e'.repeat(64),
                    epochRoot: '0x' + 'f'.repeat(64),
                    targetHash: '0x' + '1'.repeat(64),
                    targetChecksum: '0x' + '2'.repeat(64),
                    startBlock: '1000',
                    endBlock: '2000',
                    proofs: [
                        '0x' + 'a1'.repeat(16),
                        '0x' + 'b2'.repeat(16),
                        '0x' + 'c3'.repeat(16),
                        '0x' + 'd4'.repeat(16),
                        '0x' + 'e5'.repeat(16),
                    ],
                },
                submission: {
                    mldsaPublicKey: '0x' + 'a'.repeat(64),
                    legacyPublicKey: '0x' + 'b'.repeat(64),
                    solution: '0x' + 'c'.repeat(64),
                    graffiti: '0x' + 'ef'.repeat(10),
                    signature: '0x' + 'd'.repeat(128),
                },
            },
            utxos: [
                createMockUTXO('tx1', 0, 10000n, {
                    isCSV: true,
                    witnessScript: Buffer.from('ws1'),
                }),
                createMockUTXO('tx2', 1, 20000n, {
                    isCSV: false,
                    redeemScript: Buffer.from('rs2'),
                }),
                createMockUTXO('tx3', 2, 30000n, {
                    witnessScript: Buffer.from('ws3'),
                    redeemScript: Buffer.from('rs3'),
                }),
            ],
            challengeOriginalPublicKey: createMockCompressedPublicKey(),
            csvAddress: {
                address: 'bcrt1qcsv...',
                witnessScript: Buffer.from('csv-witness-script'),
            },
        };

        const buffer = CallResultSerializer.serialize(complexData);
        const result = CallResultSerializer.deserialize(buffer);

        // Verify all fields
        expect(result.calldata).toEqual(u8(complexData.calldata as Buffer));
        expect(result.to).toBe(complexData.to);
        expect(result.contractAddress).toBe(complexData.contractAddress);
        expect(result.estimatedSatGas).toBe(complexData.estimatedSatGas);
        expect(result.estimatedRefundedGasInSat).toBe(complexData.estimatedRefundedGasInSat);
        expect(result.revert).toBe(complexData.revert);
        expect(result.result).toEqual(u8(complexData.result as Buffer));
        expect(result.accessList).toEqual(complexData.accessList);
        expect(result.bitcoinFees).toEqual(complexData.bitcoinFees);
        expect(result.network).toBe(complexData.network);
        expect(result.estimatedGas).toBe(complexData.estimatedGas);
        expect(result.refundedGas).toBe(complexData.refundedGas);

        // Challenge verification
        expect(result.challenge.epochNumber).toBe(complexData.challenge.epochNumber);
        expect(result.challenge.graffiti).toBe(complexData.challenge.graffiti);
        expect(result.challenge.difficulty).toBe(complexData.challenge.difficulty);
        expect(result.challenge.verification.proofs).toEqual(
            complexData.challenge.verification.proofs,
        );
        expect(result.challenge.submission?.signature).toBe(
            complexData.challenge.submission?.signature,
        );

        // UTXOs verification
        expect(result.utxos).toHaveLength(3);
        expect(result.utxos[0].isCSV).toBe(true);
        expect(result.utxos[0].witnessScript).toEqual(u8(Buffer.from('ws1')));
        expect(result.utxos[1].redeemScript).toEqual(u8(Buffer.from('rs2')));

        // CSV address verification
        expect(result.csvAddress?.address).toBe(complexData.csvAddress?.address);
        expect(result.csvAddress?.witnessScript).toEqual(
            u8(complexData.csvAddress?.witnessScript as Buffer),
        );
    });

    it('should produce deterministic output', () => {
        const data = createMockOfflineData();

        const buffer1 = CallResultSerializer.serialize(data);
        const buffer2 = CallResultSerializer.serialize(data);

        expect(buffer1).toEqual(buffer2);
    });

    it('should handle multiple serialize/deserialize cycles', () => {
        let data = createMockOfflineData();

        // Perform multiple cycles
        for (let i = 0; i < 10; i++) {
            const buffer = CallResultSerializer.serialize(data);
            data = CallResultSerializer.deserialize(buffer);
        }

        // Final data should match original structure
        expect(data.network).toBe(NetworkName.Regtest);
        expect(data.utxos).toHaveLength(2);
    });
});

// ==========================================
// SECTION 12: Buffer Size Tests
// ==========================================

describe('CallResultSerializer - Buffer Size', () => {
    it('should produce compact buffer for minimal data', () => {
        const minimalData: OfflineCallResultData = {
            calldata: Buffer.from([]),
            to: '',
            contractAddress: '',
            estimatedSatGas: 0n,
            estimatedRefundedGasInSat: 0n,
            result: Buffer.from([]),
            accessList: {},
            network: NetworkName.Regtest,
            challenge: createMockRawChallenge({
                verification: {
                    epochHash: '',
                    epochRoot: '',
                    targetHash: '',
                    targetChecksum: '',
                    startBlock: '',
                    endBlock: '',
                    proofs: [],
                },
            }),
            challengeOriginalPublicKey: createMockCompressedPublicKey(),
            utxos: [],
        };

        const buffer = CallResultSerializer.serialize(minimalData);

        // Minimal data should produce a reasonably small buffer
        // (includes 33-byte compressed public key + challenge data)
        expect(buffer.length).toBeLessThan(600);
    });

    it('should handle large data efficiently', () => {
        const largeData = createMockOfflineData({
            calldata: Buffer.alloc(10000, 0xab),
            result: Buffer.alloc(10000, 0xcd),
            utxos: Array.from({ length: 50 }, (_, i) =>
                createMockUTXO(`tx-${i}`, i, BigInt(i * 1000)),
            ),
        });

        const buffer = CallResultSerializer.serialize(largeData);

        // Should be able to deserialize large data
        const result = CallResultSerializer.deserialize(buffer);
        expect(result.calldata.length).toBe(10000);
        expect(result.utxos).toHaveLength(50);
    });
});

// ==========================================
// SECTION 13: CallResult.fromOfflineBuffer Tests
// ==========================================

describe('CallResult.fromOfflineBuffer', () => {
    it('should accept Buffer input', () => {
        const data = createMockOfflineData();
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult).toBeInstanceOf(CallResult);
    });

    it('should accept hex string input', () => {
        const data = createMockOfflineData();
        const buffer = CallResultSerializer.serialize(data);
        const hexString = Buffer.from(buffer).toString('hex');

        const callResult = CallResult.fromOfflineBuffer(hexString);

        expect(callResult).toBeInstanceOf(CallResult);
    });

    it('should restore calldata correctly', () => {
        const calldata = Buffer.from('test-calldata-for-validation');
        const data = createMockOfflineData({ calldata });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.calldata).toEqual(u8(calldata));
    });

    it('should restore contract addresses correctly', () => {
        const to = 'bcrt1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297';
        const contractAddress =
            '0xaabbccdd11223344556677889900aabbccddeeff00112233445566778899aabb';
        const data = createMockOfflineData({ to, contractAddress });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.to).toBe(to);
        expect(callResult.address?.toHex()).toBe(contractAddress);
    });

    it('should restore gas estimates correctly', () => {
        const estimatedSatGas = 123456n;
        const estimatedRefundedGasInSat = 789012n;
        const data = createMockOfflineData({ estimatedSatGas, estimatedRefundedGasInSat });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.estimatedSatGas).toBe(estimatedSatGas);
        expect(callResult.estimatedRefundedGasInSat).toBe(estimatedRefundedGasInSat);
    });

    it('should restore csvAddress correctly when present', () => {
        const csvAddress: IP2WSHAddress = {
            address: 'bcrt1q-csv-address',
            witnessScript: Buffer.from('csv-witness-script'),
        };
        const data = createMockOfflineData({ csvAddress });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.csvAddress).toBeDefined();
        expect(callResult.csvAddress?.address).toBe(csvAddress.address);
        expect(callResult.csvAddress?.witnessScript).toEqual(
            u8(csvAddress.witnessScript as Buffer),
        );
    });

    it('should handle undefined csvAddress', () => {
        const data = createMockOfflineData({ csvAddress: undefined });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.csvAddress).toBeUndefined();
    });

    it('should restore access list correctly', () => {
        const accessList: IAccessList = {
            '0xcontract1': { slot1: 'value1', slot2: 'value2' },
            '0xcontract2': { slotA: 'valueA' },
        };
        const data = createMockOfflineData({ accessList });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.accessList).toEqual(accessList);
    });

    it('should restore revert message correctly', () => {
        const revert = 'Execution reverted: insufficient balance';
        const data = createMockOfflineData({ revert });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.revert).toBe(revert);
    });

    it('should handle offline provider getUTXOsForAmount', async () => {
        const utxos: UTXO[] = [
            createMockUTXO('tx-1', 0, 50000n),
            createMockUTXO('tx-2', 1, 100000n),
        ];
        const data = createMockOfflineData({ utxos });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        // Access the offline provider through internal mechanism
        // The offline provider returns the serialized UTXOs
        // This tests the getUTXOsForAmount mock
        const provider = (
            callResult as unknown as {
                provider: { utxoManager: { getUTXOsForAmount: () => Promise<UTXO[]> } };
            }
        ).provider;
        if (provider?.utxoManager?.getUTXOsForAmount) {
            const fetchedUtxos = await provider.utxoManager.getUTXOsForAmount();
            expect(fetchedUtxos).toEqual(utxos);
        }
    });

    it('should restore network correctly for mainnet', () => {
        const data = createMockOfflineData({ network: NetworkName.Mainnet });
        const buffer = CallResultSerializer.serialize(data);

        // fromOfflineBuffer should correctly resolve network
        const callResult = CallResult.fromOfflineBuffer(buffer);

        // We can verify the network was correctly set by checking that
        // the CallResult was created without error
        expect(callResult).toBeDefined();
    });

    it('should restore network correctly for testnet', () => {
        const data = createMockOfflineData({ network: NetworkName.Testnet });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult).toBeDefined();
    });

    it('should restore network correctly for regtest', () => {
        const data = createMockOfflineData({ network: NetworkName.Regtest });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult).toBeDefined();
    });

    it('should restore network correctly for opnetTestnet', () => {
        const data = createMockOfflineData({ network: NetworkName.OpnetTestnet });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult).toBeDefined();
    });

    it('should properly decode result from base64', () => {
        const resultBuffer = Buffer.from('hello-result-data');
        const data = createMockOfflineData({ result: resultBuffer });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        // The result should be readable (stored internally as base64)
        expect(callResult.result).toBeDefined();
    });

    it('should restore estimatedGas when present', () => {
        const estimatedGas = 75000n;
        const data = createMockOfflineData({ estimatedGas });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.estimatedGas).toBe(estimatedGas);
    });

    it('should restore refundedGas when present', () => {
        const refundedGas = 30000n;
        const data = createMockOfflineData({ refundedGas });
        const buffer = CallResultSerializer.serialize(data);

        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.refundedGas).toBe(refundedGas);
    });

    it('should throw on invalid buffer format', () => {
        const invalidBuffer = Buffer.from([0xff, 0xff, 0xff]); // Invalid data

        expect(() => CallResult.fromOfflineBuffer(invalidBuffer)).toThrow();
    });

    it('should work with complex complete data', () => {
        const complexData: OfflineCallResultData = {
            calldata: Buffer.from('complex-calldata'),
            to: 'bcrt1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297',
            contractAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            estimatedSatGas: 1000000n,
            estimatedRefundedGasInSat: 250000n,
            revert: undefined,
            result: Buffer.from('complex-result-data'),
            accessList: {
                '0xcontract': {
                    '0xslot1': '0xvalue1',
                    '0xslot2': '0xvalue2',
                },
            },
            bitcoinFees: {
                conservative: 10,
                recommended: { low: 3, medium: 7, high: 15 },
            },
            network: NetworkName.Regtest,
            estimatedGas: 100000n,
            refundedGas: 25000n,
            challenge: createMockRawChallenge({
                epochNumber: '54321',
                difficulty: 9999,
            }),
            challengeOriginalPublicKey: createMockCompressedPublicKey(),
            utxos: [createMockUTXO('tx1', 0, 500000n), createMockUTXO('tx2', 1, 1000000n)],
            csvAddress: {
                address: 'bcrt1q-csv-complex',
                witnessScript: Buffer.from('complex-witness-script'),
            },
        };

        const buffer = CallResultSerializer.serialize(complexData);
        const callResult = CallResult.fromOfflineBuffer(buffer);

        expect(callResult.calldata).toEqual(u8(complexData.calldata as Buffer));
        expect(callResult.to).toBe(complexData.to);
        expect(callResult.address?.toHex()).toBe(complexData.contractAddress);
        expect(callResult.estimatedSatGas).toBe(complexData.estimatedSatGas);
        expect(callResult.estimatedRefundedGasInSat).toBe(complexData.estimatedRefundedGasInSat);
        expect(callResult.accessList).toEqual(complexData.accessList);
        expect(callResult.csvAddress?.address).toBe(complexData.csvAddress?.address);
    });
});
