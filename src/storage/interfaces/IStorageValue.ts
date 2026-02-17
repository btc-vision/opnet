import { BigNumberish, PointerLike } from '../../common/CommonTypes.js';

/**
 * @description This interface is used to represent a stored value.
 * @interface IStorageValue
 * @category Storage
 */
export interface IStorageValue {
    readonly pointer: PointerLike;
    readonly value: string | Uint8Array;

    readonly height: BigNumberish;
    readonly proofs?: string[];
}
