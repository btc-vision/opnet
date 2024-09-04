import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { OP_20_ABI } from './OP_20_ABI.js';
export const MOTO_TOKEN_ABI = [
    {
        name: 'airdrop',
        inputs: [
            {
                name: 'amount',
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
    ...OP_20_ABI,
];
