import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20S_ABI } from '../opnet/OP_20S_ABI.js';

export const MultiOracleStablecoinEvents: BitcoinInterfaceAbi = [
    {
        name: 'OracleAdded',
        values: [
            { name: 'oracle', type: ABIDataTypes.ADDRESS },
            { name: 'addedBy', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'OracleRemoved',
        values: [
            { name: 'oracle', type: ABIDataTypes.ADDRESS },
            { name: 'removedBy', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PriceSubmitted',
        values: [
            { name: 'oracle', type: ABIDataTypes.ADDRESS },
            { name: 'price', type: ABIDataTypes.UINT256 },
            { name: 'blockNumber', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PriceAggregated',
        values: [
            { name: 'medianPrice', type: ABIDataTypes.UINT256 },
            { name: 'oracleCount', type: ABIDataTypes.UINT32 },
            { name: 'blockNumber', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Minted',
        values: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

export const MultiOracleStablecoin_ABI: BitcoinInterfaceAbi = [
    {
        name: 'addOracle',
        inputs: [{ name: 'oracle', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'removeOracle',
        inputs: [{ name: 'oracle', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'submitPrice',
        inputs: [{ name: 'price', type: ABIDataTypes.UINT256 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'aggregatePrice',
        inputs: [{ name: 'oracles', type: ABIDataTypes.ARRAY_OF_ADDRESSES }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'mint',
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'oracleCount',
        constant: true,
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'minOracles',
        constant: true,
        inputs: [],
        outputs: [{ name: 'min', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'isOracleActive',
        constant: true,
        inputs: [{ name: 'oracle', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'active', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'oracleSubmission',
        constant: true,
        inputs: [{ name: 'oracle', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'price', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'admin',
        constant: true,
        inputs: [],
        outputs: [{ name: 'admin', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },
    ...MultiOracleStablecoinEvents,
    ...OP_20S_ABI,
];
