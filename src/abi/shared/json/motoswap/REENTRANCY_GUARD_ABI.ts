import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';

/**
 * @category ABI
 */
export const REENTRANCY_GUARD_ABI: BitcoinInterfaceAbi = [
    {
        name: 'status',
        inputs: [],
        outputs: [
            {
                name: 'status',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Function,
    },
];
