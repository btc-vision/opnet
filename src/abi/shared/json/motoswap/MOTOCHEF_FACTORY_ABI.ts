import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

export const MotoChefFactoryEvents: BitcoinInterfaceAbi = [
    {
        name: 'TokenDeployed',
        values: [
            { name: 'deployer', type: ABIDataTypes.ADDRESS },
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'name', type: ABIDataTypes.STRING },
            { name: 'symbol', type: ABIDataTypes.STRING },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'MotoChefDeployed',
        values: [
            { name: 'deployer', type: ABIDataTypes.ADDRESS },
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'motoChef', type: ABIDataTypes.ADDRESS },
            { name: 'userBTCFeePercentage', type: ABIDataTypes.UINT256 },
            { name: 'farmName', type: ABIDataTypes.STRING },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'FeeRecipientsUpdated',
        values: [
            { name: 'motoSwapFeeRecipient', type: ABIDataTypes.STRING },
            { name: 'opnetFeeRecipient', type: ABIDataTypes.STRING },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'FactoryPaused',
        values: [{ name: 'by', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'FactoryUnpaused',
        values: [{ name: 'by', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Event,
    },
];

export const MotoChefFactoryAbi: BitcoinInterfaceAbi = [
    {
        name: 'initialize',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'pauseFactory',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'unpauseFactory',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'isPaused',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'isPaused', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'owner',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getTokenDeployer',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'tokenAddress', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'deployer', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getTokenOwner',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'tokenAddress', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'deployToken',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'maxSupply', type: ABIDataTypes.UINT256 },
            { name: 'decimals', type: ABIDataTypes.UINT8 },
            { name: 'name', type: ABIDataTypes.STRING },
            { name: 'symbol', type: ABIDataTypes.STRING },
            { name: 'initialMintTo', type: ABIDataTypes.ADDRESS },
            { name: 'initialMintAmount', type: ABIDataTypes.UINT256 },
            { name: 'freeMintSupply', type: ABIDataTypes.UINT256 },
            { name: 'freeMintPerTx', type: ABIDataTypes.UINT256 },
            { name: 'tokenOwner', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'deployMotoChef',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'tokenPerBlock', type: ABIDataTypes.UINT256 },
            { name: 'bonusEndBlock', type: ABIDataTypes.UINT256 },
            { name: 'bonusMultiplier', type: ABIDataTypes.UINT256 },
            { name: 'BTCAllocPoint', type: ABIDataTypes.UINT256 },
            { name: 'tokenAddress', type: ABIDataTypes.ADDRESS },
            { name: 'tokenAllocPoint', type: ABIDataTypes.UINT256 },
            { name: 'userBTCFeePercentage', type: ABIDataTypes.UINT256 },
            { name: 'userFeeRecipient', type: ABIDataTypes.STRING },
            { name: 'farmName', type: ABIDataTypes.STRING },
            { name: 'farmBanner', type: ABIDataTypes.STRING },
            { name: 'additionalPoolTokens', type: ABIDataTypes.ARRAY_OF_ADDRESSES },
            { name: 'additionalPoolAllocPoints', type: ABIDataTypes.ARRAY_OF_UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'updateTokenOwner',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'tokenAddress', type: ABIDataTypes.ADDRESS },
            { name: 'newOwner', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'getUserTokens',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'deployer', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'tokens', type: ABIDataTypes.BYTES }],
    },
    {
        name: 'getTokenMotoChef',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'tokenAddress', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'motoChefAddress', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getDeploymentInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'deployer', type: ABIDataTypes.ADDRESS }],
        outputs: [
            { name: 'has', type: ABIDataTypes.BOOL },
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'motoChef', type: ABIDataTypes.ADDRESS },
            { name: 'block', type: ABIDataTypes.UINT64 },
        ],
    },
    {
        name: 'getDeploymentsCount',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT32 }],
    },
    {
        name: 'getDeploymentByIndex',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'index', type: ABIDataTypes.UINT32 }],
        outputs: [
            { name: 'deployer', type: ABIDataTypes.ADDRESS },
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'motoChef', type: ABIDataTypes.ADDRESS },
            { name: 'block', type: ABIDataTypes.UINT64 },
        ],
    },
    {
        name: 'onOP20Received',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [{ name: 'selector', type: ABIDataTypes.BYTES4 }],
    },
    ...MotoChefFactoryEvents,
    ...OP_NET_ABI,
];

export default MotoChefFactoryAbi;
