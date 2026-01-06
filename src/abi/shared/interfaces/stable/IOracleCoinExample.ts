import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP20SContract } from '../opnet/IOP20SContract.js';

export type OracleAddedEvent = {
    readonly oracle: Address;
    readonly addedBy: Address;
};

export type OracleRemovedEvent = {
    readonly oracle: Address;
    readonly removedBy: Address;
};

export type PriceSubmittedEvent = {
    readonly oracle: Address;
    readonly price: bigint;
    readonly blockNumber: bigint;
};

export type PriceAggregatedEvent = {
    readonly medianPrice: bigint;
    readonly oracleCount: number;
    readonly blockNumber: bigint;
};

export type MintedEventOracle = {
    readonly to: Address;
    readonly amount: bigint;
};

export type AddOracle = CallResult<{}, [OPNetEvent<OracleAddedEvent>]>;

export type RemoveOracle = CallResult<{}, [OPNetEvent<OracleRemovedEvent>]>;

export type SubmitPrice = CallResult<{}, [OPNetEvent<PriceSubmittedEvent>]>;

export type AggregatePrice = CallResult<{}, [OPNetEvent<PriceAggregatedEvent>]>;

export type MintOracle = CallResult<{}, [OPNetEvent<MintedEventOracle>]>;

export type OracleCount = CallResult<{ count: bigint }, []>;

export type MinOracles = CallResult<{ min: bigint }, []>;

export type IsOracleActive = CallResult<{ active: boolean }, []>;

export type OracleSubmission = CallResult<{ price: bigint }, []>;

export type AdminMultiOracleStable = CallResult<{ admin: Address }, []>;

/**
 * @description This interface represents the MultiOracleStablecoin contract,
 * extending OP20S with multi-oracle price aggregation functionality.
 *
 * @interface IMultiOracleStablecoinContract
 * @extends {IOP20SContract}
 * @category Contracts
 */
export interface IMultiOracleStablecoinContract extends IOP20SContract {
    /**
     * @description Adds an oracle to the active set. Only callable by admin.
     * @param oracle - The oracle address to add.
     * @returns {Promise<AddOracle>}
     */
    addOracle(oracle: Address): Promise<AddOracle>;

    /**
     * @description Removes an oracle from the active set. Only callable by admin.
     * @param oracle - The oracle address to remove.
     * @returns {Promise<RemoveOracle>}
     */
    removeOracle(oracle: Address): Promise<RemoveOracle>;

    /**
     * @description Submits a price from an oracle. Only callable by active oracles.
     * @param price - The price to submit.
     * @returns {Promise<SubmitPrice>}
     */
    submitPrice(price: bigint): Promise<SubmitPrice>;

    /**
     * @description Aggregates prices from specified oracles and updates peg rate.
     * @param oracles - Array of oracle addresses to aggregate from.
     * @returns {Promise<AggregatePrice>}
     */
    aggregatePrice(oracles: Address[]): Promise<AggregatePrice>;

    /**
     * @description Mints tokens to the specified address. Only callable by admin.
     * @param to - The address to mint tokens to.
     * @param amount - The amount of tokens to mint.
     * @returns {Promise<MintOracle>}
     */
    mint(to: Address, amount: bigint): Promise<MintOracle>;

    /**
     * @description Gets the number of active oracles.
     * @returns {Promise<OracleCount>}
     */
    oracleCount(): Promise<OracleCount>;

    /**
     * @description Gets the minimum number of oracles required for aggregation.
     * @returns {Promise<MinOracles>}
     */
    minOracles(): Promise<MinOracles>;

    /**
     * @description Checks if an oracle is active.
     * @param oracle - The oracle address to check.
     * @returns {Promise<IsOracleActive>}
     */
    isOracleActive(oracle: Address): Promise<IsOracleActive>;

    /**
     * @description Gets the latest price submission from an oracle.
     * @param oracle - The oracle address.
     * @returns {Promise<OracleSubmission>}
     */
    oracleSubmission(oracle: Address): Promise<OracleSubmission>;

    /**
     * @description Gets the admin address.
     * @returns {Promise<AdminMultiOracleStable>}
     */
    admin(): Promise<AdminMultiOracleStable>;
}
