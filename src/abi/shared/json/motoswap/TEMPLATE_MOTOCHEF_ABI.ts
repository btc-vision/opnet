import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { MOTOCHEF_ABI } from './MOTOCHEF_ABI.js';

const FUNCTIONS_TO_OVERRIDE = new Set([
    'initialize',
    'stakeBtc',
    'unstakeBtc',
    'harvest',
    'withdrawAndHarvest',
]);

const BaseMotoChefAbi: BitcoinInterfaceAbi = MOTOCHEF_ABI.filter(
    (entry) =>
        !(
            entry.type === BitcoinAbiTypes.Function &&
            entry.name &&
            FUNCTIONS_TO_OVERRIDE.has(entry.name)
        ),
);

const TemplateMotoChefOverrides: BitcoinInterfaceAbi = [
    {
        name: 'initialize',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'userTokenAddress', type: ABIDataTypes.ADDRESS },
            { name: 'tokenPerBlock', type: ABIDataTypes.UINT256 },
            { name: 'bonusEndBlock', type: ABIDataTypes.UINT256 },
            { name: 'bonusMultiplier', type: ABIDataTypes.UINT256 },
            { name: 'BTCAllocPoint', type: ABIDataTypes.UINT256 },
            { name: 'tokenAllocPoint', type: ABIDataTypes.UINT256 },
            { name: 'userBTCFeePercentage', type: ABIDataTypes.UINT256 },
            { name: 'userFeeRecipient', type: ABIDataTypes.STRING },
            { name: 'motoSwapFeeRecipient', type: ABIDataTypes.STRING },
            { name: 'opnetFeeRecipient', type: ABIDataTypes.STRING },
            { name: 'farmName', type: ABIDataTypes.STRING },
            { name: 'farmBanner', type: ABIDataTypes.STRING },
            { name: 'additionalPoolTokens', type: ABIDataTypes.ARRAY_OF_ADDRESSES },
            { name: 'additionalPoolAllocPoints', type: ABIDataTypes.ARRAY_OF_UINT256 },
        ],
        outputs: [],
    },
    {
        name: 'getFarmName',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'name', type: ABIDataTypes.STRING }],
    },
    {
        name: 'getFarmBanner',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'banner', type: ABIDataTypes.STRING }],
    },
    {
        name: 'stakeBTC',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
        outputs: [],
    },
    {
        name: 'unstakeBTC',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [],
    },
    {
        name: 'harvest',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'poolId', type: ABIDataTypes.UINT32 },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [],
    },
    {
        name: 'setUserTokenAddress',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'tokenAddress', type: ABIDataTypes.ADDRESS }],
        outputs: [],
    },
    {
        name: 'transferOwnershipToUser',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'newOwner', type: ABIDataTypes.ADDRESS }],
        outputs: [],
    },
    {
        name: 'userFeeRecipient',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'recipient', type: ABIDataTypes.STRING }],
    },
    {
        name: 'motoSwapFeeRecipient',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'recipient', type: ABIDataTypes.STRING }],
    },
    {
        name: 'opnetFeeRecipient',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'recipient', type: ABIDataTypes.STRING }],
    },
    {
        name: 'btcFeePercentage',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'percentage', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'getFeeDistributionBps',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            { name: 'userFeeBps', type: ABIDataTypes.UINT256 },
            { name: 'motoSwapFeeBps', type: ABIDataTypes.UINT256 },
            { name: 'opnetFeeBps', type: ABIDataTypes.UINT256 },
            { name: 'totalBps', type: ABIDataTypes.UINT256 },
        ],
    },
    {
        name: 'totalUserTokenStaked',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'totalStaked', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'withdrawAndHarvest',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'poolId', type: ABIDataTypes.UINT32 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'to', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [],
    },
];

export const TemplateMotoChefAbi: BitcoinInterfaceAbi = [
    ...TemplateMotoChefOverrides,
    ...BaseMotoChefAbi,
];

export default TemplateMotoChefAbi;
