import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

/**
 * @category Events
 */
export const EwmaEvents: BitcoinInterfaceAbi = [
    {
        name: 'LiquidityAdded',
        values: [
            {
                name: 'totalLiquidity',
                type: ABIDataTypes.UINT128,
            },
            {
                name: 'provider',
                type: ABIDataTypes.STRING,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ReservationCreated',
        values: [
            {
                name: 'expectedAmountOut',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'totalSatoshis',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LiquidityRemoved',
        values: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'remainingLiquidity',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'SwapExecuted',
        values: [
            {
                name: 'buyer',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amountIn',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'amountOut',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LiquidityReserved',
        values: [
            {
                name: 'depositAddress',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT128,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

/**
 * @category ABI
 */
export const EwmaAbi: BitcoinInterfaceAbi = [
    {
        name: 'reserve',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'maximumAmountIn',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'minimumAmountOut',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'reserved',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'addLiquidity',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'receiver',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'amountIn',
                type: ABIDataTypes.UINT128,
            },
            {
                name: 'priority',
                type: ABIDataTypes.BOOL,
            },
        ],
        outputs: [
            {
                name: 'ok',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'removeLiquidity',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'totalTokensReturned',
                type: ABIDataTypes.UINT128,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'swap',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'isSimulation',
                type: ABIDataTypes.BOOL,
            },
        ],
        outputs: [
            {
                name: 'ok',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'getReserve',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'liquidity',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reservedLiquidity',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'getQuote',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'satoshisIn',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'tokensOut',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'requiredSatoshis',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'currentPrice',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'setQuote',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'p0',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'ok',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'priorityQueueCost',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'cost',
                type: ABIDataTypes.UINT128,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'getProviderDetails',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'liquidity',
                type: ABIDataTypes.UINT128,
            },
            {
                name: 'reserved',
                type: ABIDataTypes.UINT128,
            },
            {
                name: 'btcReceiver',
                type: ABIDataTypes.STRING,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    ...EwmaEvents,

    // OP_NET
    ...OP_NET_ABI,
];
