import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';

export type PointerLike = bigint | string;

export type DecodedCallResult =
    | bigint
    | string
    | boolean
    | number
    | Address
    | Uint8Array
    | Array<bigint>
    | Array<string>
    | Array<boolean>
    | Array<number>
    | Array<Uint8Array>
    | Array<Address>
    | AddressMap<bigint>
    | ExtendedAddressMap<bigint>
    | SchnorrSignature
    | DecodedCallResult[]
    | { [key: string]: DecodedCallResult };

export type Numeric = number | bigint;

export type BigNumberish = Numeric | string;
export type BlockTag = BigNumberish | string;
