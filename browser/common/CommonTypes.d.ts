import { BitcoinAddress } from '../bitcoin/BitcoinAddress.js';
export type BitcoinAddressLike = string | BitcoinAddress;
export type PointerLike = bigint | string;
export type DecodedCallResult = bigint | string | boolean | number | Uint8Array | Array<bigint> | Array<string> | Array<boolean> | Array<number> | Array<Uint8Array>;
