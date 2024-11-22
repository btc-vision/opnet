import { Address } from '@btc-vision/transaction';
import { IOP_20Contract } from './IOP_20Contract';
import { CallResult } from '../../../opnet';

export type Admin = CallResult<{
    ADDRESS: Address;
}>;

export type ChangeAdmin = CallResult<{
    success: boolean;
}>;

export type AdminMint = CallResult<{
    success: boolean;
}>;

export type AdminBurn = CallResult<{
    success: boolean;
}>;

/**
 * @description This interface represents the IAdministeredOP20Contract contract. It extends the IOP_20Contract and adds the ability to have an admin address that can mint and burn tokens.
 * @interface IMotoChefContract
 * @extends {IOwnableReentrancyGuardContract}
 * @cathegory Contracts
 */
export interface IAdministeredOP20Contract extends IOP_20Contract {
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

    /**
     * @description Mints tokens to a specified address. Only callable by the admin.
     * @param {Address} to The address to mint tokens to.
     * @param {bigint} amount The amount of tokens to mint.
     * @returns {AdminMint}
     */
    adminMint(to: Address, amount: bigint): Promise<AdminMint>;

    /**
     * @description Burns tokens from a specified address. Only callable by the admin.
     * @param {Address} from The address to burn tokens from.
     * @param {bigint} amount The amount of tokens to burn.
     * @returns {AdminBurn}
     */
    adminBurn(from: Address, amount: bigint): Promise<AdminBurn>;
}
