import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { TransferredEvent } from '../opnet/IOP20Contract.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

export type LiquidityListedEvent = {
    readonly totalLiquidity: bigint;
    readonly provider: string;
};

export type LiquidityReservedEvent = {
    readonly depositAddress: string;
    readonly satoshisAmount: bigint;
    readonly providerId: bigint;
    readonly tokenAmount: bigint;
};

export type ListingCanceledEvent = {
    readonly amount: bigint;
    readonly penalty: bigint;
};

export type ProviderActivatedEvent = {
    readonly providerId: bigint;
    readonly listingAmount: bigint;
    readonly btcToRemove: bigint;
};

export type ProviderConsumedEvent = {
    readonly providerId: bigint;
    readonly amountUsed: bigint;
};

export type ProviderFulfilledEvent = {
    readonly providerId: bigint;
    readonly removalCompleted: boolean;
    readonly stakedAmount: bigint;
};

export type ReservationFallbackEvent = {
    readonly reservationId: bigint;
    readonly expirationBlock: bigint;
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
    readonly purgedAmount: bigint;
};

export type SwapExecutedEvent = {
    readonly buyer: Address;
    readonly amountIn: bigint;
    readonly amountOut: bigint;
    readonly totalFees: bigint;
};

export type WithdrawListingEvent = {
    readonly amount: bigint;
    readonly tokenAddress: Address;
    readonly providerId: bigint;
    readonly sender: Address;
};

/* ------------------------------------------------------------------
 * Call-result helpers
 * ------------------------------------------------------------------ */

export type ReserveNativeSwap = CallResult<
    {},
    OPNetEvent<
        | LiquidityReservedEvent
        | ReservationCreatedEvent
        | TransferredEvent
        | ProviderFulfilledEvent
        | ReservationPurgedEvent
    >[]
>;

export type ListLiquidity = CallResult<{}, OPNetEvent<LiquidityListedEvent | TransferredEvent>[]>;

export type CancelListing = CallResult<
    {},
    OPNetEvent<ListingCanceledEvent | TransferredEvent | ReservationPurgedEvent>[]
>;

export type WithdrawListing = CallResult<{}, OPNetEvent<WithdrawListingEvent | TransferredEvent>[]>;

export type CreatePool = CallResult<{}, OPNetEvent<TransferredEvent | ReservationPurgedEvent>[]>;

export type SetFees = CallResult;

export type SetStakingContractAddress = CallResult;

export type SetFeesAddress = CallResult;

export type Pause = CallResult;

export type Unpause = CallResult;

export type ActivateWithdrawMode = CallResult;

export type IsPaused = CallResult<{ paused: boolean }, []>;

export type IsWithdrawModeActive = CallResult<{ active: boolean }, []>;

export type GetFees = CallResult<{ reservationBaseFee: bigint; priorityQueueBaseFee: bigint }, []>;

export type Swap = CallResult<
    {},
    OPNetEvent<
        | SwapExecutedEvent
        | TransferredEvent
        | ProviderActivatedEvent
        | ProviderFulfilledEvent
        | ProviderConsumedEvent
        | ReservationFallbackEvent
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
        btcReceiver: string;
        indexedAt: number;
        isPriority: boolean;
        purgeIndex: number;
        isActive: boolean;
        lastListedTokensAtBlock: bigint;
        isPurged: boolean;
        isLiquidityProvisionAllowed: boolean;
        toReset: boolean;
    },
    []
>;

export type GetProviderDetailsById = CallResult<
    {
        id: bigint;
        liquidity: bigint;
        reserved: bigint;
        btcReceiver: string;
        indexedAt: number;
        isPriority: boolean;
        purgeIndex: number;
        isActive: boolean;
        lastListedTokensAtBlock: bigint;
        isPurged: boolean;
        isLiquidityProvisionAllowed: boolean;
        toReset: boolean;
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

export type FeesAddressResult = CallResult<{ feesAddress: string }, []>;

export type QueueDetails = CallResult<
    {
        lastPurgedBlock: bigint;
        blockWithReservationsLength: number;
        priorityQueueLength: number;
        priorityQueueStartingIndex: number;
        standardQueueLength: number;
        standardQueueStartingIndex: number;
        priorityPurgeQueueLength: number;
        standardPurgeQueueLength: number;
    },
    []
>;

export type GetPoolInfoNativeSwap = CallResult<
    {
        poolType: number;
        amplification: bigint;
        pegStalenessThreshold: bigint;
    },
    []
>;

export type OnOP20ReceivedResult = CallResult<{ selector: Uint8Array }, []>;

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
     * @description Reserves a certain amount of tokens.
     * @param token - The address of the token to reserve.
     * @param maximumAmountIn - The maximum amount of satoshis to spend.
     * @param minimumAmountOut - The minimum amount of tokens expected out.
     * @param activationDelay - Number of blocks before activation.
     * @param sender - The address of the sender (bytes).
     * @returns {Promise<ReserveNativeSwap>}
     */
    reserve(
        token: Address,
        maximumAmountIn: bigint,
        minimumAmountOut: bigint,
        activationDelay: number,
        sender: Uint8Array,
    ): Promise<ReserveNativeSwap>;

    /**
     * @description Lists liquidity for sale.
     * @param token - The address of the token to list.
     * @param receiver - The 33 bytes public key for receiving payments (bytes).
     * @param receiverStr - The Bitcoin address as a string.
     * @param amountIn - The amount of tokens to list for sale.
     * @param priority - Whether to place this listing in the priority queue.
     * @returns {Promise<ListLiquidity>}
     */
    listLiquidity(
        token: Address,
        receiver: Uint8Array,
        receiverStr: string,
        amountIn: bigint,
        priority: boolean,
    ): Promise<ListLiquidity>;

    /**
     * @description Cancels a previously listed liquidity position.
     * @param token - The address of the token to remove from the listing.
     * @returns {Promise<CancelListing>}
     */
    cancelListing(token: Address): Promise<CancelListing>;

    /**
     * @description Withdraws listing when in withdraw mode.
     * @param token - The address of the token to withdraw.
     * @returns {Promise<WithdrawListing>}
     */
    withdrawListing(token: Address): Promise<WithdrawListing>;

    /**
     * @description Creates a new liquidity pool.
     * @param token - The token address.
     * @param floorPrice - The floor price to set.
     * @param initialLiquidity - The amount of liquidity to seed.
     * @param receiver - The 33 bytes public key for receiving payments (bytes).
     * @param receiverStr - The Bitcoin address as a string.
     * @param antiBotEnabledFor - Number of blocks for anti-bot protection.
     * @param antiBotMaximumTokensPerReservation - Anti-bot max tokens per user.
     * @param maxReservesIn5BlocksPercent - Cap on reserves in a short window.
     * @param poolType - Pool type (0 = standard, 1 = stable).
     * @param amplification - StableSwap A parameter (1-10000).
     * @param pegStalenessThreshold - Max blocks since peg update (0 = no check).
     * @returns {Promise<CreatePool>}
     */
    createPool(
        token: Address,
        floorPrice: bigint,
        initialLiquidity: bigint,
        receiver: Uint8Array,
        receiverStr: string,
        antiBotEnabledFor: number,
        antiBotMaximumTokensPerReservation: bigint,
        maxReservesIn5BlocksPercent: number,
        poolType: number,
        amplification: bigint,
        pegStalenessThreshold: bigint,
    ): Promise<CreatePool>;

    /**
     * @description Sets the global fee parameters.
     * @param reservationBaseFee - Base fee for a reservation.
     * @param priorityQueueBaseFee - Base fee for priority queue usage.
     * @returns {Promise<SetFees>}
     */
    setFees(reservationBaseFee: bigint, priorityQueueBaseFee: bigint): Promise<SetFees>;

    /**
     * @description Sets the staking contract address.
     * @param stakingContractAddress - The new staking contract address.
     * @returns {Promise<SetStakingContractAddress>}
     */
    setStakingContractAddress(stakingContractAddress: Address): Promise<SetStakingContractAddress>;

    /**
     * @description Sets the fees collection address.
     * @param feesAddress - The Bitcoin address for fees collection.
     * @returns {Promise<SetFeesAddress>}
     */
    setFeesAddress(feesAddress: string): Promise<SetFeesAddress>;

    /**
     * @description Pauses the contract.
     * @returns {Promise<Pause>}
     */
    pause(): Promise<Pause>;

    /**
     * @description Unpauses the contract.
     * @returns {Promise<Unpause>}
     */
    unpause(): Promise<Unpause>;

    /**
     * @description Activates withdraw mode.
     * @returns {Promise<ActivateWithdrawMode>}
     */
    activateWithdrawMode(): Promise<ActivateWithdrawMode>;

    /**
     * @description Checks if the contract is paused.
     * @returns {Promise<IsPaused>}
     */
    isPaused(): Promise<IsPaused>;

    /**
     * @description Checks if withdraw mode is active.
     * @returns {Promise<IsWithdrawModeActive>}
     */
    isWithdrawModeActive(): Promise<IsWithdrawModeActive>;

    /**
     * @description Retrieves the current fee parameters.
     * @returns {Promise<GetFees>}
     */
    getFees(): Promise<GetFees>;

    /**
     * @description Executes a swap operation.
     * @param token - The address of the token to swap.
     * @returns {Promise<Swap>}
     */
    swap(token: Address): Promise<Swap>;

    /**
     * @description Retrieves the reserve information for a token.
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
     * @description Retrieves provider details by provider ID.
     * @param providerId - The provider ID.
     * @returns {Promise<GetProviderDetailsById>}
     */
    getProviderDetailsById(providerId: bigint): Promise<GetProviderDetailsById>;

    /**
     * @description Retrieves the queue details for a token.
     * @param token - The address of the token.
     * @returns {Promise<QueueDetails>}
     */
    getQueueDetails(token: Address): Promise<QueueDetails>;

    /**
     * @description Retrieves the cost for using the priority queue.
     * @returns {Promise<GetPriorityQueueCost>}
     */
    getPriorityQueueCost(): Promise<GetPriorityQueueCost>;

    /**
     * @description Gets the anti-bot settings for a token.
     * @param token - The address of the token.
     * @returns {Promise<AntiBotSettings>}
     */
    getAntibotSettings(token: Address): Promise<AntiBotSettings>;

    /**
     * @description Retrieves the address of the staking contract.
     * @returns {Promise<StakingAddressResult>}
     */
    getStakingContractAddress(): Promise<StakingAddressResult>;

    /**
     * @description Retrieves the fees collection address.
     * @returns {Promise<FeesAddressResult>}
     */
    getFeesAddress(): Promise<FeesAddressResult>;

    /**
     * @description Gets pool info including stable pool settings.
     * @param token - The address of the token.
     * @returns {Promise<GetPoolInfo>}
     */
    getPoolInfo(token: Address): Promise<GetPoolInfoNativeSwap>;

    update(address: Address, calldata: Uint8Array): Promise<CallResult>;
}
