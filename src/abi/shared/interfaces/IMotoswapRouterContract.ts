import { Address } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_NETContract } from './IOP_NETContract.js';

/**
 * @description This interface represents the Motoswap router contract.
 * @interface IMotoswapRouterContract
 * @extends {IOP_NETContract}
 * @cathegory Contracts
 */
export interface IMotoswapRouterContract extends IOP_NETContract {
    /**
     * @description Add liquidity to the pool.
     * @returns {Promise<BaseContractProperty>} - Returns (amountA) u256, (amountB) u256, (liquidity) u256
     */
    addLiquidity(
        tokenA: Address,
        tokenB: Address,
        amountADesired: bigint,
        amountBDesired: bigint,
        amountAMin: bigint,
        amountBMin: bigint,
        to: Address,
        deadline: bigint,
    ): Promise<BaseContractProperty>;

    /**
     * @description Remove liquidity from the pool.
     * @returns {Promise<BaseContractProperty>} - Returns (amountA) u256, (amountB) u256
     */
    removeLiquidity(
        tokenA: Address,
        tokenB: Address,
        liquidity: bigint,
        amountAMin: bigint,
        amountBMin: bigint,
        to: Address,
        deadline: bigint,
    ): Promise<BaseContractProperty>;

    /**
     * @description Get a quote for the desired parameters.
     * @returns {Promise<BaseContractProperty>} - Return the quote for the desired parameters.
     */
    quote(amountA: bigint, reserveA: bigint, reserveB: bigint): Promise<BaseContractProperty>;

    /**
     * @description Get the amount out for the desired parameters.
     * @returns {Promise<BaseContractProperty>} - Return the amount out for the desired parameters.
     */
    getAmountOut(
        amountIn: bigint,
        reserveIn: bigint,
        reserveOut: bigint,
    ): Promise<BaseContractProperty>;

    /**
     * @description Get the amount in for the desired parameters.
     * @returns {Promise<BaseContractProperty>} - Return the amount in for the desired parameters.
     */
    getAmountIn(
        amountOut: bigint,
        reserveIn: bigint,
        reserveOut: bigint,
    ): Promise<BaseContractProperty>;

    /**
     * @description Get the amounts out for the desired parameters.
     * @returns {Promise<BaseContractProperty>} - Return the amounts out for the desired parameters.
     */
    getAmountsOut(amountIn: bigint, path: Address[]): Promise<BaseContractProperty>;

    /**
     * @description Get the amounts in for the desired parameters.
     * @returns {Promise<BaseContractProperty>} - Return the amounts in for the desired parameters.
     */
    getAmountsIn(amountOut: bigint, path: Address[]): Promise<BaseContractProperty>;

    /**
     * @description Swap exact tokens for tokens supporting fee on transfer tokens.
     * @returns {Promise<BaseContractProperty>} - Return the swap exact tokens for tokens supporting fee on transfer tokens.
     */
    swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn: bigint,
        amountOutMin: bigint,
        path: Address[],
        to: Address,
        deadline: bigint,
    ): Promise<BaseContractProperty>;

    /**
     * @description Get the factory address.
     */
    factory(): Promise<BaseContractProperty>;

    /**
     * @description Get the WBTC address.
     */
    WBTC(): Promise<BaseContractProperty>;
}
