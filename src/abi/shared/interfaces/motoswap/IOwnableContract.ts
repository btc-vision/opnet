import { Address } from '@btc-vision/transaction';
import { CallResult, IOP_NETContract } from '../../../../opnet';

export type Admin = CallResult<{
    adminAddress: Address;
}>;

export type ChangeAdmin = CallResult<{
    success: boolean;
}>;

/**
 * @description This interface represents the Ownable contract. It adds the ability to have an admin address that can access certain methods.
 * @interface IOwnableContract
 * @extends {IOP_NETContract}
 * @category Contracts
 *
 */
export interface IOwnableContract extends IOP_NETContract {
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
