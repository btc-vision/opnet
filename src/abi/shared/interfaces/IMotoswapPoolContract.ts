import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_20Contract } from './IOP_20Contract.js';

/**
 * @description This interface represents a motoswap pool contract.
 * @interface IMotoswapPoolContract
 * @extends {Omit<IOP_20Contract, 'burn' | 'mint'>}
 */
export interface IMotoswapPoolContract extends Omit<IOP_20Contract, 'burn' | 'mint'> {
    /**
     * @description This method returns the token0 address.
     * @returns {Promise<BaseContractProperty>}
     */
    token0(): Promise<BaseContractProperty>;

    /**
     * @description This method returns the token1 address.
     * @returns {Promise<BaseContractProperty>}
     */
    token1(): Promise<BaseContractProperty>;

    /**
     * @description This method returns the reserves.
     * @returns {Promise<BaseContractProperty>}
     */
    getReserves(): Promise<BaseContractProperty>;

    /**
     * @description This method swaps tokens.
     * @param {bigint} amount0Out
     * @param {bigint} amount1Out
     * @param {string} to
     * @param {Uint8Array} data
     * @returns {Promise<BaseContractProperty>}
     */
    swap(
        amount0Out: bigint,
        amount1Out: bigint,
        to: string,
        data: Uint8Array,
    ): Promise<BaseContractProperty>;

    /**
     * @description This method burns liquidity.
     * @param {bigint} amount0
     * @param {bigint} amount1
     * @returns {Promise<BaseContractProperty>}
     */
    burn(amount0: bigint, amount1: bigint): Promise<BaseContractProperty>;

    /**
     * @description This method syncs the pool.
     * @returns {Promise<BaseContractProperty>}
     */
    sync(): Promise<BaseContractProperty>;

    /**
     * @description This method returns the price0 cumulative last.
     * @returns {bigint}
     * @returns {Promise<BaseContractProperty>}
     */
    price0CumulativeLast(): Promise<BaseContractProperty>;

    /**
     * @description This method returns the price1 cumulative last.
     * @returns {bigint}
     * @returns {Promise<BaseContractProperty>}
     */
    price1CumulativeLast(): Promise<BaseContractProperty>;
}
