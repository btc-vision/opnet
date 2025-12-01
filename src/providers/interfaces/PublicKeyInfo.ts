import { Address, MLDSASecurityLevel } from '@btc-vision/transaction';

export interface PublicKeyInfo {
    //readonly mldsaPublicKey: string;
    readonly mldsaAddress: string;

    readonly originalPubKey?: string;
    readonly tweakedPubkey: string;

    readonly p2op: string;

    readonly lowByte?: number;

    readonly p2pkh?: string;
    readonly p2pkhHybrid?: string;
    readonly p2pkhUncompressed?: string;
    readonly p2shp2wpkh?: string;
    readonly p2wpkh?: string;

    readonly mldsaHashedPublicKey?: string;
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
