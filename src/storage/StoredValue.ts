import { BufferHelper } from '@btc-vision/transaction';
import { IStorageValue } from './interfaces/IStorageValue.js';

/**
 * @description This class is used represent a stored value.
 * @class StoredValue
 * @category Storage
 */
export class StoredValue implements IStorageValue {
    public readonly pointer: bigint;
    public readonly value: Buffer;

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
            this.value = Buffer.from(
                iStoredValue.value,
                iStoredValue.value.startsWith('0x') ? 'hex' : 'base64',
            );
        }

        this.height = BigInt(iStoredValue.height);
        this.proofs = iStoredValue.proofs || [];
    }

    private base64ToBigInt(base64: string): bigint {
        return BufferHelper.uint8ArrayToPointer(Buffer.from(base64, 'base64'));
    }
}
