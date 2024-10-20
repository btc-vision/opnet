import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../contracts/CallResult.js';
import { IOP_20Contract } from './IOP_20Contract.js';

/**
 * @description This interface represents a motoswap pool contract.
 * @interface IMotoswapPoolContract
 * @extends {Omit<IOP_20Contract, 'burn' | 'mint'>}
 * @cathegory Contracts
 */
export interface IMotoswapPoolContract extends Omit<IOP_20Contract, 'burn' | 'mint'> {
    /**
     * @description This method returns the token0 address.
     * @returns {Promise<CallResult>}
     */
    token0(): Promise<CallResult>;

    /**
     * @description This method returns the token1 address.
     * @returns {Promise<CallResult>}
     */
    token1(): Promise<CallResult>;

    /**
     * @description This method returns the reserves.
     * @returns {Promise<CallResult>}
     */
    getReserves(): Promise<CallResult>;

    /**
     * @description This method swaps tokens.
     * @param {bigint} amount0Out
     * @param {bigint} amount1Out
     * @param {string} to
     * @param {Uint8Array} data
     * @returns {Promise<CallResult>}
     */
    swap(amount0Out: bigint, amount1Out: bigint, to: string, data: Uint8Array): Promise<CallResult>;

    /**
     * @description This method burns liquidity.
     * @param {Address} to
     * @returns {Promise<CallResult>}
     */
    burn(to: Address): Promise<CallResult>;

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
    price0CumulativeLast(): Promise<CallResult>;

    /**
     * @description This method returns the price1 cumulative last.
     * @returns {bigint}
     * @returns {Promise<CallResult>}
     */
    price1CumulativeLast(): Promise<CallResult>;
}
