import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_20Contract } from './IOP_20Contract.js';
import { IStackingContract } from './IStackingContract.js';
export type MergedOP_20AndStackingContract = IOP_20Contract & IStackingContract;
export interface IWBTCContract extends MergedOP_20AndStackingContract {
    requestWithdrawal(amount: bigint): Promise<BaseContractProperty>;
    withdrawableBalanceOf(address: string): Promise<BaseContractProperty>;
}
