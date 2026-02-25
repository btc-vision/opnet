import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

const NativeSwapEvents: BitcoinInterfaceAbi = [
    {
        name: 'LiquidityAdded',
        values: [
            { name: 'totalTokensContributed', type: ABIDataTypes.UINT256 },
            { name: 'virtualTokenExchanged', type: ABIDataTypes.UINT256 },
            { name: 'totalSatoshisSpent', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LiquidityListed',
        values: [
            { name: 'totalLiquidity', type: ABIDataTypes.UINT128 },
            { name: 'provider', type: ABIDataTypes.STRING },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LiquidityRemoved',
        values: [
            { name: 'providerId', type: ABIDataTypes.UINT256 },
            { name: 'satoshisOwed', type: ABIDataTypes.UINT64 },
            { name: 'tokenAmount', type: ABIDataTypes.UINT128 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LiquidityReserved',
        values: [
            { name: 'depositAddress', type: ABIDataTypes.STRING },
            { name: 'satoshisAmount', type: ABIDataTypes.UINT64 },
            { name: 'providerId', type: ABIDataTypes.UINT256 },
            { name: 'tokenAmount', type: ABIDataTypes.UINT128 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ListingCanceled',
        values: [
            { name: 'amount', type: ABIDataTypes.UINT128 },
            { name: 'penalty', type: ABIDataTypes.UINT128 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ProviderActivated',
        values: [
            { name: 'providerId', type: ABIDataTypes.UINT256 },
            { name: 'listingAmount', type: ABIDataTypes.UINT128 },
            { name: 'btcToRemove', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ProviderConsumed',
        values: [
            { name: 'providerId', type: ABIDataTypes.UINT256 },
            { name: 'amountUsed', type: ABIDataTypes.UINT128 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ProviderFulfilled',
        values: [
            { name: 'providerId', type: ABIDataTypes.UINT256 },
            { name: 'removalCompleted', type: ABIDataTypes.BOOL },
            { name: 'stakedAmount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ReservationFallback',
        values: [
            { name: 'reservationId', type: ABIDataTypes.UINT128 },
            { name: 'expirationBlock', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ReservationCreated',
        values: [
            { name: 'expectedAmountOut', type: ABIDataTypes.UINT256 },
            { name: 'totalSatoshis', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ReservationPurged',
        values: [
            { name: 'reservationId', type: ABIDataTypes.UINT128 },
            { name: 'currentBlock', type: ABIDataTypes.UINT64 },
            { name: 'purgingBlock', type: ABIDataTypes.UINT64 },
            { name: 'purgeIndex', type: ABIDataTypes.UINT32 },
            { name: 'providerCount', type: ABIDataTypes.UINT32 },
            { name: 'purgedAmount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'SwapExecuted',
        values: [
            { name: 'buyer', type: ABIDataTypes.ADDRESS },
            { name: 'amountIn', type: ABIDataTypes.UINT64 },
            { name: 'amountOut', type: ABIDataTypes.UINT256 },
            { name: 'totalFees', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'WithdrawListing',
        values: [
            { name: 'amount', type: ABIDataTypes.UINT128 },
            { name: 'tokenAddress', type: ABIDataTypes.ADDRESS },
            { name: 'providerId', type: ABIDataTypes.UINT256 },
            { name: 'sender', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

export const NativeSwapAbi: BitcoinInterfaceAbi = [
    //=================================================
    // RESERVE
    //=================================================
    {
        name: 'reserve',
        inputs: [
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'maximumAmountIn', type: ABIDataTypes.UINT64 },
            { name: 'minimumAmountOut', type: ABIDataTypes.UINT256 },
            { name: 'activationDelay', type: ABIDataTypes.UINT8 },
            { name: 'sender', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // SWAP
    //=================================================
    {
        name: 'swap',
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // UPDATE
    //=================================================
    {
        name: 'update',
        inputs: [
            { name: 'address', type: ABIDataTypes.ADDRESS },
            { name: 'calldata', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // LIST LIQUIDITY
    //=================================================
    {
        name: 'listLiquidity',
        inputs: [
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'receiver', type: ABIDataTypes.BYTES },
            { name: 'receiverStr', type: ABIDataTypes.STRING },
            { name: 'amountIn', type: ABIDataTypes.UINT128 },
            { name: 'priority', type: ABIDataTypes.BOOL },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // CANCEL LISTING
    //=================================================
    {
        name: 'cancelListing',
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // WITHDRAW LISTING
    //=================================================
    {
        name: 'withdrawListing',
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // CREATE POOL
    //=================================================
    {
        name: 'createPool',
        inputs: [
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'floorPrice', type: ABIDataTypes.UINT256 },
            { name: 'initialLiquidity', type: ABIDataTypes.UINT128 },
            { name: 'receiver', type: ABIDataTypes.BYTES },
            { name: 'receiverStr', type: ABIDataTypes.STRING },
            { name: 'antiBotEnabledFor', type: ABIDataTypes.UINT16 },
            { name: 'antiBotMaximumTokensPerReservation', type: ABIDataTypes.UINT256 },
            { name: 'maxReservesIn5BlocksPercent', type: ABIDataTypes.UINT16 },
            { name: 'poolType', type: ABIDataTypes.UINT8 },
            { name: 'amplification', type: ABIDataTypes.UINT64 },
            { name: 'pegStalenessThreshold', type: ABIDataTypes.UINT64 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // SET FEES
    //=================================================
    {
        name: 'setFees',
        inputs: [
            { name: 'reservationBaseFee', type: ABIDataTypes.UINT64 },
            { name: 'priorityQueueBaseFee', type: ABIDataTypes.UINT64 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // SET STAKING CONTRACT ADDRESS
    //=================================================
    {
        name: 'setStakingContractAddress',
        inputs: [{ name: 'address', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // SET FEES ADDRESS
    //=================================================
    {
        name: 'setFeesAddress',
        inputs: [{ name: 'address', type: ABIDataTypes.STRING }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // PAUSE
    //=================================================
    {
        name: 'pause',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // UNPAUSE
    //=================================================
    {
        name: 'unpause',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // ACTIVATE WITHDRAW MODE
    //=================================================
    {
        name: 'activateWithdrawMode',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // VIEW FUNCTIONS - READ ONLY
    //=================================================

    //=================================================
    // IS PAUSED
    //=================================================
    {
        name: 'isPaused',
        constant: true,
        inputs: [],
        outputs: [{ name: 'paused', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // IS WITHDRAW MODE ACTIVE
    //=================================================
    {
        name: 'isWithdrawModeActive',
        constant: true,
        inputs: [],
        outputs: [{ name: 'active', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET RESERVE
    //=================================================
    {
        name: 'getReserve',
        constant: true,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [
            { name: 'liquidity', type: ABIDataTypes.UINT256 },
            { name: 'reservedLiquidity', type: ABIDataTypes.UINT256 },
            { name: 'virtualBTCReserve', type: ABIDataTypes.UINT64 },
            { name: 'virtualTokenReserve', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET QUOTE
    //=================================================
    {
        name: 'getQuote',
        constant: true,
        inputs: [
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'satoshisIn', type: ABIDataTypes.UINT64 },
        ],
        outputs: [
            { name: 'tokensOut', type: ABIDataTypes.UINT256 },
            { name: 'requiredSatoshis', type: ABIDataTypes.UINT64 },
            { name: 'price', type: ABIDataTypes.UINT256 },
            { name: 'scale', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET PROVIDER DETAILS
    //=================================================
    {
        name: 'getProviderDetails',
        constant: true,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [
            { name: 'id', type: ABIDataTypes.UINT256 },
            { name: 'liquidity', type: ABIDataTypes.UINT128 },
            { name: 'reserved', type: ABIDataTypes.UINT128 },
            { name: 'btcReceiver', type: ABIDataTypes.STRING },
            { name: 'indexedAt', type: ABIDataTypes.UINT32 },
            { name: 'isPriority', type: ABIDataTypes.BOOL },
            { name: 'purgeIndex', type: ABIDataTypes.UINT32 },
            { name: 'isActive', type: ABIDataTypes.BOOL },
            { name: 'lastListedTokensAtBlock', type: ABIDataTypes.UINT64 },
            { name: 'isPurged', type: ABIDataTypes.BOOL },
            { name: 'isLiquidityProvisionAllowed', type: ABIDataTypes.BOOL },
            { name: 'toReset', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET PROVIDER DETAILS BY ID
    //=================================================
    {
        name: 'getProviderDetailsById',
        constant: true,
        inputs: [{ name: 'providerId', type: ABIDataTypes.UINT256 }],
        outputs: [
            { name: 'id', type: ABIDataTypes.UINT256 },
            { name: 'liquidity', type: ABIDataTypes.UINT128 },
            { name: 'reserved', type: ABIDataTypes.UINT128 },
            { name: 'btcReceiver', type: ABIDataTypes.STRING },
            { name: 'indexedAt', type: ABIDataTypes.UINT32 },
            { name: 'isPriority', type: ABIDataTypes.BOOL },
            { name: 'purgeIndex', type: ABIDataTypes.UINT32 },
            { name: 'isActive', type: ABIDataTypes.BOOL },
            { name: 'lastListedTokensAtBlock', type: ABIDataTypes.UINT64 },
            { name: 'isPurged', type: ABIDataTypes.BOOL },
            { name: 'isLiquidityProvisionAllowed', type: ABIDataTypes.BOOL },
            { name: 'toReset', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET QUEUE DETAILS
    //=================================================
    {
        name: 'getQueueDetails',
        constant: true,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [
            { name: 'lastPurgedBlock', type: ABIDataTypes.UINT64 },
            { name: 'blockWithReservationsLength', type: ABIDataTypes.UINT32 },
            { name: 'priorityQueueLength', type: ABIDataTypes.UINT32 },
            { name: 'priorityQueueStartingIndex', type: ABIDataTypes.UINT32 },
            { name: 'standardQueueLength', type: ABIDataTypes.UINT32 },
            { name: 'standardQueueStartingIndex', type: ABIDataTypes.UINT32 },
            { name: 'priorityPurgeQueueLength', type: ABIDataTypes.UINT32 },
            { name: 'standardPurgeQueueLength', type: ABIDataTypes.UINT32 },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET PRIORITY QUEUE COST
    //=================================================
    {
        name: 'getPriorityQueueCost',
        constant: true,
        inputs: [],
        outputs: [{ name: 'cost', type: ABIDataTypes.UINT64 }],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET FEES
    //=================================================
    {
        name: 'getFees',
        constant: true,
        inputs: [],
        outputs: [
            { name: 'reservationBaseFee', type: ABIDataTypes.UINT64 },
            { name: 'priorityQueueBaseFee', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET ANTIBOT SETTINGS
    //=================================================
    {
        name: 'getAntibotSettings',
        constant: true,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [
            { name: 'antiBotExpirationBlock', type: ABIDataTypes.UINT64 },
            { name: 'maxTokensPerReservation', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET STAKING CONTRACT ADDRESS
    //=================================================
    {
        name: 'getStakingContractAddress',
        constant: true,
        inputs: [],
        outputs: [{ name: 'stakingAddress', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET FEES ADDRESS
    //=================================================
    {
        name: 'getFeesAddress',
        constant: true,
        inputs: [],
        outputs: [{ name: 'feesAddress', type: ABIDataTypes.STRING }],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // GET POOL INFO
    //=================================================
    {
        name: 'getPoolInfo',
        constant: true,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [
            { name: 'poolType', type: ABIDataTypes.UINT8 },
            { name: 'amplification', type: ABIDataTypes.UINT64 },
            { name: 'pegStalenessThreshold', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Function,
    },

    //=================================================
    // All Event Definitions
    //=================================================
    ...NativeSwapEvents,

    //=================================================
    // OP_NET Base ABI
    //=================================================
    ...OP_NET_ABI,
];
