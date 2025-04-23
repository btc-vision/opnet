import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';

export const OP_NET_ABI: BitcoinInterfaceAbi = [
    {
        name: 'address',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'address',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'deployer',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'deployer',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
];
