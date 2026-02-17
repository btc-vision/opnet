import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20_ABI } from '../opnet/OP_20_ABI.js';
import { OP_NET_ABI } from '../opnet/OP_NET_ABI.js';

export const TemplateOP20Events: BitcoinInterfaceAbi = [
    {
        name: 'FreeMintConfigured',
        values: [
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'supply', type: ABIDataTypes.UINT256 },
            { name: 'perTxLimit', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'FreeMintClaimed',
        values: [
            { name: 'user', type: ABIDataTypes.ADDRESS },
            { name: 'token', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'TokenOwnerTransferred',
        values: [
            { name: 'previousOwner', type: ABIDataTypes.ADDRESS },
            { name: 'newOwner', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

export const TemplateOP20Abi: BitcoinInterfaceAbi = [
    {
        name: 'initialize',
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
        outputs: [],
    },
    {
        name: 'mint',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
    },
    {
        name: 'grantMinterRole',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'minter', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'revokeMinterRole',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'minter', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'isMinter',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'account', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'isMinter', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'getTokenOwner',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'getFactoryAddress',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'factory', type: ABIDataTypes.ADDRESS }],
    },
    {
        name: 'transferTokenOwner',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'newOwner', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'freeMint',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'getFreeMintInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'info', type: ABIDataTypes.BYTES }],
    },
    {
        name: 'deployer',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'deployer', type: ABIDataTypes.ADDRESS }],
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
    ...TemplateOP20Events,
    ...OP_20_ABI,
    ...OP_NET_ABI,
];

export default TemplateOP20Abi;
