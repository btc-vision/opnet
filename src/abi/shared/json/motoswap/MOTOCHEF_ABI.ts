import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

export const OwnableEvents: BitcoinInterfaceAbi = [
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

export const MotoChefEvents: BitcoinInterfaceAbi = [
    {
        name: 'LogInit',
        values: [],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'LogPoolAddition',
        values: [
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'StakedBTC',
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
                name: 'stakeTxHash',
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
        name: 'LogUpdatePool',
        values: [
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'UnstakedBTC',
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
                name: 'storedTxHash',
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
        name: 'LogSetPool',
        values: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Deposit',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Withdraw',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Harvest',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'EmergencyWithdraw',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'poolId',
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
        type: BitcoinAbiTypes.Event,
    },
];

export const MOTOCHEF_OWNABLE_ABI: BitcoinInterfaceAbi = [
    {
        name: 'owner',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'renounceOwnership',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'totalAllocPoint',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'devAddress',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'getMotoPerBlock',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getBonusEndBlock',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getBonusMultiplier',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getLpTokens',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.ARRAY_OF_ADDRESSES,
            },
        ],
    },
    {
        name: 'getPoolsLength',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT64,
            },
        ],
    },
    {
        name: 'getLpToken',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'getPoolInfo',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
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
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
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
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'pendingMoto',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'treasuryAddress',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'getStakingTxHash',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getStakingIndex',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'totalBTCStaked',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'unstakeBTC',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'set',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'allocPoint',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'updatePool',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
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
                type: ABIDataTypes.ARRAY_OF_UINT64,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'deposit',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'withdraw',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'harvest',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'withdrawAndHarvest',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'emergencyWithdraw',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'poolId',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
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
        outputs: [
            {
                name: 'returnVal1',
                type: ABIDataTypes.BOOL,
            },
        ],
    },

    // Events
    ...MotoChefEvents,

    // OP_NET
    ...OP_NET_ABI,

    // Ownable
    ...MOTOCHEF_OWNABLE_ABI,
    ...OwnableEvents,
];

export default MOTOCHEF_ABI;
