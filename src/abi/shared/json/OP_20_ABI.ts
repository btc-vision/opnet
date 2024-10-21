import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from './OP_NET_ABI.js';

/**
 * @category Events
 */
export const OP20Events: BitcoinInterfaceAbi = [
    {
        name: 'Mint',
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
        name: 'Transfer',
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
        name: 'Burn',
        values: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Approve',
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
        name: 'approve',
        inputs: [
            {
                name: 'spender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        inputs: [
            {
                name: 'value',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transfer',
        inputs: [
            {
                name: 'recipient',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transferFrom',
        inputs: [
            {
                name: 'sender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'recipient',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'mint',
        inputs: [
            {
                name: 'recipient',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'airdrop',
        inputs: [
            {
                name: 'tuple',
                type: ABIDataTypes.ADDRESS_UINT256_TUPLE,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'airdropWithAmount',
        inputs: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'addresses',
                type: ABIDataTypes.ARRAY_OF_ADDRESSES,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
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

    // Events
    ...OP20Events,

    // OP_NET
    ...OP_NET_ABI,
];
