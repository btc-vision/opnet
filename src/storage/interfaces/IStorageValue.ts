import { BigNumberish } from 'ethers';
import { PointerLike } from '../../common/CommonTypes.js';

/**
 * @description This interface is used to represent a stored value.
 * @interface IStorageValue
 * @category Storage
 */
export interface IStorageValue {
    readonly pointer: PointerLike;
    readonly value: string | Buffer;

    readonly height: BigNumberish;
    readonly proofs?: string[];
}
