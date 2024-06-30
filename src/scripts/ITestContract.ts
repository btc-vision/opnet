import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BitcoinAbiTypes } from '../abi/BitcoinAbiTypes.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinInterfaceAbi } from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';

export interface WBTCContract extends BaseContractProperties {
    balanceOf(address: BitcoinAddressLike): Promise<BaseContractProperty>;

    owner(): Promise<BaseContractProperty>;

    name(): Promise<BaseContractProperty>;

    symbol(): Promise<BaseContractProperty>;

    totalSupply(): Promise<BaseContractProperty>;

    decimals(): Promise<BaseContractProperty>;

    transfer(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;

    transferFrom(
        from: BitcoinAddressLike,
        to: BitcoinAddressLike,
        value: bigint,
    ): Promise<BaseContractProperty>;

    approve(spender: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;

    allowance(
        owner: BitcoinAddressLike,
        spender: BitcoinAddressLike,
    ): Promise<BaseContractProperty>;

    mint(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;

    burn(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;

    isAddressOwner(address: BitcoinAddressLike): Promise<BaseContractProperty>;
}

export const wBTCAbi: BitcoinInterfaceAbi = [
    {
        name: 'allowance',
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'spender',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'remaining',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'approve',
        inputs: [
            {
                name: 'spender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'value',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'balanceOf',
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'balance',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'burn',
        inputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'value',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'mint',
        inputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'value',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transfer',
        inputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'value',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transferFrom',
        inputs: [
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'value',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // Properties
    {
        name: 'decimals',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'decimals',
                type: ABIDataTypes.UINT8,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'name',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'name',
                type: ABIDataTypes.STRING,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'symbol',
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'symbol',
                type: ABIDataTypes.STRING,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'totalSupply',
        inputs: [],
        outputs: [
            {
                name: 'totalSupply',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // Events
    {
        name: 'Mint',
        values: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Transfer',
        values: [
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Burn',
        values: [
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },

    // OP_NET
    {
        name: 'owner',
        constant: true,
        outputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'isAddressOwner',
        inputs: [
            {
                name: 'address',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'isOwner',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
];
