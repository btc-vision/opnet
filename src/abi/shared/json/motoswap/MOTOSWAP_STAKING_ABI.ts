import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';
import OWNABLE_ABI from './OWNABLE_ABI.js';
import { REENTRANCY_GUARD_ABI } from './REENTRANCY_GUARD_ABI.js';

export const MotoswapStakingEvents: BitcoinInterfaceAbi = [
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
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'unstake',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'claimRewards',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'adminAddRewardToken',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'adminRemoveRewardToken',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'adminChangeMotoAddress',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'token', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
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
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'adminEnableEmergencyWithdrawals',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },

    // Events
    ...MotoswapStakingEvents,

    // OP_NET
    ...OP_NET_ABI,

    // Reentrancy contract
    ...REENTRANCY_GUARD_ABI,

    // Ownable contract
    ...OWNABLE_ABI,
];
