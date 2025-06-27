import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';

/**
 * @description This interface represents the WBTC contract.
 * @interface IWBTCContract
 * @extends {CallResult}
 * @cathegory Contracts
 */
export interface IStackingContract {
    stake(amount: bigint): Promise<CallResult>;

    unstake(): Promise<CallResult>;

    stakedAmount(address: Address): Promise<CallResult<{ amount: bigint }>>;

    stakedReward(address: Address): Promise<CallResult<{ amount: bigint }>>;

    claim(): Promise<CallResult>;

    rewardPool(): Promise<CallResult<{ reward: bigint }>>;

    totalStaked(): Promise<CallResult<{ total: bigint }>>;
}
