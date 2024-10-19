import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../interfaces/BitcoinInterfaceAbi.js';

/**
 * @category Events
 */
export const StackingEvents: BitcoinInterfaceAbi = [
    {
        name: 'Stake',
        values: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Unstake',
        values: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Claim',
        values: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

/**
 * @category ABI
 */
export const STAKING_ABI: BitcoinInterfaceAbi = [
    {
        name: 'stake',
        inputs: [
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
        name: 'unstake',
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
        name: 'stakedAmount',
        inputs: [
            {
                name: 'address',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'stakedReward',
        inputs: [
            {
                name: 'address',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'claim',
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
        name: 'rewardPool',
        inputs: [],
        outputs: [
            {
                name: 'reward',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'totalStaked',
        inputs: [],
        outputs: [
            {
                name: 'total',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // EVENTS
    ...StackingEvents,
];
