import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP20Contract } from '../opnet/IOP20Contract.js';

export type Reserves = {
    readonly reserve0: bigint;
    readonly reserve1: bigint;
    readonly blockTimestampLast: bigint;
};

// Events
export type LiquidityRemovedEvent = {
    readonly sender: Address;
    readonly amount0: bigint;
    readonly amount1: bigint;
    readonly to: Address;
};

export type LiquidityAddedEvent = {
    readonly sender: Address;
    readonly amount0: bigint;
    readonly amount1: bigint;
};

export type SwappedEvent = {
    readonly sender: Address;
    readonly amount0In: bigint;
    readonly amount1In: bigint;
    readonly amount0Out: bigint;
    readonly amount1Out: bigint;
    readonly to: Address;
};

/**
 * @description This interface represents a motoswap pool contract.
 * @interface IMotoswapPoolContract
 * @extends {Omit<IOP20Contract, 'burn' | 'mint'>}
 * @cathegory Contracts
 */
export interface IMotoswapPoolContract extends Omit<IOP20Contract, 'burn' | 'mint'> {
    /**
     * @description This method returns the token0 address.
     * @returns {Promise<CallResult<{ token0: Address }>>}
     */
    token0(): Promise<CallResult<{ token0: Address }>>;

    /**
     * @description This method returns the token1 address.
     * @returns {Promise<CallResult<{ token1: Address }>>}
     */
    token1(): Promise<CallResult<{ token1: Address }>>;

    /**
     * @description This method returns the reserves.
     * @returns {Promise<CallResult<Reserves>>}
     */
    getReserves(): Promise<CallResult<Reserves>>;

    /**
     * @description This method swaps tokens.
     * @param {bigint} amount0Out
     * @param {bigint} amount1Out
     * @param {string} to
     * @param {Uint8Array} data
     * @returns {Promise<CallResult>}
     */
    swap(
        amount0Out: bigint,
        amount1Out: bigint,
        to: string,
        data: Uint8Array,
    ): Promise<CallResult<{}, [OPNetEvent<SwappedEvent>]>>;

    /**
     * Skim
     */
    skim(): Promise<CallResult>;

    /**
     * kLast
     */
    kLast(): Promise<CallResult<{ kLast: bigint }>>;

    /**
     * @description This method burns liquidity.
     * @param {Address} to
     * @returns {Promise<CallResult>}
     */
    burn(
        to: Address,
    ): Promise<
        CallResult<{ amount0: bigint; amount1: bigint }, [OPNetEvent<LiquidityRemovedEvent>]>
    >;

    /**
     * Get block timestamp last
     */
    blockTimestampLast(): Promise<CallResult<{ blockTimestampLast: bigint }>>;

    /**
     * @description This method syncs the pool.
     * @returns {Promise<CallResult>}
     */
    sync(): Promise<CallResult>;

    /**
     * @description This method returns the price0 cumulative last.
     * @returns {bigint}
     * @returns {Promise<CallResult>}
     */
    price0CumulativeLast(): Promise<CallResult<{ price0CumulativeLast: bigint }>>;

    /**
     * @description This method returns the price1 cumulative last.
     * @returns {bigint}
     * @returns {Promise<CallResult>}
     */
    price1CumulativeLast(): Promise<CallResult<{ price1CumulativeLast: bigint }>>;

    MINIMUM_LIQUIDITY(): Promise<CallResult<{ MINIMUM_LIQUIDITY: bigint }>>;

    mint(
        to: Address,
    ): Promise<CallResult<{ liquidity: bigint }, [OPNetEvent<LiquidityAddedEvent>]>>;

    initialize(token0: Address, token1: Address): Promise<CallResult>;
}
