import { ABIDataTypes, Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../opnet.js';
import { IOwnableReentrancyGuardContract } from './IOwnableReentrancyGuardContract.js';

export type GetMotoAddress = CallResult<{
    motoAddress: Address;
}>;

export type BalanceOf = CallResult<{
    balance: bigint;
}>;

export type TotalSupply = CallResult<{
    totalSupply: bigint;
}>;

export type LastInteractedBlock = CallResult<{
    lastInteractedBlock: bigint;
}>;

export type RewardDebt = CallResult<{
    rewardDebt: bigint;
}>;

export type RewardBalance = CallResult<{
    rewardBalance: bigint;
}>;

export type PendingReward = CallResult<{
    pendingReward: bigint;
}>;

export type CalculateSlashingFee = CallResult<{
    slashingFee: bigint;
}>;

export type EnabledRewardTokens = CallResult<{
    enabledRewardTokens: Address[];
}>;

export type Stake = CallResult<{
    success: boolean;
}>;

export type Unstake = CallResult<{
    success: boolean;
}>;

export type ClaimRewards = CallResult<{
    success: boolean;
}>;

export type AdminAddRewardToken = CallResult<{
    success: boolean;
}>;

export type AdminRemoveRewardToken = CallResult<{
    success: boolean;
}>;

export type AdminChangeMotoAddress = CallResult<{
    success: boolean;
}>;

export type AdminChangeLockupParameters = CallResult<{
    success: boolean;
}>;

export type AdminEnableEmergencyWithdrawals = CallResult<{
    success: boolean;
}>;

// EVENTS
export type RewardTokenAddedEvent = {
    readonly token: Address;
};

export type RewardTokenRemovedEvent = {
    readonly token: Address;
};

/**
 * @description This interface represents the MotoChef contract.
 * @interface IMotoswapStakingContract
 * @extends {IOwnableReentrancyGuardContract}
 * @cathegory Contracts
 */
export interface IMotoswapStakingContract extends IOwnableReentrancyGuardContract {
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
     * @returns {RewardBalance}
     */
    rewardBalance(user: Address): Promise<RewardBalance>;

    /**
     * @description Returns the pending reward amount for a user and a reward token.
     * This represents how much the user would earn if they claimed rewards now.
     * @param user {Address} the user address
     * @param rewardToken {Address} the reward token to check
     * @returns {PendingReward}
     */
    pendingReward(user: Address, rewardToken: Address): Promise<PendingReward>;

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
