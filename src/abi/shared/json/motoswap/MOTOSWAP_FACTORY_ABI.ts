import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

export const MotoSwapFactoryEvents: BitcoinInterfaceAbi = [
    {
        name: 'PoolCreated',
        values: [
            {
                name: 'token0',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'token1',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'pool',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

export const MotoSwapFactoryAbi: BitcoinInterfaceAbi = [
    {
        name: 'createPool',
        inputs: [
            {
                name: 'tokenA',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenB',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'address',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getPool',
        constant: true,
        inputs: [
            {
                name: 'tokenA',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenB',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'pool',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setStakingContractAddress',
        inputs: [
            {
                name: 'stakingContractAddress',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getStakingContractAddress',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'stakingContractAddress',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    ...MotoSwapFactoryEvents,

    // OP_NET
    ...OP_NET_ABI,
];
