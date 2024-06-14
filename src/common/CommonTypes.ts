import { BitcoinAddress } from '../bitcoin/BitcoinAddress.js';

export type BitcoinAddressLike = string | BitcoinAddress;
export type PointerLike = bigint | string;

export type DecodedCallResult =
    | bigint
    | string
    | boolean
    | number
    | Uint8Array
    | Array<bigint>
    | Array<string>
    | Array<boolean>
    | Array<number>
    | Array<Uint8Array>;

export type Numeric = number | bigint;

export type BigNumberish = Numeric | string;
export type BlockTag = BigNumberish | 'latest' | 'pending' | 'earliest';
