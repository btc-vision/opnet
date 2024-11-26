import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI';
import { REENTRANCY_GUARD_ABI } from './REENTRANCY_GUARD_ABI';
import OWNABLE_ABI from './OWNABLE_ABI';

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
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'lpToken',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'rewarder',
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
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'rewarder',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'overwrite',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'LogUpdatePool',
        type: BitcoinAbiTypes.Event,
        values: [
            {
                name: 'pid',
                type: ABIDataTypes.UINT32,
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
                type: ABIDataTypes.UINT32,
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
                type: ABIDataTypes.UINT32,
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
                type: ABIDataTypes.UINT32,
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
                type: ABIDataTypes.UINT32,
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
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'getLpToken',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT32 }],
        outputs: [{ name: 'lpTokenAddress', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getRewarder',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT32 }],
        outputs: [{ name: 'rewarderAddress', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getPoolInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT32 }],
        outputs: [
            { name: 'allocPoint', type: ABIDataTypes.UINT64 },
            { name: 'lastRewardBlock', type: ABIDataTypes.UINT64 },
            { name: 'accMotoPerShare', type: ABIDataTypes.UINT256 },
        ],
    },
    {
        name: 'pools',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            { name: 'poolLength', type: ABIDataTypes.UINT32 },
            { name: 'poolsData', type: ABIDataTypes.BYTES },
        ],
    },
    {
        name: 'getUserInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT32 },
            { name: 'user', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [
            { name: 'amount', type: ABIDataTypes.UINT256 },
            // FIXME: NEEDS TO BE INT256
            { name: 'rewardDebt', type: ABIDataTypes.UINT256 },
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
        name: 'getBonusMultiplier',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'bonusMultiplier', type: ABIDataTypes.UINT256 }],
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
            { name: 'rewarder', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'set',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT32 },
            { name: 'allocPoint', type: ABIDataTypes.UINT256 },
            { name: 'rewarder', type: ABIDataTypes.ADDRESS },
            { name: 'overwrite', type: ABIDataTypes.BOOL },
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
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT32 }],
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
            { name: 'pid', type: ABIDataTypes.UINT32 },
            { name: 'user', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'pendingMoto', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'massUpdatePools',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [{ name: 'pid', type: ABIDataTypes.UINT32 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'updatePool',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'length', type: ABIDataTypes.UINT32 },
            { name: 'pids', type: ABIDataTypes.ARRAY_OF_UINT32 },
        ],
        outputs: [
            { name: 'allocPoint', type: ABIDataTypes.UINT64 },
            { name: 'lastRewardBlock', type: ABIDataTypes.UINT64 },
            { name: 'accMotoPerShare', type: ABIDataTypes.UINT256 },
        ],
    },
    {
        name: 'deposit',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            { name: 'pid', type: ABIDataTypes.UINT32 },
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
            { name: 'pid', type: ABIDataTypes.UINT32 },
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
            { name: 'pid', type: ABIDataTypes.UINT32 },
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
            { name: 'pid', type: ABIDataTypes.UINT32 },
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
            { name: 'pid', type: ABIDataTypes.UINT32 },
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
