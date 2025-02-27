import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP20Events } from '../opnet/OP_20_ABI.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';
import { MotoSwapFactoryEvents } from './MOTOSWAP_FACTORY_ABI.js';
import { MotoSwapPoolEvents } from './MOTOSWAP_POOL_ABI.js';

/**
 * @category ABI
 */
export const MOTOSWAP_ROUTER_ABI: BitcoinInterfaceAbi = [
    /** Liquidity functions */
    {
        name: 'addLiquidity',
        inputs: [
            {
                name: 'tokenA',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenB',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amountADesired',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountBDesired',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountAMin',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountBMin',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'deadline',
                type: ABIDataTypes.UINT64,
            },
        ],
        outputs: [
            {
                name: 'amountA',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountB',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'liquidity',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'removeLiquidity',
        inputs: [
            {
                name: 'tokenA',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenB',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'liquidity',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountAMin',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountBMin',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'deadline',
                type: ABIDataTypes.UINT64,
            },
        ],
        outputs: [
            {
                name: 'amountA',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountB',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    /** Common functions */
    {
        name: 'quote',
        inputs: [
            {
                name: 'amountA',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserveA',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserveB',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'quote',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getAmountOut',
        inputs: [
            {
                name: 'amountIn',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserveIn',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserveOut',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'amountOut',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getAmountIn',
        inputs: [
            {
                name: 'amountOut',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserveIn',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserveOut',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'amountIn',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getAmountsOut',
        inputs: [
            {
                name: 'amountIn',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'path',
                type: ABIDataTypes.ARRAY_OF_ADDRESSES,
            },
        ],
        outputs: [
            {
                name: 'amountsOut',
                type: ABIDataTypes.ARRAY_OF_UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getAmountsIn',
        inputs: [
            {
                name: 'amountOut',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'path',
                type: ABIDataTypes.ARRAY_OF_ADDRESSES,
            },
        ],
        outputs: [
            {
                name: 'amountsIn',
                type: ABIDataTypes.ARRAY_OF_UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    /** Swap Functions */
    {
        name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
        inputs: [
            {
                name: 'amountIn',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountOutMin',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'path',
                type: ABIDataTypes.ARRAY_OF_ADDRESSES,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'deadline',
                type: ABIDataTypes.UINT64,
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

    /** Views */
    {
        name: 'factory',
        inputs: [],
        outputs: [
            {
                name: 'factory',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    /** Events */
    ...MotoSwapFactoryEvents,
    ...OP20Events,
    ...MotoSwapPoolEvents,

    // OP_NET
    ...OP_NET_ABI,
];
