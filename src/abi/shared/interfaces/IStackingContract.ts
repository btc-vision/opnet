import { Address } from '@btc-vision/transaction';
import { BaseContractProperties } from '../../interfaces/BaseContractProperties.js';

/**
 * @description This interface represents the WBTC contract.
 * @interface IWBTCContract
 * @extends {BaseContractProperties}
 * @cathegory Contracts
 */
export interface IStackingContract {
    stake(amount: bigint): Promise<BaseContractProperties>;

    unstake(): Promise<BaseContractProperties>;

    stakedAmount(address: Address): Promise<BaseContractProperties>;

    stakedReward(address: Address): Promise<BaseContractProperties>;

    claim(): Promise<BaseContractProperties>;

    rewardPool(): Promise<BaseContractProperties>;

    totalStaked(): Promise<BaseContractProperties>;
}
