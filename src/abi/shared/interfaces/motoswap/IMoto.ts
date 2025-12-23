import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { IOP20Contract } from '../opnet/IOP20Contract.js';
import { Admin, ChangeAdmin } from './IMotoswapStakingContract.js';

export type AdminMint = CallResult;

export type AdminBurn = CallResult;

/**
 * @description This interface represents the IMoto contract. It extends the IOP20Contract and adds the ability to have an admin address that can mint and burn tokens.
 * @interface IMoto
 * @extends {IOP20Contract}
 * @cathegory Contracts
 */
export interface IMoto extends IOP20Contract {
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
