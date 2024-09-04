import { Address } from '@btc-vision/bsi-binary';
import { BitcoinAddress } from '../bitcoin/BitcoinAddress.js';
export type BitcoinAddressLike = string | BitcoinAddress;
export type PointerLike = bigint | string;
export type DecodedCallResult = bigint | string | boolean | number | Uint8Array | Array<bigint> | Array<string> | Array<boolean> | Array<number> | Array<Uint8Array> | Map<Address, bigint>;
export type Numeric = number | bigint;
export type BigNumberish = Numeric | string;
export type BlockTag = BigNumberish | 'latest' | 'pending' | 'earliest';
