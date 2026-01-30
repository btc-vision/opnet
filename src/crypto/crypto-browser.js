/* Browser Crypto Shims */
import { hmac } from '@noble/hashes/hmac.js';
import { sha1 } from '@noble/hashes/legacy.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256, sha512 } from '@noble/hashes/sha2.js';

function assertArgument(check, message, name, value) {
    if (!check) {
        throw new Error(`${message} (${name}: ${value})`);
    }
}

function getGlobal() {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('unable to locate global object');
}

const anyGlobal = getGlobal();
const crypto = anyGlobal.crypto || anyGlobal.msCrypto;

export function createHash(algo) {
    switch (algo) {
        case 'sha1':
            return sha1.create();
        case 'sha256':
            return sha256.create();
        case 'sha512':
            return sha512.create();
    }
    assertArgument(false, 'invalid hashing algorithm name', 'algorithm', algo);
}

export function createHmac(_algo, key) {
    const algo = { sha1, sha256, sha512 }[_algo];
    assertArgument(algo != null, 'invalid hmac algorithm', 'algorithm', _algo);
    return hmac.create(algo, key);
}

export function pbkdf2Sync(password, salt, iterations, keylen, _algo) {
    const algo = { sha1, sha256, sha512 }[_algo];
    assertArgument(algo != null, 'invalid pbkdf2 algorithm', 'algorithm', _algo);
    return pbkdf2(algo, password, salt, { c: iterations, dkLen: keylen });
}

export function randomBytes(length) {
    assertArgument(
        crypto != null,
        'platform does not support secure random numbers',
        'UNSUPPORTED_OPERATION',
        {
            operation: 'randomBytes',
        },
    );
    assertArgument(
        Number.isInteger(length) && length > 0 && length <= 1024,
        'invalid length',
        'length',
        length,
    );
    const result = new Uint8Array(length);
    crypto.getRandomValues(result);
    return result;
}

export default {
    createHash,
    createHmac,
    pbkdf2Sync,
    randomBytes,
};
