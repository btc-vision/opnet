import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { TransferredEvent } from '../opnet/IOP20Contract.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

export type LiquidityAddedNativeEvent = {
    readonly totalTokensContributed: bigint;
    readonly virtualTokenExchanged: bigint;
    readonly totalSatoshisSpent: bigint;
};

export type LiquidityListedEvent = {
    readonly totalLiquidity: bigint;
    readonly provider: string;
};

export type LiquidityRemovedNativeEvent = {
    readonly providerId: bigint;
    readonly btcOwed: bigint;
    readonly tokenAmount: bigint;
};

export type ReservationCreatedEvent = {
    readonly expectedAmountOut: bigint;
    readonly totalSatoshis: bigint;
};

export type ReservationPurgedEvent = {
    readonly reservationId: bigint;
    readonly currentBlock: bigint;
    readonly purgingBlock: bigint;
    readonly purgeIndex: number;
    readonly providerCount: number;
};

export type ReservationPurgingEvent = {
    readonly reservationId: bigint;
    readonly purgeIndex: number;
    readonly purgeQueueLength: number;
};

export type SwapExecutedEvent = {
    readonly buyer: Address;
    readonly amountIn: bigint;
    readonly amountOut: bigint;
};

export type LiquidityReservedEvent = {
    readonly depositAddress: string;
    readonly amount: bigint;
    readonly providerId: bigint;
};

export type ListingCanceledEvent = {
    readonly amount: bigint;
    readonly penalty: bigint;
};

export type ActivateProviderEvent = {
    readonly providerId: bigint;
    readonly listingAmount: bigint;
    readonly btcToRemove: bigint;
};

export type FulfilledProviderEvent = {
    readonly providerId: bigint;
    readonly canceled: boolean;
    readonly removalCompleted: boolean;
};

/* ------------------------------------------------------------------
 * Call-result helpers
 * ------------------------------------------------------------------ */

export type ReserveNativeSwap = CallResult<
    {},
    OPNetEvent<
        LiquidityReservedEvent | ReservationCreatedEvent | TransferredEvent | FulfilledProviderEvent
    >[]
>;

export type AddLiquidity = CallResult<
    {},
    OPNetEvent<
        | LiquidityAddedNativeEvent
        | TransferredEvent
        | ActivateProviderEvent
        | FulfilledProviderEvent
    >[]
>;

export type RemoveLiquidity = CallResult<
    {},
    OPNetEvent<LiquidityRemovedNativeEvent | TransferredEvent | FulfilledProviderEvent>[]
>;

export type ListLiquidity = CallResult<{}, OPNetEvent<LiquidityListedEvent>[]>;

export type CancelListing = CallResult<
    {},
    OPNetEvent<ListingCanceledEvent | TransferredEvent | FulfilledProviderEvent>[]
>;

export type CreatePool = CallResult<{}, OPNetEvent<TransferredEvent | LiquidityAddedNativeEvent>[]>;

export type SetFees = CallResult;

export type GetFees = CallResult<{ reservationBaseFee: bigint; priorityQueueBaseFee: bigint }, []>;

export type Swap = CallResult<
    {},
    OPNetEvent<
        SwapExecutedEvent | TransferredEvent | ActivateProviderEvent | FulfilledProviderEvent
    >[]
>;

export type GetReserve = CallResult<
    {
        liquidity: bigint;
        reservedLiquidity: bigint;
        virtualBTCReserve: bigint;
        virtualTokenReserve: bigint;
    },
    []
>;

export type GetQuote = CallResult<
    {
        tokensOut: bigint;
        requiredSatoshis: bigint;
        price: bigint;
        scale: bigint;
    },
    []
>;

export type GetProviderDetails = CallResult<
    {
        id: bigint;
        liquidity: bigint;
        reserved: bigint;
        lpShares: bigint;
        btcReceiver: string;
        indexedAt: number;
        isPriority: boolean;
        purgeIndex: number;
        isActive: boolean;
        lastListedTokensAtBlock: bigint;
        isPurged: boolean;
    },
    []
>;

export type GetPriorityQueueCost = CallResult<{ cost: bigint }, []>;

export type AntiBotSettings = CallResult<
    {
        antiBotExpirationBlock: bigint;
        maxTokensPerReservation: bigint;
    },
    []
>;

export type StakingAddressResult = CallResult<{ stakingAddress: Address }, []>;

export type QueueDetails = CallResult<
    {
        lastPurgedBlock: number;
        blockWithReservationsLength: number;
        removalQueueLength: number;
        removalQueueStartingIndex: number;
        priorityQueueLength: number;
        priorityQueueStartingIndex: number;
        standardQueueLength: number;
        standardQueueStartingIndex: number;
        priorityPurgeQueueLength: number;
        standardPurgeQueueLength: number;
        removePurgeQueueLength: number;
    },
    []
>;

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

    /*createPoolWithSignature(
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
    ): Promise<CreatePool>;*/

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
     * @description Retrieves the queue details for a token.
     * @param token - The address of the token.
     * @returns {Promise<QueueDetails>}
     */
    getQueueDetails(token: Address): Promise<QueueDetails>;

    /**
     * @description Retrieves the cost for using the priority queue (new).
     * @param token - The address of the token.
     * @returns {Promise<GetPriorityQueueCost>}
     */
    getPriorityQueueCost(token: Address): Promise<GetPriorityQueueCost>;

    /**
     * @description Gets the anti-bot settings for a token.
     * @param token
     */
    getAntibotSettings(token: Address): Promise<AntiBotSettings>;

    /**
     * @description Set the address of the staking contract.
     */
    setStakingContractAddress(stakingContractAddress: Address): Promise<CallResult>;

    /**
     * @description Retrieves the address of the staking contract.
     * @returns {Promise<StakingAddressResult>}
     */
    getStakingContractAddress(): Promise<StakingAddressResult>;
}
