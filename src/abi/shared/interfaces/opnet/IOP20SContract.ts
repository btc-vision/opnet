import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP20Contract } from './IOP20Contract.js';

export type PegRateUpdatedEvent = {
    readonly oldRate: bigint;
    readonly newRate: bigint;
    readonly updatedAt: bigint;
};

export type MaxStalenessUpdatedEvent = {
    readonly oldStaleness: bigint;
    readonly newStaleness: bigint;
};

export type PegAuthorityTransferStartedEvent = {
    readonly currentAuthority: Address;
    readonly pendingAuthority: Address;
};

export type PegAuthorityTransferredEvent = {
    readonly previousAuthority: Address;
    readonly newAuthority: Address;
};

export type PegAuthorityRenouncedEvent = {
    readonly previousAuthority: Address;
};

export type PegRate = CallResult<{ rate: bigint }, []>;

export type PegAuthority = CallResult<{ authority: Address }, []>;

export type PegUpdatedAt = CallResult<{ updatedAt: bigint }, []>;

export type MaxStaleness = CallResult<{ staleness: bigint }, []>;

export type IsStale = CallResult<{ stale: boolean }, []>;

export type UpdatePegRate = CallResult<{}, [OPNetEvent<PegRateUpdatedEvent>]>;

export type UpdateMaxStaleness = CallResult<{}, [OPNetEvent<MaxStalenessUpdatedEvent>]>;

export type TransferPegAuthority = CallResult<{}, [OPNetEvent<PegAuthorityTransferStartedEvent>]>;

export type AcceptPegAuthority = CallResult<{}, [OPNetEvent<PegAuthorityTransferredEvent>]>;

export type RenouncePegAuthority = CallResult<{}, [OPNetEvent<PegAuthorityRenouncedEvent>]>;

/**
 * @description This interface represents the OP20S stable token contract,
 * extending OP20 with peg rate management functionality.
 *
 * @interface IOP20SContract
 * @extends {IOP20Contract}
 * @category Contracts
 */
export interface IOP20SContract extends IOP20Contract {
    /**
     * @description Gets the current peg rate.
     * @returns {Promise<PegRate>}
     */
    pegRate(): Promise<PegRate>;

    /**
     * @description Gets the peg authority address.
     * @returns {Promise<PegAuthority>}
     */
    pegAuthority(): Promise<PegAuthority>;

    /**
     * @description Gets the block number when peg was last updated.
     * @returns {Promise<PegUpdatedAt>}
     */
    pegUpdatedAt(): Promise<PegUpdatedAt>;

    /**
     * @description Gets the maximum staleness threshold in blocks.
     * @returns {Promise<MaxStaleness>}
     */
    maxStaleness(): Promise<MaxStaleness>;

    /**
     * @description Checks if the peg rate is stale.
     * @returns {Promise<IsStale>}
     */
    isStale(): Promise<IsStale>;

    /**
     * @description Updates the peg rate. Only callable by peg authority.
     * @param newRate - The new peg rate.
     * @returns {Promise<UpdatePegRate>}
     */
    updatePegRate(newRate: bigint): Promise<UpdatePegRate>;

    /**
     * @description Updates the max staleness threshold. Only callable by peg authority.
     * @param newStaleness - The new max staleness in blocks.
     * @returns {Promise<UpdateMaxStaleness>}
     */
    updateMaxStaleness(newStaleness: bigint): Promise<UpdateMaxStaleness>;

    /**
     * @description Initiates peg authority transfer. Only callable by current peg authority.
     * @param newAuthority - The new peg authority address.
     * @returns {Promise<TransferPegAuthority>}
     */
    transferPegAuthority(newAuthority: Address): Promise<TransferPegAuthority>;

    /**
     * @description Accepts pending peg authority transfer. Only callable by pending authority.
     * @returns {Promise<AcceptPegAuthority>}
     */
    acceptPegAuthority(): Promise<AcceptPegAuthority>;

    /**
     * @description Renounces peg authority permanently. Only callable by peg authority.
     * @returns {Promise<RenouncePegAuthority>}
     */
    renouncePegAuthority(): Promise<RenouncePegAuthority>;
}
