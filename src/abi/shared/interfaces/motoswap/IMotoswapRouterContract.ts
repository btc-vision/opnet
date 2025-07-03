import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

/**
 * @description This interface represents the Motoswap router contract.
 * @interface IMotoswapRouterContract
 * @extends {IOP_NETContract}
 * @cathegory Contracts
 */
export interface IMotoswapRouterContract extends IOP_NETContract {
    /**
     * @description Add liquidity to the pool.
     * @returns {Promise<CallResult>} - Returns (amountA) u256, (amountB) u256, (liquidity) u256
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
    ): Promise<CallResult<{ amountA: bigint; amountB: bigint; liquidity: bigint }>>;

    /**
     * @description Remove liquidity from the pool.
     * @returns {Promise<CallResult>} - Returns (amountA) u256, (amountB) u256
     */
    removeLiquidity(
        tokenA: Address,
        tokenB: Address,
        liquidity: bigint,
        amountAMin: bigint,
        amountBMin: bigint,
        to: Address,
        deadline: bigint,
    ): Promise<CallResult<{ amountA: bigint; amountB: bigint }>>;

    /**
     * @description Get a quote for the desired parameters.
     * @returns {Promise<CallResult>} - Return the quote for the desired parameters.
     */
    quote(
        amountA: bigint,
        reserveA: bigint,
        reserveB: bigint,
    ): Promise<CallResult<{ quote: bigint }>>;

    /**
     * @description Get the amount out for the desired parameters.
     * @returns {Promise<CallResult>} - Return the amount out for the desired parameters.
     */
    getAmountOut(
        amountIn: bigint,
        reserveIn: bigint,
        reserveOut: bigint,
    ): Promise<CallResult<{ amountOut: bigint }>>;

    /**
     * @description Get the amount in for the desired parameters.
     * @returns {Promise<CallResult>} - Return the amount in for the desired parameters.
     */
    getAmountIn(
        amountOut: bigint,
        reserveIn: bigint,
        reserveOut: bigint,
    ): Promise<CallResult<{ amountIn: bigint }>>;

    /**
     * @description Get the amounts out for the desired parameters.
     * @returns {Promise<CallResult>} - Return the amounts out for the desired parameters.
     */
    getAmountsOut(amountIn: bigint, path: Address[]): Promise<CallResult<{ amountsOut: bigint[] }>>;

    /**
     * @description Get the amounts in for the desired parameters.
     * @returns {Promise<CallResult>} - Return the amounts in for the desired parameters.
     */
    getAmountsIn(amountOut: bigint, path: Address[]): Promise<CallResult<{ amountsIn: bigint[] }>>;

    /**
     * @description Swap exact tokens for tokens supporting fee on transfer tokens.
     * @returns {Promise<CallResult>} - Return the swap exact tokens for tokens supporting fee on transfer tokens.
     */
    swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn: bigint,
        amountOutMin: bigint,
        path: Address[],
        to: Address,
        deadline: bigint,
    ): Promise<CallResult>;

    /**
     * @description Get the factory address.
     */
    factory(): Promise<CallResult<{ factory: Address }>>;
}
