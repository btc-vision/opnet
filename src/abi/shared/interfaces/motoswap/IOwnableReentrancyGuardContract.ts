import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../opnet.js';
import { IReentrancyGuard } from './IReentrancyGuardContract.js';

export type Admin = CallResult<{
    adminAddress: Address;
}>;

export type ChangeAdmin = CallResult<{
    success: boolean;
}>;

/**
 * @description This interface represents the OwnableReentrancyGuard contract.
 * @interface IOwnableContract
 * @extends {IOP_NETContract}
 * @category Contracts
 *
 */
export interface IOwnableReentrancyGuardContract extends IReentrancyGuard {
    /**
     * @description Gets the current admin address.
     * @returns {Admin}
     */
    admin(): Promise<Admin>;

    /**
     * @description Changes the contract admin. Only callable by the current admin.
     * @param {Address} newAdmin The new admin address.
     * @returns {ChangeAdmin}
     */
    changeAdmin(newAdmin: Address): Promise<ChangeAdmin>;
}
