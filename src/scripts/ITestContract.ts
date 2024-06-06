import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BitcoinAbiTypes } from '../abi/BitcoinAbiTypes.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinInterfaceAbi } from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';

export interface WBTCContract extends BaseContractProperties {
    balanceOf(address: BitcoinAddressLike): Promise<BaseContractProperty>;

    owner(): Promise<BaseContractProperty>;
}

export const wBTCAbi: BitcoinInterfaceAbi = [
    {
        name: 'balanceOf',
        inputs: [
            {
                name: 'address',
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
        name: 'Mint',
        type: BitcoinAbiTypes.Event,
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
    },
];
