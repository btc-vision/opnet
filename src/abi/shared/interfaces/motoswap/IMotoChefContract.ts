import { Address } from '@btc-vision/transaction';
import { CallResult, OPNetEvent } from '../../../../opnet.js';
import { IOwnableReentrancyGuardContract } from './IOwnableReentrancyGuardContract.js';

export type PoolInfo = {
    allocPoint: number;
    lastRewardBlock: number;
    accMotoPerShare: bigint;
};

export type UserInfo = {
    amount: bigint;
    rewardDebt: bigint;
};

export type Initialize = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<LogPoolAdditionEvent>, OPNetEvent<LogInitEvent>]
>;

export type GetLpToken = CallResult<{
    lpTokenAddress: Address;
}>;

export type GetLpTokens = CallResult<{
    lpTokens: Address[];
}>;

export type GetRewarder = CallResult<{
    rewarderAddress: Address;
}>;

export type GetPoolInfo = CallResult<PoolInfo>;

export type GetPoolsLength = CallResult<{
    poolLength: bigint;
}>;

export type GetUserInfo = CallResult<UserInfo>;

export type Pools = CallResult<{
    poolLength: number;
    poolsData: Uint8Array;
}>;

export type TotalAllocPoint = CallResult<{
    totalAllocPoint: bigint;
}>;

export type Devaddr = CallResult<{
    devaddr: Address;
}>;

export type MotoPerBlock = CallResult<{
    motoPerBlock: bigint;
}>;

export type BonusEndBlock = CallResult<{
    bonusEndBlock: bigint;
}>;

export type BonusMultiplier = CallResult<{
    bonusMultiplier: bigint;
}>;

export type TotalBtcStaked = CallResult<{
    totalBtcStaked: bigint;
}>;

export type TreasuryAddress = CallResult<{
    TreasuryAddress: string;
}>;

export type GetStakingTxId = CallResult<{
    stakingTxId: bigint;
}>;

export type GetStakingIndex = CallResult<{
    stakingIndex: bigint;
}>;

export type Add = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<LogPoolAdditionEvent>]
>;

export type Set = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<LogSetPoolEvent>]
>;

export type SetMigrator = CallResult<{
    success: boolean;
}>;

export type Migrate = CallResult<{
    success: boolean;
}>;

export type GetMultiplier = CallResult<{
    multiplier: bigint;
}>;

export type PendingMoto = CallResult<{
    pendingMoto: number;
}>;

export type MassUpdatePools = CallResult<{
    success: boolean;
}>;

export type UpdatePool = CallResult<PoolInfo, [OPNetEvent<LogUpdatePoolEvent>]>;

export type Deposit = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<DepositEvent>]
>;

export type Withdraw = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<WithdrawEvent>]
>;

export type Harvest = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<HarvestEvent>]
>;

export type WithdrawAndHarvest = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<WithdrawEvent>, OPNetEvent<HarvestEvent>]
>;

export type SetDev = CallResult<{
    success: boolean;
}>;

export type SetMotoPerBlock = CallResult<{
    success: boolean;
}>;

export type SetBonusEndBlock = CallResult<{
    success: boolean;
}>;

export type SetBonusMultiplier = CallResult<{
    success: boolean;
}>;

export type EmergencyWithdraw = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<EmergencyWithdrawEvent>]
>;

export type StakeBtc = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<StakeBTCEvent>]
>;

export type UnstakeBtc = CallResult<
    {
        success: boolean;
    },
    [OPNetEvent<UnstakeBTCEvent>]
>;

// EVENTS
export type LogInitEvent = {
    success: boolean;
};

export type LogPoolAdditionEvent = {
    readonly pid: bigint; // uint256
    readonly allocPoint: bigint; // uint256
    readonly lpToken: Address;
    readonly rewarder: Address;
};

export type LogSetPoolEvent = {
    readonly pid: bigint; // uint256
    readonly allocPoint: bigint; // uint256
    readonly rewarder: Address;
    readonly overwrite: boolean; // bool
};

export type LogUpdatePoolEvent = {
    readonly pid: bigint; // uint256
    readonly lastRewardBlock: bigint; // uint64
    readonly lpSupply: bigint; // uint256
    readonly accMotoPerShare: bigint; // uint256
};

export type DepositEvent = {
    readonly user: Address;
    readonly pid: bigint; // uint32
    readonly amount: bigint; // uint256
    readonly to: Address;
};

export type WithdrawEvent = {
    readonly user: Address;
    readonly pid: bigint; // uint256
    readonly amount: bigint; // uint256
    readonly to: Address;
};

export type HarvestEvent = {
    readonly user: Address;
    readonly pid: bigint; // uint256
    readonly amount: bigint; // uint256
};

export type EmergencyWithdrawEvent = {
    readonly user: Address;
    readonly pid: bigint; // uint256
    readonly amount: bigint; // uint256
    readonly to: Address;
};

export type StakeBTCEvent = {
    readonly user: Address;
    readonly amount: bigint;
    readonly stakingTxId: bigint;
    readonly stakingIndex: bigint;
};

export type UnstakeBTCEvent = {
    readonly user: Address;
    readonly amount: bigint;
    readonly stakingTxId: bigint;
    readonly stakingIndex: bigint;
};

/**
 * @description This interface represents the MotoChef contract.
 * @interface IMotoChefContract
 * @extends {IOwnableReentrancyGuardContract}
 * @cathegory Contracts
 */
export interface IMotoChefContract extends IOwnableReentrancyGuardContract {
    /**
     * @description Initialize the MotoChef contract. Can only be called by an admin.
     * @param {Address} MOTO The address of the MOTO token. MotoChef needs to be the owner/admin of the MOTO token.
     * @param {bigint} premineAmount The amount of MOTO to mint on deploy.
     * @param {Address} devaddr The address of the dev.
     * @param {bigint} motoPerBlock The amount of MOTOs created per block.
     * @param {bigint} bonusEndBlock The block number when the bonus MOTO period ends.
     * @param {bigint} bonusMultiplier The bonus muliplier for early moto makers.
     * @param treasuryAddress The treasury address for btc
     * @param btcAllocPoint The alloc point for the BTC pool
     * @returns {Initialize}
     */
    initialize(
        MOTO: Address,
        premineAmount: bigint,
        devaddr: Address,
        motoPerBlock: bigint,
        bonusEndBlock: bigint,
        bonusMultiplier: bigint,
        treasuryAddress: string,
        btcAllocPoint: bigint,
    ): Promise<Initialize>;

    /**
     * @description Gets the LP token address of a pool
     * @param {number} pid The index of the pool
     * @returns {GetLpToken}
     */
    getLpToken(pid: bigint): Promise<GetLpToken>;

    getLpTokens(): Promise<GetLpTokens>;

    /**
     * @description Gets the pool info of a pool
     * @param {number} pid The index of the pool
     * @returns {GetPoolInfo}
     */
    getPoolInfo(pid: bigint): Promise<GetPoolInfo>;

    getPoolsLength(): Promise<GetPoolsLength>;

    /**
     * @description Gets the user info of a pool
     * @param {number} pid The index of the pool
     * @param {Address} user The address of the user
     * @returns {GetUserInfo}
     */
    getUserInfo(pid: bigint, user: Address): Promise<GetUserInfo>;

    /**
     * @description Gets the total alloc point
     * @returns {TotalAllocPoint}
     */
    totalAllocPoint(): Promise<TotalAllocPoint>;

    /**
     * @description Gets the dev address
     * @returns {Devaddr}
     */
    devaddr(): Promise<Devaddr>;

    /**
     * @description Gets the moto per block
     * @returns {MotoPerBlock}
     */
    getMotoPerBlock(): Promise<MotoPerBlock>;

    /**
     * @description Gets the bonus end block
     * @returns {BonusEndBlock}
     */
    getBonusEndBlock(): Promise<BonusEndBlock>;

    /**
     * @description Gets the bonus multiplier
     * @returns {BonusMultiplier}
     */
    getBonusMultiplier(): Promise<BonusMultiplier>;

    totalBtcStaked(): Promise<TotalBtcStaked>;

    treasuryAddress(): Promise<TreasuryAddress>;

    getStakingTxId(): Promise<GetStakingTxId>;

    getStakingIndex(): Promise<GetStakingIndex>;

    /**
     * @description Set the moto per block. Can only be called by an admin.
     * @param {bigint} motoPerBlock The amount of MOTO per block.
     * @returns {SetMotoPerBlock}
     */
    setMotoPerBlock(motoPerBlock: bigint): Promise<SetMotoPerBlock>;

    /**
     * @description Set the bonus end block. Can only be called by an admin.
     * @param {bigint} bonusEndBlock The block number when the bonus period ends.
     * @returns {SetBonusEndBlock}
     */
    setBonusEndBlock(bonusEndBlock: bigint): Promise<SetBonusEndBlock>;

    /**
     * @description Set the bonus multiplier. Can only be called by an admin.
     * @param {bigint} bonusMultiplier The bonus multiplier.
     * @returns {SetBonusMultiplier}
     */
    setBonusMultiplier(bonusMultiplier: bigint): Promise<SetBonusMultiplier>;

    /**
     * @description Add a new lp to the pool. Can only be called by an admin.
     * @param {bigint} allocPoint allocPoint AP of the new pool.
     * @param {Address} lpToken Address of the LP OP-20 token.
     * @param {Address} rewarder Address of the rewarder delegate.
     * @returns {Add}
     */
    add(allocPoint: bigint, lpToken: Address): Promise<Add>;

    /**
     * @description Update the given pool's MOTO allocation point and `IRewarder` contract. Can only be called by an admin.
     * @param {number} pid the index of the pool
     * @param {bigint} allocPoint New AP of the pool.
     * @param {Address} rewarder Address of the rewarder delegate.
     * @param {boolean} overwrite True if _rewarder should be `set`. Otherwise `_rewarder` is ignored.
     * @returns {Set}
     */
    set(pid: bigint, allocPoint: bigint): Promise<Set>;

    /**
     * @description Set the `migrator` contract. Can only be called by an admin.
     * @param {Address} migrator The contract address to set.
     * @returns {SetMigrator}
     */
    setMigrator(migrator: Address): Promise<SetMigrator>;

    /**
     * @description Migrate LP token to another LP contract through the `migrator` contract.
     * @param {number} pid The index of the pool.
     * @returns {Migrate}
     */
    migrate(pid: bigint): Promise<Migrate>;

    /**
     * @description Get the multiplier over the given _from to _to block.
     * @param {bigint} from the from block
     * @param {bigint} to the to block
     * @returns {GetMultiplier}
     */
    getMultiplier(from: bigint, to: bigint): Promise<GetMultiplier>;

    /**
     * @description View function to see pending MOTO on frontend.
     * @param {number} pid The index of the pool
     * @param {Address} user Address of user.
     * @returns {PendingMoto}
     */
    pendingMoto(pid: bigint, user: Address): Promise<PendingMoto>;

    /**
     * @description Update reward variables for all pools. Be careful of gas spending!
     * @param {number} length The length of the pids array.
     * @param {number[]} pids Pool IDs of all to be updated. Make sure to update all active pools.
     * @returns {MassUpdatePools}
     */
    massUpdatePools(length: number, pids: bigint[]): Promise<MassUpdatePools>;

    /**
     * @description Update reward variables of the given pool.
     * @param {number} pid The index of the pool
     * @returns {UpdatePool}
     */
    updatePool(pid: bigint): Promise<UpdatePool>;

    /**
     * @description Deposit LP tokens to MotoChef for MOTO allocation.
     * @param {number} pid The index of the pool.
     * @param {bigint} amount LP token amount to deposit.
     * @param {Address} to The receiver of `amount` deposit benefit.
     * @returns {Deposit}
     */
    deposit(pid: bigint, amount: bigint, to: Address): Promise<Deposit>;

    /**
     * @description Withdraw LP tokens from MotoChef.
     * @param {number} pid The index of the pool.
     * @param {bigint} amount LP token amount to deposit.
     * @param {Address} to The receiver of `amount` deposit benefit.
     * @returns {Withdraw}
     */
    withdraw(pid: bigint, amount: bigint, to: Address): Promise<Withdraw>;

    /**
     * @description Harvest proceeds for transaction sender to `to`.
     * @param {number} pid The index of the pool.
     * @param {Address} to Receiver of MOTO rewards.
     * @returns {Harvest}
     */
    harvest(pid: bigint, to: Address): Promise<Harvest>;

    /**
     * @description Withdraw LP tokens from MotoChef and harvest proceeds for transaction sender to `to`.
     * @param {number} pid The index of the pool.
     * @param {bigint} amount LP token amount to withdraw.
     * @param {Address} to Receiver of the LP tokens and MOTO rewards.
     * @returns {WithdrawAndHarvest}
     */
    withdrawAndHarvest(pid: bigint, amount: bigint, to: Address): Promise<WithdrawAndHarvest>;

    /**
     * @description Withdraw without caring about rewards. EMERGENCY ONLY.
     * @param {number} pid The index of the pool.
     * @param {Address} to Receiver of the LP tokens.
     * @returns {EmergencyWithdraw}
     */
    emergencyWithdraw(pid: bigint, to: Address): Promise<EmergencyWithdraw>;

    /**
     * @description Update dev address by the previous dev.
     * @param {Address} devaddr The new dev address.s
     * @returns {SetDev}
     */
    setDev(devaddr: Address): Promise<SetDev>;

    stakeBtc(stakeAmount: bigint): Promise<StakeBtc>;

    unstakeBtc(): Promise<UnstakeBtc>;
}
