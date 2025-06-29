import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

const MOTOSWAP_OWNABLE_REENTRANCY_GUARD_ABI: BitcoinInterfaceAbi = [
    // Ownable
    {
        name: 'admin',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'adminAddress',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'changeAdmin',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            {
                name: 'newAdmin',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
    },

    // Reentrancy guard
    {
        name: 'status',
        inputs: [],
        outputs: [
            {
                name: 'status',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
];

const MotoswapStakingEvents: BitcoinInterfaceAbi = [
    {
        name: 'RewardTokenAdded',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'RewardTokenRemoved',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'token',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
];

export const MOTOSWAP_STAKING_ABI: BitcoinInterfaceAbi = [
    {
        name: 'balanceOf',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'address', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'balance', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'motoAddress',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'motoAddress', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'totalSupply',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'totalSupply', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'lastInteractedBlock',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'address', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'lastInteractedBlock', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'rewardDebt',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            { name: 'user', type: ABIDataTypes.ADDRESS },
            { name: 'rewardToken', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'rewardDebt', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'rewardBalance',
        type: BitcoinAbiTypes.Function,
        constant: false,
        inputs: [
            { name: 'user', type: ABIDataTypes.ADDRESS },
            { name: 'rewardToken', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'rewardBalance', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'pendingReward',
        type: BitcoinAbiTypes.Function,
        constant: true,
        payable: false,
        inputs: [
            { name: 'user', type: ABIDataTypes.ADDRESS },
            { name: 'rewardToken', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'pendingReward', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'calculateSlashingFee',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            { name: 'user', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'rewardDebt', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'enabledRewardTokens',
        type: BitcoinAbiTypes.Function,
        constant: false,
        inputs: [],
        outputs: [{ name: 'enabledRewardTokens', type: ABIDataTypes.ARRAY_OF_ADDRESSES }],
    },
    {
        name: 'stake',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
        outputs: [],
    },
    {
        name: 'unstake',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [],
        outputs: [],
    },
    {
        name: 'claimRewards',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [],
        outputs: [],
    },
    {
        name: 'adminAddRewardToken',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [],
    },
    {
        name: 'adminRemoveRewardToken',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [],
    },
    {
        name: 'adminChangeMotoAddress',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [],
    },
    {
        name: 'adminChangeLockupParameters',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'newLockupDuration', type: ABIDataTypes.UINT256 },
            { name: 'newMaxSlashingFeePercent', type: ABIDataTypes.UINT256 },
            { name: 'newBlocksPerOnePercentSlashingFeeReduction', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
    },
    {
        name: 'adminEnableEmergencyWithdrawals',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [],
        outputs: [],
    },

    // Ownable Reentrancy Guard
    ...MOTOSWAP_OWNABLE_REENTRANCY_GUARD_ABI,

    // Events
    ...MotoswapStakingEvents,

    // OP_NET
    ...OP_NET_ABI,
];
