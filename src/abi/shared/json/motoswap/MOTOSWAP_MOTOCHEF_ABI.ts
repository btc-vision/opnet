import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';
import OWNABLE_ABI from './OWNABLE_ABI.js';
import { REENTRANCY_GUARD_ABI } from './REENTRANCY_GUARD_ABI.js';

export const MotoChefEvents: BitcoinInterfaceAbi = [
    {
        name: 'LogInit',
        type: BitcoinAbiTypes.Event,
        values: [],
    },
    {
        name: 'LogPoolAddition',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'pid',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'lpToken',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'LogSetPool',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'pid',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'LogUpdatePool',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'pid',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'lastRewardBlock',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'lpSupply',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'accMotoPerShare',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'Deposit',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'pid',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'Withdraw',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'pid',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'Harvest',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'pid',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'EmergencyWithdraw',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'pid',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'StakeBTC',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'stakingTxId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'stakingIndex',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'UnstakeBTC',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'stakingTxId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'stakingIndex',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
];

const MOTOCHEF_ABI: BitcoinInterfaceAbi = [
    {
        name: 'initialize',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'MOTO', type: ABIDataTypes.ADDRESS },
            { name: 'premineAmount', type: ABIDataTypes.UINT256 },
            { name: 'devaddr', type: ABIDataTypes.ADDRESS },
            { name: 'motoPerBlock', type: ABIDataTypes.UINT256 },
            { name: 'bonusEndBlock', type: ABIDataTypes.UINT256 },
            { name: 'bonusMultiplier', type: ABIDataTypes.UINT256 },
            { name: 'treasuryAddress', type: ABIDataTypes.STRING },
            { name: 'btcAllocPoint', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'getLpToken',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT64 }],
        outputs: [{ name: 'lpTokenAddress', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getLpTokens',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'lpTokens', type: ABIDataTypes.ARRAY_OF_ADDRESSES }],
    },
    {
        name: 'getPoolInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT64 }],
        outputs: [
            { name: 'accMotoPerShare', type: ABIDataTypes.UINT256 },
            { name: 'lastRewardBlock', type: ABIDataTypes.UINT64 },
            { name: 'allocPoint', type: ABIDataTypes.UINT64 },
        ],
    },
    {
        name: 'getPoolsLength',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'poolLength', type: ABIDataTypes.UINT64 }],
    },
    {
        name: 'getUserInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'user', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [
            { name: 'amount', type: ABIDataTypes.UINT256 },
            // FIXME: NEEDS TO BE INT128
            { name: 'rewardDebt', type: ABIDataTypes.UINT128 },
        ],
    },
    {
        name: 'totalAllocPoint',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'totalAllocPoint', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'devaddr',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'devaddr', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getMotoPerBlock',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'motoPerBlock', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'getBonusEndBlock',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'bonusEndBlock', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'totalBtcStaked',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'totalBtcStaked', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'treasuryAddress',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'treasuryAddress', type: ABIDataTypes.STRING }],
    },
    {
        name: 'getStakingTxId',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'stakingTxId', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'getStakingIndex',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'stakingIndex', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'setMotoPerBlock',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'motoPerBlock', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'setBonusEndBlock',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'bonusEndBlock', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'setBonusMultiplier',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'bonusMultiplier', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'add',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'allocPoint', type: ABIDataTypes.UINT256 },
            { name: 'lpToken', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'set',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'allocPoint', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'setMigrator',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'migrator', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'migrate',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT64 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'getMultiplier',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'from', type: ABIDataTypes.UINT256 },
            { name: 'to', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'multiplier', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'pendingMoto',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'user', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'pendingMoto', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'massUpdatePools',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'length', type: ABIDataTypes.UINT32 },
            { name: 'pids', type: ABIDataTypes.ARRAY_OF_UINT64 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'updatePool',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT64 }],
        outputs: [
            { name: 'accMotoPerShare', type: ABIDataTypes.UINT256 },
            { name: 'lastRewardBlock', type: ABIDataTypes.UINT64 },
            { name: 'allocPoint', type: ABIDataTypes.UINT64 },
        ],
    },
    {
        name: 'deposit',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'withdraw',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'harvest',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'withdrawAndHarvest',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'emergencyWithdraw',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT64 },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'setDev',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'devaddr', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'stakeBtc',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'stakeAmount', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'unstakeBtc',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },

    // Events
    ...MotoChefEvents,

    // OP_NET
    ...OP_NET_ABI,

    // Reentrancy contract
    ...REENTRANCY_GUARD_ABI,

    // Ownable contract
    ...OWNABLE_ABI,
];

export default MOTOCHEF_ABI;
