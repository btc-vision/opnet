import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP721, TransferredEventNFT, URIEventNFT } from './IOP721Contract.js';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type MintStatusChangedEventNFT = {
    readonly enabled: boolean;
};

export type ReservationCreatedEventNFT = {
    readonly user: Address;
    readonly amount: bigint;
    readonly block: bigint;
    readonly feePaid: bigint;
};

export type ReservationClaimedEventNFT = {
    readonly user: Address;
    readonly amount: bigint;
    readonly firstTokenId: bigint;
};

export type ReservationExpiredEventNFT = {
    readonly block: bigint;
    readonly amountRecovered: bigint;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the setMintEnabled function call.
 */
export type SetMintEnabled = CallResult<{}, OPNetEvent<MintStatusChangedEventNFT>[]>;

/**
 * @description Represents the result of the isMintEnabled function call.
 */
export type IsMintEnabled = CallResult<
    {
        enabled: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the reserve function call.
 */
export type ReserveNFT = CallResult<
    {
        readonly remainingPayment: bigint;
        readonly reservationBlock: bigint;
    },
    OPNetEvent<ReservationCreatedEventNFT>[]
>;

/**
 * @description Represents the result of the claim function call.
 */
export type ClaimNFT = CallResult<
    {},
    OPNetEvent<ReservationClaimedEventNFT | TransferredEventNFT>[]
>;

/**
 * @description Represents the result of the purgeExpired function call.
 */
export type PurgeExpiredNFT = CallResult<{}, OPNetEvent<ReservationExpiredEventNFT>[]>;

/**
 * @description Represents the result of the getStatus function call.
 */
export type GetStatus = CallResult<
    {
        minted: bigint;
        reserved: bigint;
        available: bigint;
        maxSupply: bigint;
        blocksWithReservations: number;
        pricePerToken: bigint;
        reservationFeePercent: bigint;
        minReservationFee: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the airdrop function call.
 */
export type Airdrop = CallResult<{}, OPNetEvent<TransferredEventNFT>[]>;

/**
 * @description Represents the result of the setTokenURI function call.
 */
export type SetTokenURI = CallResult<{}, OPNetEvent<URIEventNFT>[]>;

export interface IExtendedOP721 extends IOP721 {
    setMintEnabled(enabled: boolean): Promise<SetMintEnabled>;
    isMintEnabled(): Promise<IsMintEnabled>;
    airdrop(addresses: Address[], amounts: number[]): Promise<Airdrop>;
    reserve(quantity: bigint): Promise<ReserveNFT>;
    claim(): Promise<ClaimNFT>;
    purgeExpired(): Promise<PurgeExpiredNFT>;
    getStatus(): Promise<GetStatus>;
    setTokenURI(tokenId: bigint, uri: string): Promise<SetTokenURI>;
}
