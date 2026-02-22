import { address as btcAddress, Network } from '@btc-vision/bitcoin';

/** Witness version used by P2MR (BIP 360) outputs. */
const P2MR_WITNESS_VERSION = 2;
/** Expected byte length of the P2MR witness program (Merkle root). */
const P2MR_DATA_LENGTH = 32;

/**
 * Detect whether {@link addr} is a Pay-to-Merkle-Root (BIP 360) address.
 *
 * P2MR addresses encode witness version 2 with a 32-byte Merkle root using
 * bech32m.  On mainnet they carry the `bc1z` prefix; on testnet `tb1z`;
 * on opnetTestnet `opt1z`; on regtest `bcrt1z`.
 *
 * @param addr    - The address string to test.
 * @param network - The Bitcoin network to validate against.
 * @returns `true` when the address is a valid P2MR address for the given
 *          network.
 */
export function isP2MRAddress(addr: string, network: Network): boolean {
    try {
        const decoded = btcAddress.fromBech32(addr);

        return (
            decoded.prefix === network.bech32 &&
            decoded.version === P2MR_WITNESS_VERSION &&
            decoded.data.length === P2MR_DATA_LENGTH
        );
    } catch {
        return false;
    }
}
