import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi';

const OWNABLE_ABI: BitcoinInterfaceAbi = [
    {
        name: 'admin',
        type: BitcoinAbiTypes.Function,
        constant: true,
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
];

export default OWNABLE_ABI;
