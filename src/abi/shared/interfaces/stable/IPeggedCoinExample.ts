import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { BurnedEvent } from '../opnet/IOP20Contract.js';
import { IOP20SContract } from '../opnet/IOP20SContract.js';

export type CustodianChangedEventPegged = {
    readonly previousCustodian: Address;
    readonly newCustodian: Address;
};

export type BurnFromPegged = CallResult<{}, [OPNetEvent<BurnedEvent>]>;

export type TransferCustodianPegged = CallResult<{}, []>;

export type AcceptCustodianPegged = CallResult<{}, [OPNetEvent<CustodianChangedEventPegged>]>;

export type CustodianPegged = CallResult<{ custodian: Address }, []>;

export type PendingCustodianPegged = CallResult<{ pendingCustodian: Address }, []>;

/**
 * @description This interface represents the MyPeggedToken contract,
 * extending OP20S with custodian-managed minting and burning functionality.
 *
 * @interface IPeggedTokenContract
 * @extends {IOP20SContract}
 * @category Contracts
 */
export interface IPeggedTokenContract extends IOP20SContract {
    /**
     * @description Burns tokens from the specified address. Only callable by custodian.
     * @param from - The address to burn tokens from.
     * @param amount - The amount of tokens to burn.
     * @returns {Promise<BurnFromPegged>}
     */
    burnFrom(from: Address, amount: bigint): Promise<BurnFromPegged>;

    /**
     * @description Initiates custodian transfer. Only callable by current custodian.
     * @param newCustodian - The new custodian address.
     * @returns {Promise<TransferCustodianPegged>}
     */
    transferCustodian(newCustodian: Address): Promise<TransferCustodianPegged>;

    /**
     * @description Accepts pending custodian transfer. Only callable by pending custodian.
     * @returns {Promise<AcceptCustodianPegged>}
     */
    acceptCustodian(): Promise<AcceptCustodianPegged>;

    /**
     * @description Gets the current custodian address.
     * @returns {Promise<CustodianPegged>}
     */
    custodian(): Promise<CustodianPegged>;

    /**
     * @description Gets the pending custodian address.
     * @returns {Promise<PendingCustodianPegged>}
     */
    pendingCustodian(): Promise<PendingCustodianPegged>;
}
