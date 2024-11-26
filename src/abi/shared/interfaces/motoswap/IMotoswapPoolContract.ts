import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { IOP_20Contract } from '../opnet/IOP_20Contract.js';

export type Reserves = {
    readonly reserve0: bigint;
    readonly reserve1: bigint;
    readonly blockTimestampLast: bigint;
};

/**
 * @description This interface represents a motoswap pool contract.
 * @interface IMotoswapPoolContract
 * @extends {Omit<IOP_20Contract, 'burn' | 'mint'>}
 * @cathegory Contracts
 */
export interface IMotoswapPoolContract extends Omit<IOP_20Contract, 'burn' | 'mint'> {
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
    ): Promise<
        CallResult<{
            success: boolean;
        }>
    >;

    /**
     * Skim
     */
    skim(): Promise<CallResult<{ success: boolean }>>;

    /**
     * kLast
     */
    kLast(): Promise<CallResult<{ kLast: bigint }>>;

    /**
     * @description This method burns liquidity.
     * @param {Address} to
     * @returns {Promise<CallResult>}
     */
    burn(to: Address): Promise<CallResult>;

    /**
     * Get block timestamp last
     */
    blockTimestampLast(): Promise<CallResult<{ blockTimestampLast: bigint }>>;

    /**
     * @description This method syncs the pool.
     * @returns {Promise<CallResult>}
     */
    sync(): Promise<CallResult<{ success: boolean }>>;

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
}