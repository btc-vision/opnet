import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20_ABI } from '../opnet/OP_20_ABI.js';

export const MOTO_ABI: BitcoinInterfaceAbi = [
    {
        name: 'admin',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [
            {
                name: 'adminAddress',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'changeAdmin',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'adminMint',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'adminBurn',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'success',
                type: ABIDataTypes.BOOL,
            },
        ],
    },

    // OP_20
    ...OP_20_ABI,
];
