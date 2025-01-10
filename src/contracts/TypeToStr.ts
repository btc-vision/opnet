import { ABIDataTypes } from '@btc-vision/transaction';

export const AbiTypeToStr: { [key in ABIDataTypes]: string } = {
    [ABIDataTypes.ADDRESS]: 'address',
    [ABIDataTypes.BOOL]: 'bool',
    [ABIDataTypes.BYTES]: 'bytes',
    [ABIDataTypes.UINT256]: 'uint256',
    [ABIDataTypes.UINT128]: 'uint128',
    [ABIDataTypes.UINT64]: 'uint64',
    [ABIDataTypes.UINT32]: 'uint32',
    [ABIDataTypes.UINT16]: 'uint16',
    [ABIDataTypes.UINT8]: 'uint8',
    [ABIDataTypes.STRING]: 'string',
    [ABIDataTypes.BYTES32]: 'bytes32',
    [ABIDataTypes.ADDRESS_UINT256_TUPLE]: 'tuple(address,uint256)',
    [ABIDataTypes.ARRAY_OF_ADDRESSES]: 'address[]',
    [ABIDataTypes.ARRAY_OF_UINT256]: 'uint256[]',
    [ABIDataTypes.ARRAY_OF_UINT128]: 'uint128[]',
    [ABIDataTypes.ARRAY_OF_UINT64]: 'uint64[]',
    [ABIDataTypes.ARRAY_OF_UINT32]: 'uint32[]',
    [ABIDataTypes.ARRAY_OF_UINT16]: 'uint16[]',
    [ABIDataTypes.ARRAY_OF_UINT8]: 'uint8[]',
    [ABIDataTypes.ARRAY_OF_BYTES]: 'bytes[]',
    [ABIDataTypes.ARRAY_OF_STRING]: 'string[]',
    [ABIDataTypes.TUPLE]: 'tuple256',
};
