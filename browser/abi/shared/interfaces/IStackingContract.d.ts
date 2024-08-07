import { Address } from '@btc-vision/bsi-binary';
import { BaseContractProperties } from '../../interfaces/BaseContractProperties.js';
export interface IStackingContract {
    stake(amount: bigint): Promise<BaseContractProperties>;
    unstake(): Promise<BaseContractProperties>;
    stakedAmount(address: Address): Promise<BaseContractProperties>;
    stakedReward(address: Address): Promise<BaseContractProperties>;
    claim(): Promise<BaseContractProperties>;
    rewardPool(): Promise<BaseContractProperties>;
    totalStaked(): Promise<BaseContractProperties>;
}
