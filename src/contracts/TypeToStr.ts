import { ABIDataTypes } from '@btc-vision/transaction';

export const AbiTypeToStr: { [key in ABIDataTypes]: string } = {
    // Basic address types
    [ABIDataTypes.ADDRESS]: 'address',
    [ABIDataTypes.EXTENDED_ADDRESS]: 'extendedAddress',

    // Boolean
    [ABIDataTypes.BOOL]: 'bool',

    // Bytes types
    [ABIDataTypes.BYTES]: 'bytes',
    [ABIDataTypes.BYTES32]: 'bytes32',
    [ABIDataTypes.BYTES4]: 'bytes4',

    // Unsigned integers
    [ABIDataTypes.UINT256]: 'uint256',
    [ABIDataTypes.UINT128]: 'uint128',
    [ABIDataTypes.UINT64]: 'uint64',
    [ABIDataTypes.UINT32]: 'uint32',
    [ABIDataTypes.UINT16]: 'uint16',
    [ABIDataTypes.UINT8]: 'uint8',

    // Signed integers
    [ABIDataTypes.INT128]: 'int128',
    [ABIDataTypes.INT64]: 'int64',
    [ABIDataTypes.INT32]: 'int32',
    [ABIDataTypes.INT16]: 'int16',
    [ABIDataTypes.INT8]: 'int8',

    // String
    [ABIDataTypes.STRING]: 'string',

    // Tuples/Maps
    [ABIDataTypes.ADDRESS_UINT256_TUPLE]: 'tuple(address,uint256)[]',
    [ABIDataTypes.EXTENDED_ADDRESS_UINT256_TUPLE]: 'tuple(extendedAddress,uint256)[]',

    // Signatures
    [ABIDataTypes.SCHNORR_SIGNATURE]: 'schnorrSignature',

    // Arrays
    [ABIDataTypes.ARRAY_OF_ADDRESSES]: 'address[]',
    [ABIDataTypes.ARRAY_OF_EXTENDED_ADDRESSES]: 'extendedAddress[]',
    [ABIDataTypes.ARRAY_OF_UINT256]: 'uint256[]',
    [ABIDataTypes.ARRAY_OF_UINT128]: 'uint128[]',
    [ABIDataTypes.ARRAY_OF_UINT64]: 'uint64[]',
    [ABIDataTypes.ARRAY_OF_UINT32]: 'uint32[]',
    [ABIDataTypes.ARRAY_OF_UINT16]: 'uint16[]',
    [ABIDataTypes.ARRAY_OF_UINT8]: 'uint8[]',
    [ABIDataTypes.ARRAY_OF_BYTES]: 'bytes[]',
    [ABIDataTypes.ARRAY_OF_STRING]: 'string[]',
    [ABIDataTypes.ARRAY_OF_BUFFERS]: 'buffer[]',
};
