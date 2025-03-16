import { Address } from '@btc-vision/transaction';
import { CallResult, IOP_NETContract } from '../../../../opnet.js';

type Status = CallResult<{ status: bigint }>;

/**
 * @description This interface represents the ReentrancyGuard contract.
 * @interface IMotoswapReentrancyGuard
 * @extends {IOP_NETContract}
 * @category Contracts
 *
 */
interface IMotoswapReentrancyGuard extends IOP_NETContract {
    /**
     * @description Gets the current admin address.
     * @returns {Status}
     */
    status(): Promise<Status>;
}

type Admin = CallResult<{
    adminAddress: Address;
}>;

type ChangeAdmin = CallResult<{
    success: boolean;
}>;

/**
 * @description This interface represents the OwnableReentrancyGuard contract.
 * @interface IMotoswapOwnableReentrancyGuard
 * @extends {IOP_NETContract}
 * @category Contracts
 *
 */
interface IMotoswapOwnableReentrancyGuard extends IMotoswapReentrancyGuard {
    /**
     * @description Gets the current admin address.
     * @returns {Admin}
     */
    admin(): Promise<Admin>;

    /**
     * @description Changes the contract admin. Only callable by the current admin.
     * @param {Address} newAdmin The new admin address.
     * @returns {ChangeAdmin}
     */
    changeAdmin(newAdmin: Address): Promise<ChangeAdmin>;
}

type GetMotoAddress = CallResult<{
    motoAddress: Address;
}>;

type BalanceOf = CallResult<{
    balance: bigint;
}>;

type TotalSupply = CallResult<{
    totalSupply: bigint;
}>;

type MotoAddress = CallResult<{
    totalSupply: bigint;
}>;

type LastInteractedBlock = CallResult<{
    lastInteractedBlock: bigint;
}>;

type RewardDebt = CallResult<{
    rewardDebt: bigint;
}>;

type RewardBalances = CallResult<{
    rewardBalance: bigint;
}>;

type CalculateSlashingFee = CallResult<{
    slashingFee: bigint;
}>;

type EnabledRewardTokens = CallResult<{
    enabledRewardTokens: Address[];
}>;

type Stake = CallResult<{
    success: boolean;
}>;

type Unstake = CallResult<{
    success: boolean;
}>;

type ClaimRewards = CallResult<{
    success: boolean;
}>;

type AdminAddRewardToken = CallResult<{
    success: boolean;
}>;

type AdminRemoveRewardToken = CallResult<{
    success: boolean;
}>;

type AdminChangeMotoAddress = CallResult<{
    success: boolean;
}>;

type AdminChangeLockupParameters = CallResult<{
    success: boolean;
}>;

type AdminEnableEmergencyWithdrawals = CallResult<{
    success: boolean;
}>;

// EVENTS
type RewardTokenAddedEvent = {
    readonly token: Address;
};

type RewardTokenRemovedEvent = {
    readonly token: Address;
};

/**
 * @description This interface represents the MotoChef contract.
 * @interface IMotoswapStakingContract
 * @extends {IMotoswapOwnableReentrancyGuard}
 * @cathegory Contracts
 */
export interface IMotoswapStakingContract extends IMotoswapOwnableReentrancyGuard {
    /**
     * @description Gets the stake of a given user
     * @param address {Address} the address of the staker
     * @returns {BalanceOf}
     */
    balanceOf(address: Address): Promise<BalanceOf>;

    /**
     * @description Returns the total amount locked in the staking contract
     * @returns {TotalSupply}
     */
    totalSupply(): Promise<TotalSupply>;

    /**
     * @description Returns the address of the MOTO token accepted as a deposit by the staking contract
     * @returns {MotoAddress}
     */
    motoAddress(): Promise<MotoAddress>;

    /**
     * @description Returns the last block the user interacted with the protocol by staking, unstaking or claiming rewards
     * @param address {Address} the address of the staker
     * @returns {TotalSupply}
     */
    lastInteractedBlock(address: Address): Promise<LastInteractedBlock>;

    /**
     * @description Returns the reward debt (number of tokens claimed) for a given user and reward token
     * @param user {Address} the address of the staker
     * @param rewardToken {Address} the token whose reward debt is returned
     * @returns {RewardDebt}
     */
    rewardDebt(user: Address, rewardToken: Address): Promise<RewardDebt>;

    /**
     * @description Returns the pending reward balances that a user can claim.
     * @param user {Address} the address of the staker
     * @returns {RewardBalances}
     */
    rewardBalances(user: Address): Promise<RewardBalances>;

    /**
     * @description Returns the amount of the user's stake that would be slashed, if they were to withdraw
     * @param user {Address} the address of the staker
     * @param amount {bigint} the amount to calculate the slashing fee of
     * @returns {RewardDebt}
     */
    calculateSlashingFee(user: Address, amount: bigint): Promise<CalculateSlashingFee>;

    /**
     * @description Returns a list of all tokens which rewards can be claimed for
     * @returns {EnabledRewardTokens}
     */
    enabledRewardTokens(): Promise<EnabledRewardTokens>;

    /**
     * @description Stakes Moto tokens in the staking contract
     * @param amount {bigint} amount of Moto to stake
     * @returns {Stake}
     */
    stake(amount: bigint): Promise<Stake>;

    /**
     * @description Unstakes all Moto tokens the user has staked
     * Subject to a slashing fee according to the protocol
     * @returns {Unstake}
     */
    unstake(): Promise<Unstake>;

    /**
     * @description Claims all rewards the user is entitled to.
     * @returns {ClaimRewards}
     */
    claimRewards(): Promise<ClaimRewards>;

    /**
     * @description Enables distribution of rewards for a given token
     * @param token {Address} the address of the token to enable
     * @returns {AdminAddRewardToken}
     */
    adminAddRewardToken(token: Address): Promise<AdminAddRewardToken>;

    /**
     * @description Disables distribution of rewards for a given token
     * @param token {Address} the address of the token to disable
     * @returns {AdminRemoveRewardToken}
     */
    adminRemoveRewardToken(token: Address): Promise<AdminAddRewardToken>;

    /**
     * @description Changes the address of the Moto token the protocol allows the users to stake
     * Also affects what token is paid out when unstaking.
     * NOTE: Can only be called if the Moto token address is not set yet (i.e. == Address.dead())
     * @param token {Address} the address of the Moto token
     * @returns {AdminChangeMotoAddress}
     */
    adminChangeMotoAddress(token: Address): Promise<AdminAddRewardToken>;

    /**
     * @description Changes the following parameters of the protocol
     * @param newLockupDuration {bigint} New lockup duration
     * @param newMaxSlashingFeePercent {bigint} New slashing fee percentage at maximum lockup time
     * @param newBlocksPerOnePercentSlashingFeeReduction {bigint} New value for how many blocks reduce the slashing fee by 1 percent
     * @returns {AdminChangeLockupParameters}
     */
    adminChangeLockupParameters(
        newLockupDuration: bigint,
        newMaxSlashingFeePercent: bigint,
        newBlocksPerOnePercentSlashingFeeReduction: bigint,
    ): Promise<AdminChangeLockupParameters>;

    /**
     * @description Enables emergency withdrawals, allowing users to withdraw their rewards and stake at no penalty
     * @returns {AdminEnableEmergencyWithdrawals}
     */
    adminEnableEmergencyWithdrawals(): Promise<AdminEnableEmergencyWithdrawals>;
}
