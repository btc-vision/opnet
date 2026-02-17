import { fromBase64, fromHex } from '@btc-vision/bitcoin';
import { BufferHelper } from '@btc-vision/transaction';
import { IStorageValue } from './interfaces/IStorageValue.js';

/**
 * @description This class is used represent a stored value.
 * @class StoredValue
 * @category Storage
 */
export class StoredValue implements IStorageValue {
    public readonly pointer: bigint;
    public readonly value: Uint8Array;

    public readonly height: bigint;
    public readonly proofs: string[];

    constructor(iStoredValue: IStorageValue) {
        this.pointer =
            typeof iStoredValue.pointer === 'string'
                ? this.base64ToBigInt(iStoredValue.pointer)
                : iStoredValue.pointer;

        if (typeof iStoredValue.value !== 'string') {
            this.value = iStoredValue.value;
        } else {
            this.value = iStoredValue.value.startsWith('0x')
                ? fromHex(iStoredValue.value.slice(2))
                : fromBase64(iStoredValue.value);
        }

        this.height = BigInt(iStoredValue.height);
        this.proofs = iStoredValue.proofs || [];
    }

    private base64ToBigInt(base64: string): bigint {
        return BufferHelper.uint8ArrayToPointer(fromBase64(base64));
    }
}
