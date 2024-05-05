import * as ecc from '@bitcoinerlab/secp256k1';
import { address, initEccLib, Network, networks, payments } from 'bitcoinjs-lib';
import { ECPairFactory, ECPairInterface } from 'ecpair';
import { BitcoinAddressLike } from '../common/CommonTypes.js';

initEccLib(ecc);

const ECPair = ECPairFactory(ecc);

/**
 * @description This class is used to create a Bitcoin address.
 * @cathegory Bitcoin
 */
export class BitcoinAddress {
    readonly #keyPair: ECPairInterface;
    readonly #taprootAddress: string;
    readonly #p2wpkhAddress: string;

    private readonly network: Network;

    constructor(keypair: ECPairInterface, network: Network = networks.bitcoin) {
        this.#keyPair = keypair;
        this.network = network;

        this.#taprootAddress = this.getTaprootAddress();
        this.#p2wpkhAddress = this.getP2WPKHAddress();
    }

    public get taprootAddress(): string {
        if (!this.#taprootAddress) {
            throw new Error('Address not set');
        }

        return this.#taprootAddress;
    }

    public get p2wpkhAddress(): string {
        if (!this.#p2wpkhAddress) {
            throw new Error('Address not set');
        }

        return this.#p2wpkhAddress;
    }

    public get publicKey(): Buffer {
        if (!this.#keyPair) {
            throw new Error('KeyPair not set');
        }

        return this.#keyPair.publicKey;
    }

    public get privateKey(): Buffer | undefined {
        if (!this.#keyPair) {
            throw new Error('KeyPair not set');
        }

        return this.#keyPair.privateKey;
    }

    public static isValidTaprootAddress(
        _addr: BitcoinAddressLike,
        network: Network = networks.bitcoin,
    ): boolean {
        try {
            let addr: string;
            if (typeof _addr === 'string') {
                addr = _addr;
            } else {
                addr = _addr.taprootAddress;
            }

            return !!address.toOutputScript(addr, network);
        } catch (err) {
            return false;
        }
    }

    public static fromPublicKey(
        publicKey: Buffer,
        network: Network = networks.bitcoin,
    ): BitcoinAddress {
        const keyPair = ECPair.fromPublicKey(publicKey, { network });

        return new BitcoinAddress(keyPair, network);
    }

    public static fromPrivateKey(
        privateKey: Buffer,
        network: Network = networks.bitcoin,
    ): BitcoinAddress {
        const keyPair = ECPair.fromPrivateKey(privateKey, { network });

        return new BitcoinAddress(keyPair, network);
    }

    public static fromWif(wif: string, network: Network = networks.bitcoin): BitcoinAddress {
        const keyPair = ECPair.fromWIF(wif, network);

        return new BitcoinAddress(keyPair, network);
    }

    public [Symbol.toStringTag](): string {
        return this.taprootAddress;
    }

    private getP2WPKHAddress(): string {
        const res = payments.p2wpkh({ pubkey: this.#keyPair.publicKey, network: this.network });

        if (!res.address) {
            throw new Error('Failed to generate wallet');
        }

        return res.address;
    }

    private getTaprootAddress(): string {
        if (!this.#keyPair) {
            throw new Error('KeyPair not set');
        }

        const myXOnlyPubkey = this.#keyPair.publicKey.slice(1, 33);
        const output = Buffer.concat([
            // witness v1, PUSH_DATA 32 bytes
            Buffer.from([0x51, 0x20]),
            // x-only pubkey (remove 1 byte y parity)
            myXOnlyPubkey,
        ]);

        return address.fromOutputScript(output, this.network);
    }
}
