import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

const OwnableEvents: BitcoinInterfaceAbi = [
    {
        name: 'OwnershipTransferred',
        values: [
            {
                name: 'previousOwner',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'newOwner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

const OWNABLE_ABI: BitcoinInterfaceAbi = [
    {
        name: 'owner',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'renounceOwnership',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [],
    },
    {
        name: 'transferOwnership',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'newOwner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
    },
];

const MotoChefEvents: BitcoinInterfaceAbi = [
    {
        name: 'PoolAdded',
        values: [
            {
                name: 'poolId',
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
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Initialized',
        values: [],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PoolUpdated',
        values: [
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'BTCStaked',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'netAmount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'stakeTxId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'stakeIndex',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'BTCUnstaked',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'pendingMoto',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'storedTxId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'storedIndex',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'BTCStakeRemoved',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'storedTxId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'storedIndex',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PoolSet',
        values: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Deposited',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Withdrawn',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Harvested',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'EmergencyWithdrawn',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
];

export const MOTOCHEF_ABI: BitcoinInterfaceAbi = [
    {
        name: 'initialize',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'motoAddress',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'premineAmount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'devAddress',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'motoPerBlock',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'bonusEndBlock',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'bonusMultiplier',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'treasuryAddress',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'BTCAllocPoint',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'MOTOAllocPoint',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'totalAllocPoint',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'totalAllocPoint',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'devAddress',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'devAddress',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'getMotoPerBlock',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'motoPerBlock',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getBonusEndBlock',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'bonusEndBlock',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getBonusMultiplier',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'bonusMultiplier',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getLpTokens',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'lpTokens',
                type: ABIDataTypes.ARRAY_OF_ADDRESSES,
            },
        ],
    },
    {
        name: 'getPoolsLength',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'poolsLength',
                type: ABIDataTypes.UINT32,
            },
        ],
    },
    {
        name: 'getLpToken',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
        ],
        outputs: [
            {
                name: 'lpToken',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'getPoolInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
        ],
        outputs: [
            {
                name: 'accMotoPerShare',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'lastRewardBlock',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT64,
            },
        ],
    },
    {
        name: 'getUserInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'rewardDebt',
                type: ABIDataTypes.INT128,
            },
        ],
    },
    {
        name: 'getMultiplier',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'from',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'to',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'multiplier',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'pendingMoto',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'pendingMoto',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'treasuryAddress',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'treasuryAddress',
                type: ABIDataTypes.STRING,
            },
        ],
    },
    {
        name: 'getStakingTxId',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'stakingTxId',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getStakingIndex',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'stakingIndex',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'totalBTCStaked',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'totalBTCStaked',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'stakeBTC',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'unstakeBTC',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [],
    },
    {
        name: 'removeBTCStake',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
    },
    {
        name: 'add',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'lpToken',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
    },
    {
        name: 'set',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'updatePool',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
        ],
        outputs: [
            {
                name: 'accMotoPerShare',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'lastRewardBlock',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT64,
            },
        ],
    },
    {
        name: 'massUpdatePools',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'length',
                type: ABIDataTypes.UINT16,
            },
            {
                name: 'poolIds',
                type: ABIDataTypes.ARRAY_OF_UINT32,
            },
        ],
        outputs: [],
    },
    {
        name: 'deposit',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
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
        outputs: [],
    },
    {
        name: 'withdraw',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
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
        outputs: [],
    },
    {
        name: 'harvest',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
    },
    {
        name: 'withdrawAndHarvest',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
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
        outputs: [],
    },
    {
        name: 'emergencyWithdraw',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
    },
    {
        name: 'onOP20Received',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'data',
                type: ABIDataTypes.BYTES,
            },
        ],
        outputs: [
            {
                name: 'selector',
                type: ABIDataTypes.BYTES4,
            },
        ],
    },
    {
        name: 'setMotoPerBlock',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'motoPerBlock',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'setBonusEndBlock',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'bonusEndBlock',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'setBonusMultiplier',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'bonusMultiplier',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'setDev',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'devAddress',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
    },

    // Ownable
    ...OwnableEvents,
    ...OWNABLE_ABI,

    // Events
    ...MotoChefEvents,

    // OP_NET
    ...OP_NET_ABI,
];
