import { Network, PsbtOutputExtended } from '@btc-vision/bitcoin';
import { AddressTypes, AddressVerificator, UTXO } from '@btc-vision/transaction';

export class TransactionHelper {
    public static estimateMiningCost(
        utxos: readonly UTXO[],
        extraOutputs: readonly PsbtOutputExtended[],
        opReturnLen: number,
        network: Network,
        feeRate: number, // sat / vB
    ): bigint {
        const vBytes = this.estimateVBytes(utxos, extraOutputs, opReturnLen, network);
        return BigInt(Math.ceil(vBytes * feeRate));
    }

    private static varIntLen(n: number): number {
        return n < 0xfd ? 1 : n <= 0xffff ? 3 : n <= 0xffffffff ? 5 : 9;
    }

    private static estimateVBytes(
        utxos: readonly UTXO[],
        extraOutputs: readonly PsbtOutputExtended[],
        scriptLength: number,
        network: Network,
    ): number {
        const INPUT_WU: Record<AddressTypes, number> = {
            [AddressTypes.P2PKH]: 148 * 4,
            [AddressTypes.P2SH_OR_P2SH_P2WPKH]: 91 * 4 + 107,
            [AddressTypes.P2WPKH]: 41 * 4 + 107,
            [AddressTypes.P2TR]: 41 * 4 + 65,
            [AddressTypes.P2MR]: 41 * 4 + 33,
            [AddressTypes.P2PK]: 148 * 4,
            [AddressTypes.P2WSH]: 41 * 4 + (1 + 73 + 1 + 33),
            [AddressTypes.P2OP]: 41 * 4 + 107,
            [AddressTypes.P2WDA]: 41 * 4 + 253,
        };

        const OUTPUT_BYTES: Record<AddressTypes, number> = {
            [AddressTypes.P2PKH]: 34,
            [AddressTypes.P2SH_OR_P2SH_P2WPKH]: 32,
            [AddressTypes.P2WPKH]: 31,
            [AddressTypes.P2TR]: 43,
            [AddressTypes.P2MR]: 43,
            [AddressTypes.P2PK]: 34,
            [AddressTypes.P2OP]: 32,
            [AddressTypes.P2WSH]: 43,
            [AddressTypes.P2WDA]: 43,
        };

        const ins: readonly UTXO[] = utxos.length ? utxos : new Array(3).fill(null); // simulate 3 taproot

        let weight = 0;

        // version + locktime
        weight += 8 * 4;

        // segwit marker+flag
        const usesWitness =
            utxos.length === 0 ||
            utxos.some((u) => {
                const t = AddressVerificator.detectAddressType(
                    u?.scriptPubKey?.address ?? '',
                    network,
                );

                return (
                    t === AddressTypes.P2WPKH ||
                    t === AddressTypes.P2SH_OR_P2SH_P2WPKH ||
                    t === AddressTypes.P2TR ||
                    t === AddressTypes.P2MR ||
                    t === AddressTypes.P2OP ||
                    t === AddressTypes.P2WSH
                );
            });

        if (usesWitness) weight += 2 * 4;

        // var-int counts
        weight += this.varIntLen(ins.length) * 4;
        weight += this.varIntLen(extraOutputs.length) * 4;

        // inputs
        for (const u of ins) {
            const t =
                utxos.length === 0
                    ? AddressTypes.P2TR
                    : (AddressVerificator.detectAddressType(
                          u?.scriptPubKey?.address ?? '',
                          network,
                      ) ?? AddressTypes.P2PKH);

            weight += INPUT_WU[t] ?? 110 * 4;
        }

        // caller-supplied outputs
        for (const o of extraOutputs) {
            if ('address' in o) {
                const t =
                    AddressVerificator.detectAddressType(o.address, network) ?? AddressTypes.P2PKH;

                weight += (OUTPUT_BYTES[t] ?? 40) * 4;
            } else if ('script' in o) {
                const scriptLen = o.script.length;
                const bytes = 8 + this.varIntLen(scriptLen) + scriptLen;

                weight += bytes * 4;
            } else {
                weight += 34 * 4;
            }
        }

        const witnessBytes = 1 + 3 * (this.varIntLen(32) + 32);
        weight += witnessBytes;

        const stackItemScript = this.varIntLen(scriptLength) + scriptLength;
        const controlBlock = 1 + 33;
        weight += stackItemScript + controlBlock;

        return Math.ceil(weight / 4);
    }
}
