import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { OP_NET_ABI } from './OP_NET_ABI.js';
export const OP20Events = [
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
export const OP_20_ABI = [
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
        name: 'balanceOf',
        inputs: [
            {
                name: 'owner',
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
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
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
        name: 'mint',
        inputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
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
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
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
        name: 'transferFrom',
        inputs: [
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
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
        name: 'decimals',
        constant: true,
        inputs: [],
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
        inputs: [],
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
        inputs: [],
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
        inputs: [],
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
        inputs: [],
        outputs: [
            {
                name: 'maximumSupply',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    ...OP20Events,
    ...OP_NET_ABI,
];
