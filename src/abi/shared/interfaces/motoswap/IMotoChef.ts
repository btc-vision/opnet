import { Address } from '@btc-vision/transaction';
import { CallResult, IOP_NETContract, OPNetEvent } from '../../../../opnet';

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
        returnVal1: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the renounceOwnership function call.
 */
export type RenounceOwnership = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<OwnershipTransferredEvent>[]
>;

/**
 * @description Represents the result of the transferOwnership function call.
 */
export type TransferOwnership = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<OwnershipTransferredEvent>[]
>;

// ------------------------------------------------------------------
// IMotoChefOwnable
// ------------------------------------------------------------------
interface IMotoChefOwnable extends IOP_NETContract {
    owner(): Promise<Owner>;
    renounceOwnership(): Promise<RenounceOwnership>;
    transferOwnership(newOwner: Address): Promise<TransferOwnership>;
}

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type LogInitEvent = {};
export type LogPoolAdditionEvent = {
    readonly poolId: bigint;
    readonly allocPoint: bigint;
    readonly lpToken: Address;
};
export type StakedBTCEvent = {
    readonly user: Address;
    readonly netAmount: bigint;
    readonly stakeTxHash: bigint;
    readonly stakeIndex: bigint;
};
export type LogUpdatePoolEvent = {
    readonly poolId: bigint;
    readonly lastRewardBlock: bigint;
    readonly lpSupply: bigint;
    readonly accMotoPerShare: bigint;
};
export type UnstakedBTCEvent = {
    readonly user: Address;
    readonly pendingMoto: bigint;
    readonly storedTxHash: bigint;
    readonly storedIndex: bigint;
};
export type LogSetPoolEvent = {
    readonly poolId: bigint;
    readonly allocPoint: bigint;
};
export type DepositEvent = {
    readonly user: Address;
    readonly poolId: bigint;
    readonly amount: bigint;
    readonly to: Address;
};
export type WithdrawEvent = {
    readonly user: Address;
    readonly poolId: bigint;
    readonly amount: bigint;
    readonly to: Address;
};
export type HarvestEvent = {
    readonly user: Address;
    readonly poolId: bigint;
    readonly amount: bigint;
};
export type EmergencyWithdrawEvent = {
    readonly user: Address;
    readonly poolId: bigint;
    readonly amount: bigint;
    readonly to: Address;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the initialize function call.
 */
export type Initialize = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<LogInitEvent | LogPoolAdditionEvent>[]
>;

/**
 * @description Represents the result of the totalAllocPoint function call.
 */
export type TotalAllocPoint = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the devAddress function call.
 */
export type DevAddress = CallResult<
    {
        returnVal1: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getMotoPerBlock function call.
 */
export type GetMotoPerBlock = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getBonusEndBlock function call.
 */
export type GetBonusEndBlock = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getBonusMultiplier function call.
 */
export type GetBonusMultiplier = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getLpTokens function call.
 */
export type GetLpTokens = CallResult<
    {
        returnVal1: Address[];
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getPoolsLength function call.
 */
export type GetPoolsLength = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getLpToken function call.
 */
export type GetLpToken = CallResult<
    {
        returnVal1: Address;
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
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the pendingMoto function call.
 */
export type PendingMoto = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the treasuryAddress function call.
 */
export type TreasuryAddress = CallResult<
    {
        returnVal1: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getStakingTxHash function call.
 */
export type GetStakingTxHash = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getStakingIndex function call.
 */
export type GetStakingIndex = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the totalBTCStaked function call.
 */
export type TotalBTCStaked = CallResult<
    {
        returnVal1: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the stakeBTC function call.
 */
export type StakeBTC = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<StakedBTCEvent | LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the unstakeBTC function call.
 */
export type UnstakeBTC = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<UnstakedBTCEvent | LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the add function call.
 */
export type Add = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<LogPoolAdditionEvent>[]
>;

/**
 * @description Represents the result of the set function call.
 */
export type Set = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<LogSetPoolEvent>[]
>;

/**
 * @description Represents the result of the updatePool function call.
 */
export type UpdatePool = CallResult<
    {
        accMotoPerShare: bigint;
        lastRewardBlock: bigint;
        allocPoint: bigint;
    },
    OPNetEvent<LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the massUpdatePools function call.
 */
export type MassUpdatePools = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the deposit function call.
 */
export type Deposit = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<DepositEvent | LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the withdraw function call.
 */
export type Withdraw = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<WithdrawEvent | LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the harvest function call.
 */
export type Harvest = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<HarvestEvent | LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the withdrawAndHarvest function call.
 */
export type WithdrawAndHarvest = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<WithdrawEvent | HarvestEvent | LogUpdatePoolEvent>[]
>;

/**
 * @description Represents the result of the emergencyWithdraw function call.
 */
export type EmergencyWithdraw = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<EmergencyWithdrawEvent>[]
>;

/**
 * @description Represents the result of the setMotoPerBlock function call.
 */
export type SetMotoPerBlock = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setBonusEndBlock function call.
 */
export type SetBonusEndBlock = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setBonusMultiplier function call.
 */
export type SetBonusMultiplier = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setDev function call.
 */
export type SetDev = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// IMotoChef
// ------------------------------------------------------------------
export interface IMotoChef extends IMotoChefOwnable {
    initialize(
        motoAddress: Address,
        premineAmount: bigint,
        devAddress: Address,
        motoPerBlock: bigint,
        bonusEndBlock: bigint,
        bonusMultiplier: bigint,
        treasuryAddress: string,
        BTCAllocPoint: bigint,
    ): Promise<Initialize>;
    totalAllocPoint(): Promise<TotalAllocPoint>;
    devAddress(): Promise<DevAddress>;
    getMotoPerBlock(): Promise<GetMotoPerBlock>;
    getBonusEndBlock(): Promise<GetBonusEndBlock>;
    getBonusMultiplier(): Promise<GetBonusMultiplier>;
    getLpTokens(): Promise<GetLpTokens>;
    getPoolsLength(): Promise<GetPoolsLength>;
    getLpToken(poolId: bigint): Promise<GetLpToken>;
    getPoolInfo(poolId: bigint): Promise<GetPoolInfo>;
    getUserInfo(poolId: bigint, user: Address): Promise<GetUserInfo>;
    getMultiplier(from: bigint, to: bigint): Promise<GetMultiplier>;
    pendingMoto(poolId: bigint, user: Address): Promise<PendingMoto>;
    treasuryAddress(): Promise<TreasuryAddress>;
    getStakingTxHash(user: Address): Promise<GetStakingTxHash>;
    getStakingIndex(user: Address): Promise<GetStakingIndex>;
    totalBTCStaked(): Promise<TotalBTCStaked>;
    stakeBTC(amount: bigint): Promise<StakeBTC>;
    unstakeBTC(): Promise<UnstakeBTC>;
    add(allocPoint: bigint, lpToken: Address): Promise<Add>;
    set(poolId: bigint, allocPoint: bigint): Promise<Set>;
    updatePool(poolId: bigint): Promise<UpdatePool>;
    massUpdatePools(length: number, poolIds: bigint[]): Promise<MassUpdatePools>;
    deposit(poolId: bigint, amount: bigint, to: Address): Promise<Deposit>;
    withdraw(poolId: bigint, amount: bigint, to: Address): Promise<Withdraw>;
    harvest(poolId: bigint, to: Address): Promise<Harvest>;
    withdrawAndHarvest(poolId: bigint, amount: bigint, to: Address): Promise<WithdrawAndHarvest>;
    emergencyWithdraw(poolId: bigint, to: Address): Promise<EmergencyWithdraw>;
    setMotoPerBlock(motoPerBlock: bigint): Promise<SetMotoPerBlock>;
    setBonusEndBlock(bonusEndBlock: bigint): Promise<SetBonusEndBlock>;
    setBonusMultiplier(bonusMultiplier: bigint): Promise<SetBonusMultiplier>;
    setDev(devAddress: Address): Promise<SetDev>;
}
