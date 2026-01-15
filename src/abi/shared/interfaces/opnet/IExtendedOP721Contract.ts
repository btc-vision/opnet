import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP721Contract, TransferredEventNFT, URIEventNFT } from './IOP721Contract.js';

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
export type SetMintEnabled = CallResult<{}, [OPNetEvent<MintStatusChangedEventNFT>]>;

/**
 * @description Represents the result of the isMintEnabled function call.
 */
export type IsMintEnabled = CallResult<
    {
        enabled: boolean;
    },
    []
>;

/**
 * @description Represents the result of the reserve function call.
 */
export type ReserveNFT = CallResult<
    {
        readonly remainingPayment: bigint;
        readonly reservationBlock: bigint;
    },
    [OPNetEvent<ReservationCreatedEventNFT>]
>;

/**
 * @description Represents the result of the claim function call.
 * Emits 1 ReservationClaimed event followed by N Transferred events (one per NFT minted).
 */
export type ClaimNFT = CallResult<
    {},
    [OPNetEvent<ReservationClaimedEventNFT>, ...OPNetEvent<TransferredEventNFT>[]]
>;

/**
 * @description Represents the result of the purgeExpired function call.
 * Emits 0-N ReservationExpired events (one per expired block processed).
 */
export type PurgeExpiredNFT = CallResult<{}, [...OPNetEvent<ReservationExpiredEventNFT>[]]>;

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
    []
>;

/**
 * @description Represents the result of the airdrop function call.
 * Emits N Transferred events (one per NFT minted).
 */
export type AirdropNFT = CallResult<{}, [...OPNetEvent<TransferredEventNFT>[]]>;

/**
 * @description Represents the result of the setTokenURI function call.
 */
export type SetTokenURI = CallResult<{}, [OPNetEvent<URIEventNFT>]>;

export interface IExtendedOP721Contract extends IOP721Contract {
    setMintEnabled(enabled: boolean): Promise<SetMintEnabled>;
    isMintEnabled(): Promise<IsMintEnabled>;
    airdrop(addresses: Address[], amounts: number[]): Promise<AirdropNFT>;
    reserve(quantity: bigint): Promise<ReserveNFT>;
    claim(): Promise<ClaimNFT>;
    purgeExpired(): Promise<PurgeExpiredNFT>;
    getStatus(): Promise<GetStatus>;
    setTokenURI(tokenId: bigint, uri: string): Promise<SetTokenURI>;
}

/**
 * @deprecated Use IExtendedOP721Contract instead
 */
export type IExtendedOP721 = IExtendedOP721Contract;
