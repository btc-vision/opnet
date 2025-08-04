import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from './OP_NET_ABI.js';

/**
 * @category Events
 */
export const OP20Events: BitcoinInterfaceAbi = [
    {
        name: 'Minted',
        values: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Transferred',
        values: [
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Burned',
        values: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Approved',
        values: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'spender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'value',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

/**
 * @category ABI
 */
export const OP_20_ABI: BitcoinInterfaceAbi = [
    {
        name: 'allowance',
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'spender',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'remaining',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'increaseAllowance',
        inputs: [
            { name: 'spender', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'decreaseAllowance',
        inputs: [
            { name: 'spender', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'increaseAllowanceBySignature',
        inputs: [
            { name: 'owner', type: ABIDataTypes.ADDRESS },
            { name: 'spender', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'deadline', type: ABIDataTypes.UINT64 },
            { name: 'signature', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'decreaseAllowanceBySignature',
        inputs: [
            { name: 'owner', type: ABIDataTypes.ADDRESS },
            { name: 'spender', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'deadline', type: ABIDataTypes.UINT64 },
            { name: 'signature', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'balanceOf',
        inputs: [
            {
                name: 'account',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'balance',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'burn',
        inputs: [{ name: 'value', type: ABIDataTypes.UINT256 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'safeTransfer',
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'safeTransferFrom',
        inputs: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'mint',
        inputs: [
            { name: 'recipient', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'airdrop',
        inputs: [{ name: 'map', type: ABIDataTypes.ADDRESS_UINT256_TUPLE }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'airdropWithAmount',
        inputs: [
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'addresses', type: ABIDataTypes.ARRAY_OF_ADDRESSES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    // Properties
    {
        name: 'decimals',
        constant: true,
        outputs: [
            {
                name: 'decimals',
                type: ABIDataTypes.UINT8,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'name',
        constant: true,
        outputs: [
            {
                name: 'name',
                type: ABIDataTypes.STRING,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'symbol',
        constant: true,
        outputs: [
            {
                name: 'symbol',
                type: ABIDataTypes.STRING,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'totalSupply',
        outputs: [
            {
                name: 'totalSupply',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'maximumSupply',
        outputs: [
            {
                name: 'maximumSupply',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'domainSeparator',
        constant: true,
        outputs: [
            {
                name: 'domainSeparator',
                type: ABIDataTypes.BYTES32,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'nonceOf',
        constant: true,
        inputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
        outputs: [
            {
                name: 'nonce',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // Events
    ...OP20Events,

    // OP_NET
    ...OP_NET_ABI,
];
