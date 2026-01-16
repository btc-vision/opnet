import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IMotoChef, InitializedEvent, PoolAddedEvent } from './IMotoChef.js';

export type TemplateMotoChefInitializedEvent = {};

export type TemplateMotoChefInitialize = CallResult<
    {},
    OPNetEvent<PoolAddedEvent | InitializedEvent>[]
>;
export type GetFarmName = CallResult<{ name: string }, OPNetEvent<never>[]>;
export type GetFarmBanner = CallResult<{ banner: string }, OPNetEvent<never>[]>;
export type SetUserTokenAddress = CallResult<{}, OPNetEvent<never>[]>;
export type TransferOwnershipToUser = CallResult<{}, OPNetEvent<never>[]>;
export type UserFeeRecipient = CallResult<{ recipient: string }, OPNetEvent<never>[]>;
export type MotoSwapFeeRecipient = CallResult<{ recipient: string }, OPNetEvent<never>[]>;
export type OpnetFeeRecipient = CallResult<{ recipient: string }, OPNetEvent<never>[]>;
export type BtcFeePercentage = CallResult<{ percentage: bigint }, OPNetEvent<never>[]>;
export type GetFeeDistributionBps = CallResult<
    {
        userFeeBps: bigint;
        motoSwapFeeBps: bigint;
        opnetFeeBps: bigint;
        totalBps: bigint;
    },
    OPNetEvent<never>[]
>;
export type TotalUserTokenStaked = CallResult<{ totalStaked: bigint }, OPNetEvent<never>[]>;

export interface ITemplateMotoChef extends Omit<IMotoChef, 'initialize'> {
    initialize(
        userTokenAddress: Address,
        tokenPerBlock: bigint,
        bonusEndBlock: bigint,
        bonusMultiplier: bigint,
        BTCAllocPoint: bigint,
        tokenAllocPoint: bigint,
        userBTCFeePercentage: bigint,
        userFeeRecipient: string,
        motoSwapFeeRecipient: string,
        opnetFeeRecipient: string,
        farmName: string,
        farmBanner: string,
        additionalPoolTokens: Address[],
        additionalPoolAllocPoints: bigint[],
    ): Promise<TemplateMotoChefInitialize>;

    getFarmName(): Promise<GetFarmName>;
    getFarmBanner(): Promise<GetFarmBanner>;
    setUserTokenAddress(tokenAddress: Address): Promise<SetUserTokenAddress>;
    transferOwnershipToUser(newOwner: Address): Promise<TransferOwnershipToUser>;
    userFeeRecipient(): Promise<UserFeeRecipient>;
    motoSwapFeeRecipient(): Promise<MotoSwapFeeRecipient>;
    opnetFeeRecipient(): Promise<OpnetFeeRecipient>;
    btcFeePercentage(): Promise<BtcFeePercentage>;
    getFeeDistributionBps(): Promise<GetFeeDistributionBps>;
    totalUserTokenStaked(): Promise<TotalUserTokenStaked>;
}

export default ITemplateMotoChef;
