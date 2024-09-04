import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { OP_NET_ABI } from './OP_NET_ABI.js';
export const MotoSwapFactoryEvents = [
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
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];
export const MotoSwapFactoryAbi = [
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
                name: 'pool',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'poolAddr',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getPool',
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
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    ...MotoSwapFactoryEvents,
    ...OP_NET_ABI,
];
