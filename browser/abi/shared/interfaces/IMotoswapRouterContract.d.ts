import { Address } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_NETContract } from './IOP_NETContract.js';
export interface IMotoswapRouterContract extends IOP_NETContract {
    addLiquidity(tokenA: Address, tokenB: Address, amountADesired: bigint, amountBDesired: bigint, amountAMin: bigint, amountBMin: bigint, to: Address, deadline: bigint): BaseContractProperty;
    removeLiquidity(tokenA: Address, tokenB: Address, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: Address, deadline: bigint): BaseContractProperty;
    quote(amountA: bigint, reserveA: bigint, reserveB: bigint): BaseContractProperty;
    getAmountOut(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): BaseContractProperty;
    getAmountIn(amountOut: bigint, reserveIn: bigint, reserveOut: bigint): BaseContractProperty;
    getAmountsOut(amountIn: bigint, path: Address[]): BaseContractProperty;
    getAmountsIn(amountOut: bigint, path: Address[]): BaseContractProperty;
    swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn: bigint, amountOutMin: bigint, path: Address[], to: Address, deadline: bigint): BaseContractProperty;
    factory(): BaseContractProperty;
    WBTC(): BaseContractProperty;
}
