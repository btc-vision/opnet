import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20_ABI } from './OP_20_ABI.js';
import { STAKING_ABI } from './STAKING_ABI.js';

/**
 * @category Events
 */
export const WBTCEvents: BitcoinInterfaceAbi = [
    {
        name: 'WithdrawalRequest',
        values: [
            {
                name: 'address',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

/**
 * @category ABI
 */
export const WBTC_ABI: BitcoinInterfaceAbi = [
    {
        name: 'requestWithdrawal',
        inputs: [
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
        type: BitcoinAbiTypes.Function,
    },

    {
        name: 'withdrawableBalanceOf',
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

    // EVENTS
    ...WBTCEvents,

    // STAKING
    ...STAKING_ABI,

    // OP_20
    ...OP_20_ABI,
];
