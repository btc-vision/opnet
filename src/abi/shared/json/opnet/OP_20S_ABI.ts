import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_20_ABI } from './OP_20_ABI.js';

const OP20SEvents: BitcoinInterfaceAbi = [
    {
        name: 'PegRateUpdated',
        values: [
            { name: 'oldRate', type: ABIDataTypes.UINT256 },
            { name: 'newRate', type: ABIDataTypes.UINT256 },
            { name: 'updatedAt', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'MaxStalenessUpdated',
        values: [
            { name: 'oldStaleness', type: ABIDataTypes.UINT64 },
            { name: 'newStaleness', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PegAuthorityTransferStarted',
        values: [
            { name: 'currentAuthority', type: ABIDataTypes.ADDRESS },
            { name: 'pendingAuthority', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PegAuthorityTransferred',
        values: [
            { name: 'previousAuthority', type: ABIDataTypes.ADDRESS },
            { name: 'newAuthority', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PegAuthorityRenounced',
        values: [{ name: 'previousAuthority', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Event,
    },
];

export const OP_20S_ABI: BitcoinInterfaceAbi = [
    {
        name: 'pegRate',
        constant: true,
        inputs: [],
        outputs: [{ name: 'rate', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'pegAuthority',
        constant: true,
        inputs: [],
        outputs: [{ name: 'authority', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'pegUpdatedAt',
        constant: true,
        inputs: [],
        outputs: [{ name: 'updatedAt', type: ABIDataTypes.UINT64 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'maxStaleness',
        constant: true,
        inputs: [],
        outputs: [{ name: 'staleness', type: ABIDataTypes.UINT64 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'isStale',
        constant: true,
        inputs: [],
        outputs: [{ name: 'stale', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'updatePegRate',
        inputs: [{ name: 'newRate', type: ABIDataTypes.UINT256 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'updateMaxStaleness',
        inputs: [{ name: 'newStaleness', type: ABIDataTypes.UINT64 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transferPegAuthority',
        inputs: [{ name: 'newAuthority', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'acceptPegAuthority',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'renouncePegAuthority',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    ...OP20SEvents,
    ...OP_20_ABI,
];
