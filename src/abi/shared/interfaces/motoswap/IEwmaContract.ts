import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

/**
 * @description Represents the result of the `reserve` function call.
 */
export type ReserveEWMA = CallResult<{
    reserved: bigint;
}>;

/**
 * @description Represents the result of the `addLiquidity` function call.
 */
export type AddLiquidity = CallResult<{
    ok: boolean;
}>;

/**
 * @description Represents the result of the `removeLiquidity` function call.
 */
export type RemoveLiquidity = CallResult<{
    totalTokensReturned: bigint;
}>;

/**
 * @description Represents the result of the `swap` function call.
 */
export type Swap = CallResult<{
    ok: boolean;
}>;

/**
 * @description Represents the result of the `getReserve` function call.
 */
export type GetReserve = CallResult<{
    liquidity: bigint;
    reservedLiquidity: bigint;
}>;

/**
 * @description Represents the result of the `getQuote` function call.
 */
export type GetQuote = CallResult<{
    tokensOut: bigint;
    requiredSatoshis: bigint;
    currentPrice: bigint;
}>;

/**
 * @description Represents the result of the `setQuote` function call.
 */
export type SetQuote = CallResult<{
    ok: boolean;
}>;

/**
 * @description This interface represents the OP_NET contract.
 * @interface IOP_NETContract
 * @extends {IOP_NETContract}
 * @category Contracts
 *
 * @example
 * import { Address } from '@btc-vision/transaction';
 * import { IOP_NETContract } from '../abi/shared/interfaces/IOP_NETContract.js';
 * import { OP_NET_ABI } from '../abi/shared/json/OP_NET_ABI.js';
 * import { CallResult } from '../contracts/CallResult.js';
 * import { getContract } from '../contracts/Contract.js';
 * import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
 *
 * const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org');
 * const contract: IOP_NETContract = getContract<IOP_NETContract>(
 *     'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
 *     OP_NET_ABI,
 *     provider,
 *     networks.regtest,
 * );
 *
 * const tokenAddress: Address = new Address([
 *    40, 11, 228, 172, 219, 50, 169, 155, 163, 235, 250, 102, 169, 29, 219, 65, 167, 183, 161, 210,
 *    254, 244, 21, 57, 153, 34, 205, 138, 4, 72, 92, 2,
 * ]);
 *
 * const reserveExample = await contract.reserve(
 *     tokenAddress,
 *     BigInt("1000000000000000000"), // maximumAmountIn
 *     BigInt("500000000000000000")   // minimumAmountOut
 * );
 *
 * console.log('Reserved:', reserveExample.properties.reserved);
 */
export interface IEwmaContract extends IOP_NETContract {
    /**
     * @description Reserves a certain amount of tokens.
     * @param token - The address of the token to reserve.
     * @param maximumAmountIn - The maximum amount of tokens to reserve.
     * @param minimumAmountOut - The minimum amount of tokens expected out.
     * @returns {Promise<ReserveEWMA>}
     */
    reserve(
        token: Address,
        maximumAmountIn: bigint,
        minimumAmountOut: bigint,
    ): Promise<ReserveEWMA>;

    /**
     * @description Adds liquidity to the contract.
     * @param token - The address of the token to add liquidity for.
     * @param receiver - The receiver of the liquidity.
     * @param amountIn - The amount of tokens to add.
     * @returns {Promise<AddLiquidity>}
     */
    addLiquidity(token: Address, receiver: string, amountIn: bigint): Promise<AddLiquidity>;

    /**
     * @description Removes liquidity from the contract.
     * @param token - The address of the token to remove liquidity for.
     * @returns {Promise<RemoveLiquidity>}
     */
    removeLiquidity(token: Address): Promise<RemoveLiquidity>;

    /**
     * @description Executes a swap operation.
     * @param token - The address of the token to swap.
     * @param reservationId - The reservation ID for the swap.
     * @param isSimulation - Whether the swap is a simulation.
     * @returns {Promise<Swap>}
     */
    swap(token: Address, reservationId: bigint, isSimulation: boolean): Promise<Swap>;

    /**
     * @description Retrieves the reserve information for a token.
     * @param token - The address of the token.
     * @returns {Promise<GetReserve>}
     */
    getReserve(token: Address): Promise<GetReserve>;

    /**
     * @description Retrieves a quote for swapping tokens.
     * @param token - The address of the token.
     * @param satoshisIn - The amount of satoshis to swap.
     * @returns {Promise<GetQuote>}
     */
    getQuote(token: Address, satoshisIn: bigint): Promise<GetQuote>;

    /**
     * @description Sets a new quote for a token.
     * @param token - The address of the token.
     * @param p0 - The new quote parameter.
     * @returns {Promise<SetQuote>}
     */
    setQuote(token: Address, p0: bigint): Promise<SetQuote>;
}
