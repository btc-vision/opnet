import { IStorageValue } from './interfaces/IStorageValue.js';
export declare class StoredValue implements IStorageValue {
    readonly pointer: bigint;
    readonly value: Buffer;
    readonly height: bigint;
    readonly proofs: string[];
    constructor(iStoredValue: IStorageValue);
    private base64ToBigInt;
}
