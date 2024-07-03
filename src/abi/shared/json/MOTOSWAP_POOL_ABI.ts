import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20_ABI } from './OP_20_ABI.js';
import { OP_NET_ABI } from './OP_NET_ABI.js';

export const MotoswapPoolAbi: BitcoinInterfaceAbi = [
    // OP_NET
    ...OP_NET_ABI,

    // OP_20
    ...OP_20_ABI,

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
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'skim',
        inputs: [],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'getReserves',
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
        inputs: [],
        outputs: [
            {
                name: 'blockTimestampLast',
                type: ABIDataTypes.UINT64,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'sync',
        inputs: [],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
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
                name: 'liquidity',
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
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // EVENTS
    {
        name: 'PoolBurn',
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
        name: 'PoolMint',
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
        name: 'Swap',
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
        name: 'Sync',
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
