import { BigNumberish, PointerLike } from '../../common/CommonTypes.js';
export interface IStorageValue {
    readonly pointer: PointerLike;
    readonly value: string | Buffer;
    readonly height: BigNumberish;
    readonly proofs?: string[];
}
