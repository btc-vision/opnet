import { ABIDataTypes } from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../../../BitcoinAbiTypes.js';
import { BitcoinInterfaceAbi } from '../../../interfaces/BitcoinInterfaceAbi.js';
import { OP_NET_ABI } from './OP_NET_ABI.js';

/**
 * @category Events
 */
export const OP721Events: BitcoinInterfaceAbi = [
    {
        name: 'Transferred',
        values: [
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Approved',
        values: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'spender',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ApprovedForAll',
        values: [
            {
                name: 'account',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'approved',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'URI',
        values: [
            {
                name: 'value',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'id',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

/**
 * @category ABI
 */
export const OP_721_ABI: BitcoinInterfaceAbi = [
    {
        name: 'name',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'name',
                type: ABIDataTypes.STRING,
            },
        ],
    },
    {
        name: 'symbol',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'symbol',
                type: ABIDataTypes.STRING,
            },
        ],
    },
    {
        name: 'maxSupply',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'maxSupply',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'collectionInfo',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'icon',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'banner',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'description',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'website',
                type: ABIDataTypes.STRING,
            },
        ],
    },
    {
        name: 'tokenURI',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'uri',
                type: ABIDataTypes.STRING,
            },
        ],
    },
    {
        name: 'changeMetadata',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [],
    },
    {
        name: 'totalSupply',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'totalSupply',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'balanceOf',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'balance',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'ownerOf',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
    },
    {
        name: 'safeTransfer',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'data',
                type: ABIDataTypes.BYTES,
            },
        ],
        outputs: [],
    },
    {
        name: 'safeTransferFrom',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'from',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'to',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'data',
                type: ABIDataTypes.BYTES,
            },
        ],
        outputs: [],
    },
    {
        name: 'approve',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'getApproved',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'setApprovalForAll',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'approved',
                type: ABIDataTypes.BOOL,
            },
        ],
        outputs: [],
    },
    {
        name: 'isApprovedForAll',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'approved',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'approveBySignature',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.BYTES32,
            },
            {
                name: 'ownerTweakedPublicKey',
                type: ABIDataTypes.BYTES32,
            },
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'deadline',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'signature',
                type: ABIDataTypes.BYTES,
            },
        ],
        outputs: [],
    },
    {
        name: 'setApprovalForAllBySignature',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.BYTES32,
            },
            {
                name: 'ownerTweakedPublicKey',
                type: ABIDataTypes.BYTES32,
            },
            {
                name: 'operator',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'approved',
                type: ABIDataTypes.BOOL,
            },
            {
                name: 'deadline',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'signature',
                type: ABIDataTypes.BYTES,
            },
        ],
        outputs: [],
    },
    {
        name: 'burn',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [],
    },
    {
        name: 'domainSeparator',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'domainSeparator',
                type: ABIDataTypes.BYTES32,
            },
        ],
    },
    {
        name: 'tokenOfOwnerByIndex',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'index',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'getApproveNonce',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: ABIDataTypes.ADDRESS,
            },
        ],
        outputs: [
            {
                name: 'nonce',
                type: ABIDataTypes.UINT256,
            },
        ],
    },
    {
        name: 'setBaseURI',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'baseURI',
                type: ABIDataTypes.STRING,
            },
        ],
        outputs: [],
    },
    {
        name: 'metadata',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'name',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'symbol',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'icon',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'banner',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'description',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'website',
                type: ABIDataTypes.STRING,
            },
            {
                name: 'totalSupply',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'domainSeparator',
                type: ABIDataTypes.BYTES32,
            },
        ],
    },

    ...OP721Events,

    // OP_NET
    ...OP_NET_ABI,
];

export const EXTENDED_OP721_EVENTS: BitcoinInterfaceAbi = [
    {
        name: 'MintStatusChanged',
        values: [
            {
                name: 'enabled',
                type: ABIDataTypes.BOOL,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ReservationCreated',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'block',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'feePaid',
                type: ABIDataTypes.UINT64,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ReservationClaimed',
        values: [
            {
                name: 'user',
                type: ABIDataTypes.ADDRESS,
            },
            {
                name: 'amount',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'firstTokenId',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'ReservationExpired',
        values: [
            {
                name: 'block',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'amountRecovered',
                type: ABIDataTypes.UINT256,
            },
        ],
        type: BitcoinAbiTypes.Event,
    },
];

export const EXTENDED_OP721_ABI: BitcoinInterfaceAbi = [
    {
        name: 'setMintEnabled',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'enabled',
                type: ABIDataTypes.BOOL,
            },
        ],
        outputs: [],
    },
    {
        name: 'isMintEnabled',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'enabled',
                type: ABIDataTypes.BOOL,
            },
        ],
    },
    {
        name: 'reserve',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'quantity',
                type: ABIDataTypes.UINT256,
            },
        ],
        outputs: [
            {
                name: 'remainingPayment',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'reservationBlock',
                type: ABIDataTypes.UINT64,
            },
        ],
    },
    {
        name: 'claim',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [],
    },
    {
        name: 'purgeExpired',
        type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [],
    },
    {
        name: 'getStatus',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            {
                name: 'minted',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'reserved',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'available',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'maxSupply',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'blocksWithReservations',
                type: ABIDataTypes.UINT32,
            },
            {
                name: 'pricePerToken',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'reservationFeePercent',
                type: ABIDataTypes.UINT64,
            },
            {
                name: 'minReservationFee',
                type: ABIDataTypes.UINT64,
            },
        ],
    },

    {
        name: 'airdrop',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'addresses',
                type: ABIDataTypes.ARRAY_OF_ADDRESSES,
            },
            {
                name: 'amounts',
                type: ABIDataTypes.ARRAY_OF_UINT8,
            },
        ],
        outputs: [],
    },

    {
        name: 'setTokenURI',
        type: BitcoinAbiTypes.Function,
        inputs: [
            {
                name: 'tokenId',
                type: ABIDataTypes.UINT256,
            },
            {
                name: 'uri',
                type: ABIDataTypes.STRING,
            },
        ],
        outputs: [],
    },

    ...EXTENDED_OP721_EVENTS,

    ...OP_721_ABI,
];
