import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

/**
 * @category Events
 */
export const NativeSwapEvents: BitcoinInterfaceAbi = [
    {
        name: 'LiquidityAdded',
        values: [
            {
                name: 'totalTokensContributed',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'virtualTokenExchanged',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'totalSatoshisSpent',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LiquidityListed',
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
        name: 'LiquidityRemoved',
        values: [
            {
                name: 'providerId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'btcOwed',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'tokenAmount',
                type: ABIDataTypes.UINT256,
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
        name: 'Unlist',
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
export const NativeSwapAbi: BitcoinInterfaceAbi = [
    //=================================================
    // RESERVE
    //=================================================
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
            {
                name: 'forLP',
                type: ABIDataTypes.BOOL,
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

    //=================================================
    // LIST LIQUIDITY
    //=================================================
    {
        name: 'listLiquidity',
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

    //=================================================
    // CANCEL LISTING
    //=================================================
    {
        name: 'cancelListing',
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

    //=================================================
    // CREATE POOL
    //=================================================
    {
        name: 'createPool',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'floorPrice',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'initialLiquidity',
                type: ABIDataTypes.UINT128,
            },
            {
                name: 'receiver',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'antiBotEnabledFor',
                type: ABIDataTypes.UINT16,
            },
            {
                name: 'antiBotMaximumTokensPerReservation',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'maxReservesIn5BlocksPercent',
                type: ABIDataTypes.UINT16,
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

    //=================================================
    // SET FEES
    //=================================================
    {
        name: 'setFees',
        inputs: [
            {
                name: 'reservationBaseFee',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'priorityQueueBaseFee',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'pricePerUserInPriorityQueueBTC',
                type: ABIDataTypes.UINT64,
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

    //=================================================
    // GET FEES
    //=================================================
    {
        name: 'getFees',
        inputs: [],
        outputs: [
            {
                name: 'reservationBaseFee',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'priorityQueueBaseFee',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'pricePerUserInPriorityQueueBTC',
                type: ABIDataTypes.UINT64,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // ADD LIQUIDITY
    //=================================================
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

    //=================================================
    // REMOVE LIQUIDITY (changed return type)
    //=================================================
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
                name: 'ok',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // SWAP
    //=================================================
    {
        name: 'swap',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
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

    //=================================================
    // GET RESERVE
    //=================================================
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
            {
                name: 'virtualBTCReserve',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'virtualTokenReserve',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET QUOTE
    //=================================================
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
                name: 'price',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET PROVIDER DETAILS
    //=================================================
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

    {
        name: 'getVirtualReserves',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'virtualBTCReserve',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'virtualTokenReserve',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET PRIORITY QUEUE COST
    //=================================================
    {
        name: 'getPriorityQueueCost',
        inputs: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'cost',
                type: ABIDataTypes.UINT64,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    ...NativeSwapEvents,

    // OP_NET
    ...OP_NET_ABI,
];
