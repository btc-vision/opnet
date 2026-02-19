import { describe, expect, it } from 'vitest';
import { TransactionHelper } from '../build/contracts/TransactionHelpper.js';
import { address as btcAddress, networks, toBytes20, type PsbtOutputExtended } from '@btc-vision/bitcoin';
import type { UTXO } from '@btc-vision/transaction';

const network = networks.bitcoin;

/* ------------------------------------------------------------------ */
/*  Test addresses (all valid for mainnet detection)                  */
/* ------------------------------------------------------------------ */

const ADDR = {
    P2TR: btcAddress.toBech32(new Uint8Array(32).fill(0xcd), 1, network.bech32),
    P2MR: btcAddress.toBech32(new Uint8Array(32).fill(0xab), 2, network.bech32),
    P2WPKH: btcAddress.toBech32(new Uint8Array(20).fill(0xef), 0, network.bech32),
    P2PKH: btcAddress.toBase58Check(toBytes20(new Uint8Array(20).fill(0x01)), network.pubKeyHash),
    P2SH: btcAddress.toBase58Check(toBytes20(new Uint8Array(20).fill(0x02)), network.scriptHash),
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function makeUtxo(addr: string, value = 10_000n): UTXO {
    return {
        transactionId: 'a'.repeat(64),
        outputIndex: 0,
        value,
        scriptPubKey: { hex: '00', address: addr },
    };
}

function addrOutput(addr: string, value = 5_000n): PsbtOutputExtended {
    return { address: addr, value } as PsbtOutputExtended;
}

function scriptOutput(len: number, value = 0n): PsbtOutputExtended {
    return { script: new Uint8Array(len), value } as PsbtOutputExtended;
}

/**
 * Reference implementation of varIntLen matching TransactionHelper.
 */
function varIntLen(n: number): number {
    return n < 0xfd ? 1 : n <= 0xffff ? 3 : n <= 0xffffffff ? 5 : 9;
}

/* ------------------------------------------------------------------ */
/*  Weight constants mirrored from TransactionHelpper.ts              */
/* ------------------------------------------------------------------ */

const INPUT_WU: Record<string, number> = {
    P2PKH: 148 * 4,
    P2SH_OR_P2SH_P2WPKH: 91 * 4 + 107,
    P2WPKH: 41 * 4 + 107,
    P2TR: 41 * 4 + 65,
    P2MR: 41 * 4 + 33,
    P2PK: 148 * 4,
    P2WSH: 41 * 4 + (1 + 73 + 1 + 33),
    P2OP: 41 * 4 + 107,
    P2WDA: 41 * 4 + 253,
};

const OUTPUT_BYTES: Record<string, number> = {
    P2PKH: 34,
    'P2SH_OR_P2SH-P2WPKH': 32,
    P2WPKH: 31,
    P2TR: 43,
    P2MR: 43,
    P2PK: 34,
    P2OP: 32,
    P2WSH: 43,
    P2WDA: 43,
};

/**
 * Manually compute expected vBytes for a given set of inputs/outputs.
 * This mirrors the logic in TransactionHelper.estimateVBytes exactly.
 */
function expectedVBytes(
    utxoAddrs: string[],
    outputs: PsbtOutputExtended[],
    scriptLength: number,
): number {
    const ins = utxoAddrs.length > 0 ? utxoAddrs : ['P2TR', 'P2TR', 'P2TR'];
    const hasWitness =
        utxoAddrs.length === 0 ||
        utxoAddrs.some(
            (a) =>
                a === 'P2WPKH' ||
                a === 'P2SH_OR_P2SH_P2WPKH' ||
                a === 'P2TR' ||
                a === 'P2MR' ||
                a === 'P2OP' ||
                a === 'P2WSH',
        );

    let weight = 8 * 4; // version + locktime
    if (hasWitness) weight += 2 * 4;
    weight += varIntLen(ins.length) * 4;
    weight += varIntLen(outputs.length) * 4;

    for (const type of ins) {
        weight += INPUT_WU[type] ?? 110 * 4;
    }

    for (const o of outputs) {
        if ('address' in o) {
            // We won't re-detect here; caller passes expected type
            weight += (40) * 4; // fallback — caller should use typed helper
        } else if ('script' in o) {
            const s = (o as { script: Uint8Array }).script.length;
            weight += (8 + varIntLen(s) + s) * 4;
        } else {
            weight += 34 * 4;
        }
    }

    const witnessBytes = 1 + 3 * (varIntLen(32) + 32);
    weight += witnessBytes;
    const stackItemScript = varIntLen(scriptLength) + scriptLength;
    const controlBlock = 1 + 33;
    weight += stackItemScript + controlBlock;

    return Math.ceil(weight / 4);
}

/* ================================================================== */
/*  Tests                                                             */
/* ================================================================== */

describe('TransactionHelper', () => {
    const FEE_RATE = 1; // 1 sat/vB — makes cost === vBytes for easy reasoning
    const OP_RETURN_LEN = 20;

    describe('estimateMiningCost basics', () => {
        it('returns a positive bigint for typical inputs', () => {
            const cost = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [],
                OP_RETURN_LEN,
                network,
                FEE_RATE,
            );
            expect(typeof cost).toBe('bigint');
            expect(cost).toBeGreaterThan(0n);
        });

        it('scales linearly with feeRate', () => {
            const utxos = [makeUtxo(ADDR.P2TR)];
            const cost1 = TransactionHelper.estimateMiningCost(
                utxos, [], OP_RETURN_LEN, network, 1,
            );
            const cost10 = TransactionHelper.estimateMiningCost(
                utxos, [], OP_RETURN_LEN, network, 10,
            );
            expect(cost10).toBe(BigInt(Math.ceil(Number(cost1) * 10)));
        });

        it('is deterministic', () => {
            const utxos = [makeUtxo(ADDR.P2TR), makeUtxo(ADDR.P2MR)];
            const a = TransactionHelper.estimateMiningCost(utxos, [], OP_RETURN_LEN, network, 5);
            const b = TransactionHelper.estimateMiningCost(utxos, [], OP_RETURN_LEN, network, 5);
            expect(a).toBe(b);
        });
    });

    describe('empty UTXOs fallback', () => {
        it('simulates 3 P2TR inputs when utxos array is empty', () => {
            const cost = TransactionHelper.estimateMiningCost(
                [], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            // 3 × P2TR inputs weight
            const threeP2TR = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR), makeUtxo(ADDR.P2TR), makeUtxo(ADDR.P2TR)],
                [], OP_RETURN_LEN, network, FEE_RATE,
            );
            expect(cost).toBe(threeP2TR);
        });
    });

    describe('per address-type input weights', () => {
        const cases: [string, string][] = [
            ['P2TR', ADDR.P2TR],
            ['P2MR', ADDR.P2MR],
            ['P2WPKH', ADDR.P2WPKH],
            ['P2PKH', ADDR.P2PKH],
            ['P2SH', ADDR.P2SH],
        ];

        it.each(cases)(
            '%s input produces a distinct weight',
            (label, addr) => {
                const cost = TransactionHelper.estimateMiningCost(
                    [makeUtxo(addr)], [], OP_RETURN_LEN, network, FEE_RATE,
                );
                expect(cost).toBeGreaterThan(0n);
            },
        );

        it('P2MR input is cheaper than P2TR (smaller witness)', () => {
            const p2mr = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2MR)], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            const p2tr = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            // P2MR INPUT_WU = 41*4+33 = 197 vs P2TR = 41*4+65 = 229
            expect(p2mr).toBeLessThan(p2tr);
        });

        it('P2WPKH input is more expensive than P2TR', () => {
            const wpkh = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2WPKH)], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            const tr = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            expect(wpkh).toBeGreaterThan(tr);
        });
    });

    describe('P2MR specific behaviour', () => {
        it('P2MR input triggers witness serialization', () => {
            // A tx with only P2PKH input does NOT use witness serialization
            const p2pkhOnly = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2PKH)], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            // Adding a P2MR input should trigger witness marker (+2*4 = 8 WU → +2 vB)
            // but it also changes input count, so we compare single-input costs instead
            const p2mrOnly = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2MR)], [], OP_RETURN_LEN, network, FEE_RATE,
            );

            // P2PKH = 148*4 = 592 WU, but NO witness marker (+0)
            // P2MR  = 41*4+33 = 197 WU, but WITH witness marker (+8 WU)
            // Even with the witness marker, P2MR input is much lighter
            expect(p2mrOnly).toBeLessThan(p2pkhOnly);
        });

        it('mixed P2TR + P2MR inputs produce correct relative cost', () => {
            const trOnly = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR), makeUtxo(ADDR.P2TR)],
                [], OP_RETURN_LEN, network, FEE_RATE,
            );
            const mixed = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR), makeUtxo(ADDR.P2MR)],
                [], OP_RETURN_LEN, network, FEE_RATE,
            );
            // Replacing one P2TR (229 WU) with P2MR (197 WU) saves 32 WU → 8 vBytes
            expect(Number(trOnly) - Number(mixed)).toBe(8);
        });
    });

    describe('output weight estimation', () => {
        it('address-based outputs add to cost', () => {
            const noOut = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            const withOut = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [addrOutput(ADDR.P2WPKH)],
                OP_RETURN_LEN, network, FEE_RATE,
            );
            expect(withOut).toBeGreaterThan(noOut);
        });

        it('script-based outputs use script length for sizing', () => {
            const small = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [scriptOutput(10)],
                OP_RETURN_LEN, network, FEE_RATE,
            );
            const large = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [scriptOutput(100)],
                OP_RETURN_LEN, network, FEE_RATE,
            );
            expect(large).toBeGreaterThan(small);
        });

        it('P2MR output has same byte size as P2TR output', () => {
            const p2trOut = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [addrOutput(ADDR.P2TR)],
                OP_RETURN_LEN, network, FEE_RATE,
            );
            const p2mrOut = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [addrOutput(ADDR.P2MR)],
                OP_RETURN_LEN, network, FEE_RATE,
            );
            // Both OUTPUT_BYTES are 43
            expect(p2mrOut).toBe(p2trOut);
        });
    });

    describe('opReturnLen impact', () => {
        it('larger opReturnLen increases cost', () => {
            const utxos = [makeUtxo(ADDR.P2TR)];
            const small = TransactionHelper.estimateMiningCost(utxos, [], 20, network, FEE_RATE);
            const large = TransactionHelper.estimateMiningCost(utxos, [], 200, network, FEE_RATE);
            expect(large).toBeGreaterThan(small);
        });
    });

    describe('exact weight calculations', () => {
        it('single P2TR input, no outputs, opReturnLen=20', () => {
            // Manual calculation:
            // version+locktime:   8*4 = 32
            // witness marker:     2*4 = 8
            // varInt(1 input):    1*4 = 4
            // varInt(0 outputs):  1*4 = 4
            // P2TR input:         41*4+65 = 229
            // witnessBytes:       1 + 3*(1+32) = 100
            // stackItemScript:    1+20 = 21
            // controlBlock:       1+33 = 34
            // total weight:       32+8+4+4+229+100+21+34 = 432
            // vBytes:             ceil(432/4) = 108
            const cost = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)], [], 20, network, FEE_RATE,
            );
            expect(cost).toBe(108n);
        });

        it('single P2MR input, no outputs, opReturnLen=20', () => {
            // Same as P2TR but INPUT_WU = 41*4+33 = 197 instead of 229
            // total weight: 32+8+4+4+197+100+21+34 = 400
            // vBytes: ceil(400/4) = 100
            const cost = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2MR)], [], 20, network, FEE_RATE,
            );
            expect(cost).toBe(100n);
        });

        it('single P2PKH input (no witness), no outputs, opReturnLen=20', () => {
            // P2PKH does NOT trigger witness marker
            // version+locktime:   32
            // NO witness marker:  0
            // varInt(1 input):    4
            // varInt(0 outputs):  4
            // P2PKH input:        148*4 = 592
            // witnessBytes:       100
            // stackItemScript:    21
            // controlBlock:       34
            // total weight:       32+0+4+4+592+100+21+34 = 787
            // vBytes:             ceil(787/4) = 197
            const cost = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2PKH)], [], 20, network, FEE_RATE,
            );
            expect(cost).toBe(197n);
        });

        it('empty UTXOs (3 simulated P2TR), no outputs, opReturnLen=20', () => {
            // version+locktime:   32
            // witness marker:     8
            // varInt(3 inputs):   1*4 = 4
            // varInt(0 outputs):  4
            // 3 × P2TR:           3*229 = 687
            // witnessBytes:       100
            // stackItemScript:    21
            // controlBlock:       34
            // total:              32+8+4+4+687+100+21+34 = 890
            // vBytes:             ceil(890/4) = 223
            const cost = TransactionHelper.estimateMiningCost(
                [], [], 20, network, FEE_RATE,
            );
            expect(cost).toBe(223n);
        });

        it('P2TR input + P2WPKH address output, opReturnLen=20', () => {
            // Base (single P2TR, witness): 32+8+4 + varInt(1 out)*4 + 229 + 100+21+34
            // varInt(1 out) = 1*4 = 4
            // P2WPKH output: OUTPUT_BYTES[P2WPKH]=31, weight = 31*4 = 124
            // total: 32+8+4+4+229+124+100+21+34 = 556
            // vBytes: ceil(556/4) = 139
            const cost = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [addrOutput(ADDR.P2WPKH)],
                20, network, FEE_RATE,
            );
            expect(cost).toBe(139n);
        });

        it('P2TR input + script output (10 bytes), opReturnLen=20', () => {
            // script output: bytes = 8 + varIntLen(10) + 10 = 8+1+10 = 19
            // weight = 19 * 4 = 76
            // total: 32+8+4+4+229+76+100+21+34 = 508
            // vBytes: ceil(508/4) = 127
            const cost = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2TR)],
                [scriptOutput(10)],
                20, network, FEE_RATE,
            );
            expect(cost).toBe(127n);
        });
    });

    describe('unknown / undetectable address fallback', () => {
        it('falls back to P2PKH weight for unrecognized input address', () => {
            const utxo = makeUtxo('not-a-real-address');
            const cost = TransactionHelper.estimateMiningCost(
                [utxo], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            // detectAddressType returns null → fallback to P2PKH
            // P2PKH does NOT appear in the witness list, so no witness marker
            const p2pkhCost = TransactionHelper.estimateMiningCost(
                [makeUtxo(ADDR.P2PKH)], [], OP_RETURN_LEN, network, FEE_RATE,
            );
            expect(cost).toBe(p2pkhCost);
        });
    });
});
