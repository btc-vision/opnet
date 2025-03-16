import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { TransferEvent } from '../opnet/IOP_20Contract.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

/** ------------------------------------------------------------------
 * Event Definitions
 * ------------------------------------------------------------------ */

type LiquidityAddedEvent = {
    readonly totalTokensContributed: bigint;
    readonly virtualTokenExchanged: bigint;
    readonly totalSatoshisSpent: bigint;
};

type LiquidityListedEvent = {
    readonly totalLiquidity: bigint;
    readonly provider: string;
};

type LiquidityRemovedEvent = {
    readonly providerId: bigint;
    readonly btcOwed: bigint;
    readonly tokenAmount: bigint;
};

type ReservationCreatedEvent = {
    readonly expectedAmountOut: bigint;
    readonly totalSatoshis: bigint;
};

type SwapExecutedEvent = {
    readonly buyer: Address;
    readonly amountIn: bigint;
    readonly amountOut: bigint;
};

type UnlistEvent = {
    readonly token: Address;
    readonly amount: bigint;
    readonly remainingLiquidity: bigint;
};

type LiquidityReservedEvent = {
    readonly depositAddress: string;
    readonly amount: bigint;
};

/** ------------------------------------------------------------------
 * Call Results
 * ------------------------------------------------------------------ */

/**
 * @description Represents the result of the reserve function call.
 */
type ReserveNativeSwap = CallResult<
    {
        ok: boolean;
    },
    OPNetEvent<LiquidityReservedEvent | ReservationCreatedEvent | TransferEvent>[]
>;

/**
 * @description Represents the result of adding liquidity.
 */
type AddLiquidity = CallResult<
    {
        ok: boolean;
    },
    OPNetEvent<LiquidityAddedEvent | TransferEvent>[]
>;

/**
 * @description Represents the result of removing liquidity.
 */
type RemoveLiquidity = CallResult<
    {
        ok: boolean;
    },
    OPNetEvent<LiquidityRemovedEvent | TransferEvent>[]
>;

/**
 * @description Represents the result of listing liquidity (new).
 */
type ListLiquidity = CallResult<
    {
        ok: boolean;
    },
    OPNetEvent<LiquidityListedEvent>[]
>;

/**
 * @description Represents the result of canceling a listing (new).
 */
type CancelListing = CallResult<
    {
        ok: boolean;
    },
    OPNetEvent<UnlistEvent | TransferEvent>[]
>;

/**
 * @description Represents the result of creating a new pool (new).
 */
type CreatePool = CallResult<
    {
        ok: boolean;
    },
    OPNetEvent<TransferEvent | LiquidityAddedEvent>[]
>;

/**
 * @description Represents the result of setting fees (new).
 */
type SetFees = CallResult<
    {
        ok: boolean;
    },
    []
>;

/**
 * @description Represents the result of retrieving the fees (new).
 */
type GetFees = CallResult<
    {
        reservationBaseFee: bigint;
        priorityQueueBaseFee: bigint;
    },
    []
>;

/**
 * @description Represents the result of a swap operation.
 */
type Swap = CallResult<
    {
        ok: boolean;
    },
    OPNetEvent<SwapExecutedEvent | TransferEvent>[]
>;

/**
 * @description Represents the result of the getReserve function call.
 * Now includes virtualBTCReserve and virtualTokenReserve.
 */
type GetReserve = CallResult<
    {
        liquidity: bigint;
        reservedLiquidity: bigint;
        virtualBTCReserve: bigint;
        virtualTokenReserve: bigint;
    },
    []
>;

/**
 * @description Represents the result of the getQuote function call.
 */
type GetQuote = CallResult<
    {
        tokensOut: bigint;
        requiredSatoshis: bigint;
        price: bigint;
        scale: bigint;
    },
    []
>;

/**
 * @description Represents the result of retrieving provider details.
 */
type GetProviderDetails = CallResult<
    {
        liquidity: bigint;
        reserved: bigint;
        btcReceiver: string;
    },
    []
>;

/**
 * @description Represents the result of retrieving the priority queue cost.
 */
type GetPriorityQueueCost = CallResult<
    {
        cost: bigint;
    },
    []
>;

/** ------------------------------------------------------------------
 * NativeSwap Interface
 * ------------------------------------------------------------------ */

/**
 * @description This interface represents the NativeSwap contract,
 * including all new/updated methods and type definitions.
 *
 * @interface INativeSwapContract
 * @extends {IOP_NETContract}
 * @category Contracts
 */
export interface INativeSwapContract extends IOP_NETContract {
    /**
     * @description Reserves a certain amount of tokens, possibly for LP.
     * @param token - The address of the token to reserve.
     * @param maximumAmountIn - The maximum amount of tokens to reserve.
     * @param minimumAmountOut - The minimum amount of tokens expected out.
     * @param forLP - Whether this reservation is for LP or not.
     * @param activationDelay - Number of blocks before activation (if used).
     * @returns {Promise<ReserveNativeSwap>}
     */
    reserve(
        token: Address,
        maximumAmountIn: bigint,
        minimumAmountOut: bigint,
        forLP: boolean,
        activationDelay: number,
    ): Promise<ReserveNativeSwap>;

    /**
     * @description Lists liquidity for sale (new).
     * @param token - The address of the token to list.
     * @param receiver - The Bitcoin address for receiving payments.
     * @param amountIn - The amount of tokens to list for sale.
     * @param priority - Whether to place this listing in the priority queue.
     * @returns {Promise<ListLiquidity>}
     */
    listLiquidity(
        token: Address,
        receiver: string,
        amountIn: bigint,
        priority: boolean,
    ): Promise<ListLiquidity>;

    /**
     * @description Cancels a previously listed liquidity position (new).
     * @param token - The address of the token to remove from the listing.
     * @returns {Promise<CancelListing>}
     */
    cancelListing(token: Address): Promise<CancelListing>;

    /**
     * @description Creates a new liquidity pool (new).
     * @param token - The token address.
     * @param floorPrice - The floor price to set.
     * @param initialLiquidity - The amount of liquidity to seed.
     * @param receiver - The Bitcoin address for receiving payments.
     * @param antiBotEnabledFor - Number of blocks for anti-bot protection.
     * @param antiBotMaximumTokensPerReservation - Anti-bot max tokens per user.
     * @param maxReservesIn5BlocksPercent - Cap on reserves in a short window.
     * @returns {Promise<CreatePool>}
     */
    createPool(
        token: Address,
        floorPrice: bigint,
        initialLiquidity: bigint,
        receiver: string,
        antiBotEnabledFor: number,
        antiBotMaximumTokensPerReservation: bigint,
        maxReservesIn5BlocksPercent: number,
    ): Promise<CreatePool>;

    /**
     * @description Creates a new liquidity pool with an approval signature (new).
     * @param signature - Buffer for the signature.
     * @param approveAmount - Amount to approve.
     * @param nonce - Approval nonce.
     * @param token - The token address.
     * @param floorPrice - The floor price to set.
     * @param initialLiquidity - The amount of liquidity to seed.
     * @param receiver - The Bitcoin address for receiving payments.
     * @param antiBotEnabledFor - Number of blocks for anti-bot protection.
     * @param antiBotMaximumTokensPerReservation - Anti-bot max tokens per user.
     * @param maxReservesIn5BlocksPercent - Cap on reserves in a short window.
     * @returns {Promise<CreatePool>}
     */
    createPoolWithSignature(
        signature: Buffer,
        approveAmount: bigint,
        nonce: bigint,
        token: Address,
        floorPrice: bigint,
        initialLiquidity: bigint,
        receiver: string,
        antiBotEnabledFor: number,
        antiBotMaximumTokensPerReservation: bigint,
        maxReservesIn5BlocksPercent: number,
    ): Promise<CreatePool>;

    /**
     * @description Sets the global fee parameters (new).
     * @param reservationBaseFee - Base fee for a reservation.
     * @param priorityQueueBaseFee - Base fee for priority queue usage.
     * @returns {Promise<SetFees>}
     */
    setFees(reservationBaseFee: bigint, priorityQueueBaseFee: bigint): Promise<SetFees>;

    /**
     * @description Retrieves the current fee parameters (new).
     * @returns {Promise<GetFees>}
     */
    getFees(): Promise<GetFees>;

    /**
     * @description Adds liquidity to the contract.
     * @param token - The address of the token to add liquidity for.
     * @param receiver - The receiver of the liquidity (Bitcoin address).
     * @returns {Promise<AddLiquidity>}
     */
    addLiquidity(token: Address, receiver: string): Promise<AddLiquidity>;

    /**
     * @description Removes all liquidity from the contract for the given token.
     * @param token - The address of the token to remove liquidity for.
     * @returns {Promise<RemoveLiquidity>}
     */
    removeLiquidity(token: Address): Promise<RemoveLiquidity>;

    /**
     * @description Executes a swap operation.
     * @param token - The address of the token to swap.
     * @returns {Promise<Swap>}
     */
    swap(token: Address): Promise<Swap>;

    /**
     * @description Retrieves the reserve information for a token.
     * Now includes virtual pool reserves.
     * @param token - The address of the token.
     * @returns {Promise<GetReserve>}
     */
    getReserve(token: Address): Promise<GetReserve>;

    /**
     * @description Retrieves a quote for swapping tokens.
     * @param token - The address of the token.
     * @param satoshisIn - The amount of satoshis being sent.
     * @returns {Promise<GetQuote>}
     */
    getQuote(token: Address, satoshisIn: bigint): Promise<GetQuote>;

    /**
     * @description Retrieves the provider details for a token.
     * @param token - The address of the token.
     * @returns {Promise<GetProviderDetails>}
     */
    getProviderDetails(token: Address): Promise<GetProviderDetails>;

    /**
     * @description Retrieves the cost for using the priority queue (new).
     * @param token - The address of the token.
     * @returns {Promise<GetPriorityQueueCost>}
     */
    getPriorityQueueCost(token: Address): Promise<GetPriorityQueueCost>;
}
