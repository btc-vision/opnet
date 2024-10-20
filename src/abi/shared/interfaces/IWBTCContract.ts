import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../contracts/CallResult.js';
import { IOP_20Contract } from './IOP_20Contract.js';
import { IStackingContract } from './IStackingContract.js';

/**
 * @description This interface represents the contract OP_20 and Stacking contract merged.
 * @interface MergedOP_20AndStackingContract
 * @extends {IOP_20Contract}
 * @extends {IStackingContract}
 * @cathegory Contracts
 */
export type MergedOP_20AndStackingContract = IOP_20Contract & IStackingContract;

/**
 * @description This interface represents the WBTC contract.
 * @interface IWBTCContract
 * @extends {MergedOP_20AndStackingContract}
 * @cathegory Contracts
 */
export interface IWBTCContract extends MergedOP_20AndStackingContract {
    /**
     * @description Request a withdrawal of the specified amount.
     * @param {bigint} amount The amount to withdraw.
     * @returns {Promise<CallResult>} A promise that resolves to a boolean indicating if the withdrawal was successful.
     */
    requestWithdrawal(amount: bigint): Promise<CallResult<{ success: boolean }>>;

    /**
     * @description Get the withdrawable balance of the specified address.
     * @param {string} address The address to check.
     * @returns {Promise<CallResult>} A promise that resolves to the balance.
     */
    withdrawableBalanceOf(address: Address): Promise<CallResult<{ balance: bigint }>>;
}
