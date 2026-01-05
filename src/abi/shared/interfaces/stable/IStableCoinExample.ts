import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP20SContract } from '../opnet/IOP20SContract.js';

export type MintedEventStable = {
    readonly to: Address;
    readonly amount: bigint;
};

export type BurnedEventStable = {
    readonly from: Address;
    readonly amount: bigint;
};

export type BlacklistedEventStable = {
    readonly account: Address;
    readonly blacklister: Address;
};

export type UnblacklistedEventStable = {
    readonly account: Address;
    readonly blacklister: Address;
};

export type PausedEventStable = {
    readonly pauser: Address;
};

export type UnpausedEventStable = {
    readonly pauser: Address;
};

export type OwnershipTransferStartedEventStable = {
    readonly currentOwner: Address;
    readonly pendingOwner: Address;
};

export type OwnershipTransferredEventStable = {
    readonly previousOwner: Address;
    readonly newOwner: Address;
};

export type MinterChangedEventStable = {
    readonly previousMinter: Address;
    readonly newMinter: Address;
};

export type BlacklisterChangedEventStable = {
    readonly previousBlacklister: Address;
    readonly newBlacklister: Address;
};

export type PauserChangedEventStable = {
    readonly previousPauser: Address;
    readonly newPauser: Address;
};

export type MintStable = CallResult<{}, [OPNetEvent<MintedEventStable>]>;

export type BurnFromStable = CallResult<{}, [OPNetEvent<BurnedEventStable>]>;

export type BlacklistStable = CallResult<{}, [OPNetEvent<BlacklistedEventStable>]>;

export type UnblacklistStable = CallResult<{}, [OPNetEvent<UnblacklistedEventStable>]>;

export type IsBlacklistedStable = CallResult<{ blacklisted: boolean }, []>;

export type PauseStable = CallResult<{}, [OPNetEvent<PausedEventStable>]>;

export type UnpauseStable = CallResult<{}, [OPNetEvent<UnpausedEventStable>]>;

export type IsPausedStable = CallResult<{ paused: boolean }, []>;

export type TransferOwnershipStable = CallResult<
    {},
    [OPNetEvent<OwnershipTransferStartedEventStable>]
>;

export type AcceptOwnershipStable = CallResult<{}, [OPNetEvent<OwnershipTransferredEventStable>]>;

export type SetMinterStable = CallResult<{}, [OPNetEvent<MinterChangedEventStable>]>;

export type SetBlacklisterStable = CallResult<{}, [OPNetEvent<BlacklisterChangedEventStable>]>;

export type SetPauserStable = CallResult<{}, [OPNetEvent<PauserChangedEventStable>]>;

export type OwnerStable = CallResult<{ owner: Address }, []>;

export type MinterStable = CallResult<{ minter: Address }, []>;

export type BlacklisterStable = CallResult<{ blacklister: Address }, []>;

export type PauserStable = CallResult<{ pauser: Address }, []>;

/**
 * @description This interface represents the MyStableCoin contract,
 * extending OP20S with managed stablecoin functionality including
 * blacklisting, pausing, and role-based access control.
 *
 * @interface IStableCoinContract
 * @extends {IOP20SContract}
 * @category Contracts
 */
export interface IStableCoinContract extends IOP20SContract {
    /**
     * @description Mints tokens to the specified address. Only callable by minter.
     * @param to - The address to mint tokens to.
     * @param amount - The amount of tokens to mint.
     * @returns {Promise<MintStable>}
     */
    mint(to: Address, amount: bigint): Promise<MintStable>;

    /**
     * @description Burns tokens from the specified address. Only callable by minter.
     * @param from - The address to burn tokens from.
     * @param amount - The amount of tokens to burn.
     * @returns {Promise<BurnFromStable>}
     */
    burnFrom(from: Address, amount: bigint): Promise<BurnFromStable>;

    /**
     * @description Blacklists an account. Only callable by blacklister.
     * @param account - The address to blacklist.
     * @returns {Promise<BlacklistStable>}
     */
    blacklist(account: Address): Promise<BlacklistStable>;

    /**
     * @description Removes an account from the blacklist. Only callable by blacklister.
     * @param account - The address to unblacklist.
     * @returns {Promise<UnblacklistStable>}
     */
    unblacklist(account: Address): Promise<UnblacklistStable>;

    /**
     * @description Checks if an account is blacklisted.
     * @param account - The address to check.
     * @returns {Promise<IsBlacklistedStable>}
     */
    isBlacklisted(account: Address): Promise<IsBlacklistedStable>;

    /**
     * @description Pauses the contract. Only callable by pauser.
     * @returns {Promise<PauseStable>}
     */
    pause(): Promise<PauseStable>;

    /**
     * @description Unpauses the contract. Only callable by pauser.
     * @returns {Promise<UnpauseStable>}
     */
    unpause(): Promise<UnpauseStable>;

    /**
     * @description Checks if the contract is paused.
     * @returns {Promise<IsPausedStable>}
     */
    isPaused(): Promise<IsPausedStable>;

    /**
     * @description Initiates ownership transfer. Only callable by owner.
     * @param newOwner - The new owner address.
     * @returns {Promise<TransferOwnershipStable>}
     */
    transferOwnership(newOwner: Address): Promise<TransferOwnershipStable>;

    /**
     * @description Accepts pending ownership transfer. Only callable by pending owner.
     * @returns {Promise<AcceptOwnershipStable>}
     */
    acceptOwnership(): Promise<AcceptOwnershipStable>;

    /**
     * @description Sets a new minter. Only callable by owner.
     * @param newMinter - The new minter address.
     * @returns {Promise<SetMinterStable>}
     */
    setMinter(newMinter: Address): Promise<SetMinterStable>;

    /**
     * @description Sets a new blacklister. Only callable by owner.
     * @param newBlacklister - The new blacklister address.
     * @returns {Promise<SetBlacklisterStable>}
     */
    setBlacklister(newBlacklister: Address): Promise<SetBlacklisterStable>;

    /**
     * @description Sets a new pauser. Only callable by owner.
     * @param newPauser - The new pauser address.
     * @returns {Promise<SetPauserStable>}
     */
    setPauser(newPauser: Address): Promise<SetPauserStable>;

    /**
     * @description Gets the current owner address.
     * @returns {Promise<OwnerStable>}
     */
    owner(): Promise<OwnerStable>;

    /**
     * @description Gets the current minter address.
     * @returns {Promise<MinterStable>}
     */
    minter(): Promise<MinterStable>;

    /**
     * @description Gets the current blacklister address.
     * @returns {Promise<BlacklisterStable>}
     */
    blacklister(): Promise<BlacklisterStable>;

    /**
     * @description Gets the current pauser address.
     * @returns {Promise<PauserStable>}
     */
    pauser(): Promise<PauserStable>;
}
