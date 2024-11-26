import { Address } from '@btc-vision/transaction';
import { IOwnableReentrancyGuardContract } from './IOwnableReentrancyGuardContract';
import { CallResult } from '../../../../opnet';

export type PoolInfo = {
    allocPoint: number;
    lastRewardBlock: number;
    accMotoPerShare: bigint;
};

export type UserInfo = {
    amount: bigint;
    rewardDebt: bigint;
};

export type Initialize = CallResult<{
    success: boolean;
}>;

export type GetLpToken = CallResult<{
    lpTokenAddress: Address;
}>;

export type GetRewarder = CallResult<{
    rewarderAddress: Address;
}>;

export type GetPoolInfo = CallResult<PoolInfo>;

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

export type Add = CallResult<{
    success: boolean;
}>;

export type Set = CallResult<{
    success: boolean;
}>;

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

export type UpdatePool = CallResult<PoolInfo>;

export type Deposit = CallResult<{
    success: boolean;
}>;

export type Withdraw = CallResult<{
    success: boolean;
}>;

export type Harvest = CallResult<{
    success: boolean;
}>;

export type WithdrawAndHarvest = CallResult<{
    success: boolean;
}>;

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

export type EmergencyWithdraw = CallResult<{
    success: boolean;
}>;

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
     * @returns {Initialize}
     */
    initialize(
        MOTO: Address,
        premineAmount: bigint,
        devaddr: Address,
        motoPerBlock: bigint,
        bonusEndBlock: bigint,
        bonusMultiplier: bigint,
    ): Promise<Initialize>;

    /**
     * @description Gets the LP token address of a pool
     * @param {number} pid The index of the pool
     * @returns {GetLpToken}
     */
    getLpToken(pid: number): Promise<GetLpToken>;

    /**
     * @description Gets the rewarder address of a pool
     * @param {number} pid The index of the pool
     * @returns {GetRewarder}
     */
    getRewarder(pid: number): Promise<GetRewarder>;

    /**
     * @description Gets the pool info of a pool
     * @param {number} pid The index of the pool
     * @returns {GetPoolInfo}
     */
    getPoolInfo(pid: number): Promise<GetPoolInfo>;

    /**
     * @description Gets the user info of a pool
     * @param {number} pid The index of the pool
     * @param {Address} user The address of the user
     * @returns {GetUserInfo}
     */
    getUserInfo(pid: number, user: Address): Promise<GetUserInfo>;

    /**
     * @description Gets all the available pools
     * @returns {Pools}
     */
    pools(): Promise<Pools>;

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
    add(allocPoint: bigint, lpToken: Address, rewarder: Address): Promise<Add>;

    /**
     * @description Update the given pool's MOTO allocation point and `IRewarder` contract. Can only be called by an admin.
     * @param {number} pid the index of the pool
     * @param {bigint} allocPoint New AP of the pool.
     * @param {Address} rewarder Address of the rewarder delegate.
     * @param {boolean} overwrite True if _rewarder should be `set`. Otherwise `_rewarder` is ignored.
     * @returns {Set}
     */
    set(pid: number, allocPoint: bigint, rewarder: Address, overwrite: boolean): Promise<Set>;

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
    migrate(pid: number): Promise<Migrate>;

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
    pendingMoto(pid: number, user: Address): Promise<PendingMoto>;

    /**
     * @description Update reward variables for all pools. Be careful of gas spending!
     * @param {number} length The length of the pids array.
     * @param {number[]} pids Pool IDs of all to be updated. Make sure to update all active pools.
     * @returns {MassUpdatePools}
     */
    massUpdatePools(length: number, pids: number[]): Promise<MassUpdatePools>;

    /**
     * @description Update reward variables of the given pool.
     * @param {number} pid The index of the pool
     * @returns {UpdatePool}
     */
    updatePool(pid: number): Promise<UpdatePool>;

    /**
     * @description Deposit LP tokens to MotoChef for MOTO allocation.
     * @param {number} pid The index of the pool.
     * @param {bigint} amount LP token amount to deposit.
     * @param {Address} to The receiver of `amount` deposit benefit.
     * @returns {Deposit}
     */
    deposit(pid: number, amount: bigint, to: Address): Promise<Deposit>;

    /**
     * @description Withdraw LP tokens from MotoChef.
     * @param {number} pid The index of the pool.
     * @param {bigint} amount LP token amount to deposit.
     * @param {Address} to The receiver of `amount` deposit benefit.
     * @returns {Withdraw}
     */
    withdraw(pid: number, amount: bigint, to: Address): Promise<Withdraw>;

    /**
     * @description Harvest proceeds for transaction sender to `to`.
     * @param {number} pid The index of the pool.
     * @param {Address} to Receiver of MOTO rewards.
     * @returns {Harvest}
     */
    harvest(pid: number, to: Address): Promise<Harvest>;

    /**
     * @description Withdraw LP tokens from MotoChef and harvest proceeds for transaction sender to `to`.
     * @param {number} pid The index of the pool.
     * @param {bigint} amount LP token amount to withdraw.
     * @param {Address} to Receiver of the LP tokens and MOTO rewards.
     * @returns {WithdrawAndHarvest}
     */
    withdrawAndHarvest(pid: number, amount: bigint, to: Address): Promise<WithdrawAndHarvest>;

    /**
     * @description Withdraw without caring about rewards. EMERGENCY ONLY.
     * @param {number} pid The index of the pool.
     * @param {Address} to Receiver of the LP tokens.
     * @returns {EmergencyWithdraw}
     */
    emergencyWithdraw(pid: number, to: Address): Promise<EmergencyWithdraw>;

    /**
     * @description Update dev address by the previous dev.
     * @param {Address} devaddr The new dev address.s
     * @returns {SetDev}
     */
    setDev(devaddr: Address): Promise<SetDev>;
}
