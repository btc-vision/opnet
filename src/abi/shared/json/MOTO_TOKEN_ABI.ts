import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20_ABI } from './OP_20_ABI.js';

/**
 * @category ABI
 */
export const MOTO_TOKEN_ABI: BitcoinInterfaceAbi = [
    {
        name: 'airdrop',
        inputs: [
            {
                name: 'map_of_recipients_and_amounts',
                type: ABIDataTypes.ADDRESS_UINT256_TUPLE,
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

    // OP_20
    ...OP_20_ABI,
];
