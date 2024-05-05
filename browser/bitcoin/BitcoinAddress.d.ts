/// <reference types="node" />
import { Network } from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
import { BitcoinAddressLike } from '../common/CommonTypes.js';
export declare class BitcoinAddress {
    #private;
    private readonly network;
    constructor(keypair: ECPairInterface, network?: Network);
    get taprootAddress(): string;
    get p2wpkhAddress(): string;
    get publicKey(): Buffer;
    get privateKey(): Buffer | undefined;
    static isValidTaprootAddress(_addr: BitcoinAddressLike, network?: Network): boolean;
    static fromPublicKey(publicKey: Buffer, network?: Network): BitcoinAddress;
    static fromPrivateKey(privateKey: Buffer, network?: Network): BitcoinAddress;
    static fromWif(wif: string, network?: Network): BitcoinAddress;
    [Symbol.toStringTag](): string;
    private getP2WPKHAddress;
    private getTaprootAddress;
}
