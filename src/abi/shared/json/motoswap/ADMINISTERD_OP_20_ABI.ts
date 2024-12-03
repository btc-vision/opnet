import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes';
import { OP_20_ABI } from '../opnet/OP_20_ABI';

const ADMINISTERED_OP_20_ABI: BitcoinInterfaceAbi = [
    {
        name: 'admin',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'ADDRESS',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'changeAdmin',
        type: BitcoinAbiTypes.Function,
        constant: false,
        payable: false,
        inputs: [
            {
                name: 'newAdmin',
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
        constant: false,
        payable: false,
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
        constant: false,
        payable: false,
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

export default ADMINISTERED_OP_20_ABI;
