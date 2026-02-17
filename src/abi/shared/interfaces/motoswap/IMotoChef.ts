import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type OwnershipTransferredEvent = {
    readonly previousOwner: Address;
    readonly newOwner: Address;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the owner function call.
 */
export type Owner = CallResult<
    {
        owner: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the renounceOwnership function call.
 */
export type RenounceOwnership = CallResult<{}, OPNetEvent<OwnershipTransferredEvent>[]>;

/**
 * @description Represents the result of the transferOwnership function call.
 */
export type TransferOwnership = CallResult<{}, OPNetEvent<OwnershipTransferredEvent>[]>;

// ------------------------------------------------------------------
// IOwnable
// ------------------------------------------------------------------
interface IOwnable extends IOP_NETContract {
    owner(): Promise<Owner>;

    renounceOwnership(): Promise<RenounceOwnership>;

    transferOwnership(newOwner: Address): Promise<TransferOwnership>;
}

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type PoolAddedEvent = {
    readonly poolId: number;
    readonly allocPoint: bigint;
    readonly lpToken: Address;
};
export type InitializedEvent = {};
export type PoolUpdatedEvent = {
    readonly poolId: number;
    readonly lastRewardBlock: bigint;
    readonly lpSupply: bigint;
    readonly accMotoPerShare: bigint;
};
export type BTCStakedEvent = {
    readonly user: Address;
    readonly netAmount: bigint;
    readonly stakeTxId: bigint;
    readonly stakeIndex: bigint;
};
export type BTCUnstakedEvent = {
    readonly user: Address;
    readonly pendingMoto: bigint;
    readonly storedTxId: bigint;
    readonly storedIndex: bigint;
};
export type BTCStakeRemovedEvent = {
    readonly user: Address;
    readonly storedTxId: bigint;
    readonly storedIndex: bigint;
};
export type PoolSetEvent = {
    readonly poolId: number;
    readonly allocPoint: bigint;
};
export type DepositedEvent = {
    readonly user: Address;
    readonly poolId: number;
    readonly amount: bigint;
    readonly to: Address;
};
export type WithdrawnEvent = {
    readonly user: Address;
    readonly poolId: number;
    readonly amount: bigint;
    readonly to: Address;
};
export type HarvestedEvent = {
    readonly user: Address;
    readonly poolId: number;
    readonly amount: bigint;
};
export type EmergencyWithdrawnEvent = {
    readonly user: Address;
    readonly poolId: number;
    readonly amount: bigint;
    readonly to: Address;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the initialize function call.
 */
export type Initialize = CallResult<{}, OPNetEvent<PoolAddedEvent | InitializedEvent>[]>;

/**
 * @description Represents the result of the totalAllocPoint function call.
 */
export type TotalAllocPoint = CallResult<
    {
        totalAllocPoint: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the devAddress function call.
 */
export type DevAddress = CallResult<
    {
        devAddress: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getMotoPerBlock function call.
 */
export type GetMotoPerBlock = CallResult<
    {
        motoPerBlock: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getBonusEndBlock function call.
 */
export type GetBonusEndBlock = CallResult<
    {
        bonusEndBlock: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getBonusMultiplier function call.
 */
export type GetBonusMultiplier = CallResult<
    {
        bonusMultiplier: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getLpTokens function call.
 */
export type GetLpTokens = CallResult<
    {
        lpTokens: Address[];
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getPoolsLength function call.
 */
export type GetPoolsLength = CallResult<
    {
        poolsLength: number;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getLpToken function call.
 */
export type GetLpToken = CallResult<
    {
        lpToken: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getPoolInfo function call.
 */
export type GetPoolInfo = CallResult<
    {
        accMotoPerShare: bigint;
        lastRewardBlock: bigint;
        allocPoint: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getUserInfo function call.
 */
export type GetUserInfo = CallResult<
    {
        amount: bigint;
        rewardDebt: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getMultiplier function call.
 */
export type GetMultiplier = CallResult<
    {
        multiplier: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the pendingMoto function call.
 */
export type PendingMoto = CallResult<
    {
        pendingMoto: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the treasuryAddress function call.
 */
export type TreasuryAddress = CallResult<
    {
        treasuryAddress: string;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getStakingTxId function call.
 */
export type GetStakingTxId = CallResult<
    {
        stakingTxId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getStakingIndex function call.
 */
export type GetStakingIndex = CallResult<
    {
        stakingIndex: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the totalBTCStaked function call.
 */
export type TotalBTCStaked = CallResult<
    {
        totalBTCStaked: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the stakeBTC function call.
 */
export type StakeBTC = CallResult<
    {},
    OPNetEvent<PoolUpdatedEvent | BTCStakedEvent | BTCStakeRemovedEvent>[]
>;

/**
 * @description Represents the result of the unstakeBTC function call.
 */
export type UnstakeBTC = CallResult<{}, OPNetEvent<PoolUpdatedEvent | BTCUnstakedEvent>[]>;

/**
 * @description Represents the result of the removeBTCStake function call.
 */
export type RemoveBTCStake = CallResult<{}, OPNetEvent<PoolUpdatedEvent | BTCStakeRemovedEvent>[]>;

/**
 * @description Represents the result of the add function call.
 */
export type Add = CallResult<{}, OPNetEvent<PoolAddedEvent>[]>;

/**
 * @description Represents the result of the set function call.
 */
export type Set = CallResult<{}, OPNetEvent<PoolSetEvent>[]>;

/**
 * @description Represents the result of the updatePool function call.
 */
export type UpdatePool = CallResult<
    {
        accMotoPerShare: bigint;
        lastRewardBlock: bigint;
        allocPoint: bigint;
    },
    OPNetEvent<PoolUpdatedEvent>[]
>;

/**
 * @description Represents the result of the massUpdatePools function call.
 */
export type MassUpdatePools = CallResult<{}, OPNetEvent<PoolUpdatedEvent>[]>;

/**
 * @description Represents the result of the deposit function call.
 */
export type Deposit = CallResult<{}, OPNetEvent<PoolUpdatedEvent | DepositedEvent>[]>;

/**
 * @description Represents the result of the withdraw function call.
 */
export type Withdraw = CallResult<{}, OPNetEvent<PoolUpdatedEvent | WithdrawnEvent>[]>;

/**
 * @description Represents the result of the harvest function call.
 */
export type Harvest = CallResult<{}, OPNetEvent<PoolUpdatedEvent | HarvestedEvent>[]>;

/**
 * @description Represents the result of the withdrawAndHarvest function call.
 */
export type WithdrawAndHarvest = CallResult<
    {},
    OPNetEvent<PoolUpdatedEvent | WithdrawnEvent | HarvestedEvent>[]
>;

/**
 * @description Represents the result of the emergencyWithdraw function call.
 */
export type EmergencyWithdraw = CallResult<{}, OPNetEvent<EmergencyWithdrawnEvent>[]>;

/**
 * @description Represents the result of the setMotoPerBlock function call.
 */
export type SetMotoPerBlock = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the setBonusEndBlock function call.
 */
export type SetBonusEndBlock = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the setBonusMultiplier function call.
 */
export type SetBonusMultiplier = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the setDev function call.
 */
export type SetDev = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the onOP20Received function call.
 */
export type OnOP20Received = CallResult<
    {
        selector: Uint8Array;
    },
    []
>;

// ------------------------------------------------------------------
// IMotoChef
// ------------------------------------------------------------------
export interface IMotoChef extends IOwnable {
    initialize(
        motoAddress: Address,
        premineAmount: bigint,
        devAddress: Address,
        motoPerBlock: bigint,
        bonusEndBlock: bigint,
        bonusMultiplier: bigint,
        treasuryAddress: string,
        BTCAllocPoint: bigint,
        MOTOAllocPoint: bigint,
    ): Promise<Initialize>;

    totalAllocPoint(): Promise<TotalAllocPoint>;

    devAddress(): Promise<DevAddress>;

    getMotoPerBlock(): Promise<GetMotoPerBlock>;

    getBonusEndBlock(): Promise<GetBonusEndBlock>;

    getBonusMultiplier(): Promise<GetBonusMultiplier>;

    getLpTokens(): Promise<GetLpTokens>;

    getPoolsLength(): Promise<GetPoolsLength>;

    getLpToken(poolId: number): Promise<GetLpToken>;

    getPoolInfo(poolId: number): Promise<GetPoolInfo>;

    getUserInfo(poolId: number, user: Address): Promise<GetUserInfo>;

    getMultiplier(from: bigint, to: bigint): Promise<GetMultiplier>;

    pendingMoto(poolId: number, user: Address): Promise<PendingMoto>;

    treasuryAddress(): Promise<TreasuryAddress>;

    getStakingTxId(user: Address): Promise<GetStakingTxId>;

    getStakingIndex(user: Address): Promise<GetStakingIndex>;

    totalBTCStaked(): Promise<TotalBTCStaked>;

    stakeBTC(amount: bigint): Promise<StakeBTC>;

    unstakeBTC(): Promise<UnstakeBTC>;

    removeBTCStake(user: Address): Promise<RemoveBTCStake>;

    add(allocPoint: bigint, lpToken: Address): Promise<Add>;

    set(poolId: number, allocPoint: bigint): Promise<Set>;

    updatePool(poolId: number): Promise<UpdatePool>;

    massUpdatePools(length: number, poolIds: number[]): Promise<MassUpdatePools>;

    deposit(poolId: number, amount: bigint, to: Address): Promise<Deposit>;

    withdraw(poolId: number, amount: bigint, to: Address): Promise<Withdraw>;

    harvest(poolId: number, to: Address): Promise<Harvest>;

    withdrawAndHarvest(poolId: number, amount: bigint, to: Address): Promise<WithdrawAndHarvest>;

    emergencyWithdraw(poolId: number, to: Address): Promise<EmergencyWithdraw>;

    setMotoPerBlock(motoPerBlock: bigint): Promise<SetMotoPerBlock>;

    setBonusEndBlock(bonusEndBlock: bigint): Promise<SetBonusEndBlock>;

    setBonusMultiplier(bonusMultiplier: bigint): Promise<SetBonusMultiplier>;

    setDev(devAddress: Address): Promise<SetDev>;

    onOP20Received(
        operator: Address,
        from: Address,
        amount: bigint,
        data: Uint8Array,
    ): Promise<OnOP20Received>;
}
