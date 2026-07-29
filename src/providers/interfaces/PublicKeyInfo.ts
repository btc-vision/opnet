import { Address, MLDSASecurityLevel } from '@btc-vision/transaction';

export interface PublicKeyInfo {
    readonly originalPubKey?: string;
    readonly tweakedPubkey?: string;

    readonly p2tr?: string;
    readonly p2op?: string;

    readonly lowByte?: number;

    readonly p2pkh?: string;
    readonly p2pkhUncompressed?: string;
    readonly p2pkhHybrid?: string;

    readonly p2shp2wpkh?: string;
    readonly p2wpkh?: string;

    /**
     * The 32-byte OPNet identity.
     *
     * NOT a linkage signal. When the node is queried with a 32-byte key this is
     * the echoed input — it is the identity the caller asked about and what the
     * address and p2op are derived from, so it is present whether or not a link
     * exists on-chain. Use {@link mldsaLinked} to test linkage.
     */
    readonly mldsaHashedPublicKey?: string;

    /**
     * Whether an ML-DSA link actually exists on-chain for the queried key.
     *
     * Branch on this — not on the presence of {@link mldsaHashedPublicKey} — when
     * deciding whether a link request must reveal the ML-DSA public key. Getting
     * it wrong means skipping the reveal on a FIRST link, which the node rejects
     * with "A new ML-DSA link must reveal the public key and a valid ML-DSA
     * signature."
     *
     * Undefined when talking to a node older than this field.
     */
    readonly mldsaLinked?: boolean;

    readonly mldsaLevel?: MLDSASecurityLevel;
    readonly mldsaPublicKey?: string | null;
}

export interface IPubKeyNotFoundError {
    readonly error: string;
}

export interface IPublicKeyInfoResult {
    [key: string]: PublicKeyInfo | IPubKeyNotFoundError;
}

export interface AddressesInfo {
    [key: string]: Address;
}
