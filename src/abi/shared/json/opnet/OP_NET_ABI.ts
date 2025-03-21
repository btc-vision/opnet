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
        name: 'contractDeployer',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'contractDeployer',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
];
