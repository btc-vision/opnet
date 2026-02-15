import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20_ABI } from '../opnet/OP_20_ABI.js';

export const MotoSwapPoolEvents: BitcoinInterfaceAbi = [
    {
        name: 'LiquidityRemoved',
        values: [
            {
                name: 'sender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount0',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amount1',
                type: ABIDataTypes.UINT256,
            },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LiquidityAdded',
        values: [
            {
                name: 'sender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount0',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amount1',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Swapped',
        values: [
            {
                name: 'sender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount0In',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amount1In',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amount0Out',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amount1Out',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Synced',
        values: [
            {
                name: 'reserve0',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserve1',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

export const MotoswapPoolAbi: BitcoinInterfaceAbi = [
    {
        name: 'initialize',
        inputs: [
            {
                name: 'token0',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'token1',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'swap',
        inputs: [
            {
                name: 'amount0Out',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amount1Out',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'data',
                type: ABIDataTypes.BYTES,
            },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'skim',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'getReserves',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'reserve0',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserve1',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'blockTimestampLast',
                type: ABIDataTypes.UINT64,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'token0',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'token0',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'token1',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'token1',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'price0CumulativeLast',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'price0CumulativeLast',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'price1CumulativeLast',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'price1CumulativeLast',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'kLast',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'kLast',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'blockTimestampLast',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'blockTimestampLast',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'sync',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'MINIMUM_LIQUIDITY',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'MINIMUM_LIQUIDITY',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // Overwrites
    {
        name: 'mint',
        inputs: [],
        outputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
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
        ],
        outputs: [
            {
                name: 'amount0',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amount1',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // OP_20
    ...OP_20_ABI,

    // EVENTS
    ...MotoSwapPoolEvents,
];
