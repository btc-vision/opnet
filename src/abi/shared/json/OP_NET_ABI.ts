import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../interfaces/BitcoinInterfaceAbi.js';

/**
 * @category ABI
 */
export const OP_NET_ABI: BitcoinInterfaceAbi = [
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
