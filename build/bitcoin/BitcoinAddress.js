var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BitcoinAddress_keyPair, _BitcoinAddress_taprootAddress, _BitcoinAddress_p2wpkhAddress;
import * as ecc from '@bitcoinerlab/secp256k1';
import { address, initEccLib, networks, payments } from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
initEccLib(ecc);
const ECPair = ECPairFactory(ecc);
export class BitcoinAddress {
    constructor(keypair, network = networks.bitcoin) {
        _BitcoinAddress_keyPair.set(this, void 0);
        _BitcoinAddress_taprootAddress.set(this, void 0);
        _BitcoinAddress_p2wpkhAddress.set(this, void 0);
        __classPrivateFieldSet(this, _BitcoinAddress_keyPair, keypair, "f");
        this.network = network;
        __classPrivateFieldSet(this, _BitcoinAddress_taprootAddress, this.getTaprootAddress(), "f");
        __classPrivateFieldSet(this, _BitcoinAddress_p2wpkhAddress, this.getP2WPKHAddress(), "f");
    }
    get taprootAddress() {
        if (!__classPrivateFieldGet(this, _BitcoinAddress_taprootAddress, "f")) {
            throw new Error('Address not set');
        }
        return __classPrivateFieldGet(this, _BitcoinAddress_taprootAddress, "f");
    }
    get p2wpkhAddress() {
        if (!__classPrivateFieldGet(this, _BitcoinAddress_p2wpkhAddress, "f")) {
            throw new Error('Address not set');
        }
        return __classPrivateFieldGet(this, _BitcoinAddress_p2wpkhAddress, "f");
    }
    get publicKey() {
        if (!__classPrivateFieldGet(this, _BitcoinAddress_keyPair, "f")) {
            throw new Error('KeyPair not set');
        }
        return __classPrivateFieldGet(this, _BitcoinAddress_keyPair, "f").publicKey;
    }
    get privateKey() {
        if (!__classPrivateFieldGet(this, _BitcoinAddress_keyPair, "f")) {
            throw new Error('KeyPair not set');
        }
        return __classPrivateFieldGet(this, _BitcoinAddress_keyPair, "f").privateKey;
    }
    static isValidTaprootAddress(_addr, network = networks.bitcoin) {
        try {
            let addr;
            if (typeof _addr === 'string') {
                addr = _addr;
            }
            else {
                addr = _addr.taprootAddress;
            }
            return !!address.toOutputScript(addr, network);
        }
        catch (err) {
            return false;
        }
    }
    static fromPublicKey(publicKey, network = networks.bitcoin) {
        const keyPair = ECPair.fromPublicKey(publicKey, { network });
        return new BitcoinAddress(keyPair, network);
    }
    static fromPrivateKey(privateKey, network = networks.bitcoin) {
        const keyPair = ECPair.fromPrivateKey(privateKey, { network });
        return new BitcoinAddress(keyPair, network);
    }
    static fromWif(wif, network = networks.bitcoin) {
        const keyPair = ECPair.fromWIF(wif, network);
        return new BitcoinAddress(keyPair, network);
    }
    [(_BitcoinAddress_keyPair = new WeakMap(), _BitcoinAddress_taprootAddress = new WeakMap(), _BitcoinAddress_p2wpkhAddress = new WeakMap(), Symbol.toStringTag)]() {
        return this.taprootAddress;
    }
    getP2WPKHAddress() {
        const res = payments.p2wpkh({ pubkey: __classPrivateFieldGet(this, _BitcoinAddress_keyPair, "f").publicKey, network: this.network });
        if (!res.address) {
            throw new Error('Failed to generate wallet');
        }
        return res.address;
    }
    getTaprootAddress() {
        if (!__classPrivateFieldGet(this, _BitcoinAddress_keyPair, "f")) {
            throw new Error('KeyPair not set');
        }
        const myXOnlyPubkey = __classPrivateFieldGet(this, _BitcoinAddress_keyPair, "f").publicKey.slice(1, 33);
        const output = Buffer.concat([
            Buffer.from([0x51, 0x20]),
            myXOnlyPubkey,
        ]);
        return address.fromOutputScript(output, this.network);
    }
}
