import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from './OP_NET_ABI.js';

/**
 * @category Events
 */
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
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

/**
 * @category ABI
 */
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
                name: 'pool',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'address',
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

    // OP_NET
    ...OP_NET_ABI,
];
