import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../../BitcoinAbiTypes.js';
import { OP_20_ABI } from './OP_20_ABI.js';
import { STAKING_ABI } from './STAKING_ABI.js';
export const WBTCEvents = [
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
export const WBTC_ABI = [
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
    ...WBTCEvents,
    ...STAKING_ABI,
    ...OP_20_ABI,
];
