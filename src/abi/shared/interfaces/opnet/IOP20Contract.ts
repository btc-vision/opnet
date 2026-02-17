import { Address, AddressMap } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP_NETContract } from './IOP_NETContract.js';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type TransferredEvent = {
    readonly operator: Address;
    readonly from: Address;
    readonly to: Address;
    readonly amount: bigint;
};

export type ApprovedEvent = {
    readonly owner: Address;
    readonly spender: Address;
    readonly amount: bigint;
};

export type BurnedEvent = {
    readonly from: Address;
    readonly amount: bigint;
};

export type MintedEvent = {
    readonly to: Address;
    readonly amount: bigint;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the name function call.
 */
export type Name = CallResult<
    {
        name: string;
    },
    []
>;

/**
 * @description Represents the result of the symbol function call.
 */
export type SymbolOf = CallResult<
    {
        symbol: string;
    },
    []
>;

/**
 * @description Represents the result of the icon function call.
 */
export type TokenIcon = CallResult<
    {
        icon: string;
    },
    []
>;

/**
 * @description Represents the result of the decimals function call.
 */
export type Decimals = CallResult<
    {
        decimals: number;
    },
    []
>;

/**
 * @description Represents the result of the totalSupply function call.
 */
export type TotalSupply = CallResult<
    {
        totalSupply: bigint;
    },
    []
>;

/**
 * @description Represents the result of the maximumSupply function call.
 */
export type MaxSupply = CallResult<
    {
        maximumSupply: bigint;
    },
    []
>;

/**
 * @description Represents the result of the domainSeparator function call.
 */
export type DomainSeparator = CallResult<
    {
        domainSeparator: Uint8Array;
    },
    []
>;

/**
 * @description Represents the result of the balanceOf function call.
 */
export type BalanceOf = CallResult<
    {
        balance: bigint;
    },
    []
>;

/**
 * @description Represents the result of the nonceOf function call.
 */
export type NonceOf = CallResult<
    {
        nonce: bigint;
    },
    []
>;

/**
 * @description Represents the result of the allowance function call.
 */
export type Allowance = CallResult<
    {
        remaining: bigint;
    },
    []
>;

/**
 * @description Represents the result of the transfer function call.
 */
export type Transfer = CallResult<{}, [OPNetEvent<TransferredEvent>]>;

/**
 * @description Represents the result of the transferFrom function call.
 */
export type TransferFrom = CallResult<{}, [OPNetEvent<TransferredEvent>]>;

/**
 * @description Represents the result of the safeTransfer function call.
 */
export type SafeTransfer = CallResult<{}, [OPNetEvent<TransferredEvent>]>;

/**
 * @description Represents the result of the safeTransferFrom function call.
 */
export type SafeTransferFrom = CallResult<{}, [OPNetEvent<TransferredEvent>]>;

/**
 * @description Represents the result of the increaseAllowance function call.
 */
export type IncreaseAllowance = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;

/**
 * @description Represents the result of the decreaseAllowance function call.
 */
export type DecreaseAllowance = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;

/**
 * @description Represents the result of the increaseAllowanceBySignature function call.
 */
export type IncreaseAllowanceBySignature = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;

/**
 * @description Represents the result of the decreaseAllowanceBySignature function call.
 */
export type DecreaseAllowanceBySignature = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;

/**
 * @description Represents the result of the burn function call.
 */
export type Burn = CallResult<{}, [OPNetEvent<BurnedEvent>]>;

/**
 * @description Represents the result of the mint function call.
 */
export type Mint = CallResult<{}, OPNetEvent<MintedEvent>[]>;

/**
 * @description Represents the result of the airdrop function call.
 */
export type Airdrop = CallResult<{}, OPNetEvent<MintedEvent>[]>;

/**
 * @description Represents the result of the metadata function call.
 */
export type TokenMetadata = CallResult<
    {
        name: string;
        symbol: string;
        icon: string;
        decimals: number;
        totalSupply: bigint;
        domainSeparator: Uint8Array;
    },
    []
>;

/**
 * @description This interface represents the OP20 base contract.
 * @interface IOP20Contract
 * @extends {IOP_NETContract}
 * @category Contracts
 *
 * @example
 * import { Address } from '@btc-vision/transaction';
 * import { IOP20Contract } from '../abi/shared/interfaces/IOP20Contract.js';
 * import { OP_20_ABI } from '../abi/shared/json/OP_20_ABI.js';
 * import { CallResult } from '../contracts/CallResult.js';
 * import { getContract } from '../contracts/Contract.js';
 * import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
 *
 * const provider: JSONRpcProvider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });
 * const contract: IOP20Contract = getContract<IOP20Contract>(
 *     'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
 *     OP_20_ABI,
 *     provider,
 *     networks.regtest,
 * );
 *
 * const address: Address = new Address([
 *    40, 11, 228, 172, 219, 50, 169, 155, 163, 235, 250, 102, 169, 29, 219, 65, 167, 183, 161, 210,
 *    254, 244, 21, 57, 153, 34, 205, 138, 4, 72, 92, 2,
 * ]);
 *
 * const balanceExample = await contract.balanceOf(
 *     address
 * );
 *
 * console.log('Balance:', balanceExample.properties.balance);
 */
export interface IOP20Contract extends IOP_NETContract {
    name(): Promise<Name>;

    symbol(): Promise<SymbolOf>;

    icon(): Promise<TokenIcon>;

    decimals(): Promise<Decimals>;

    totalSupply(): Promise<TotalSupply>;

    maximumSupply(): Promise<MaxSupply>;

    domainSeparator(): Promise<DomainSeparator>;

    balanceOf(owner: Address): Promise<BalanceOf>;

    nonceOf(owner: Address): Promise<NonceOf>;

    allowance(owner: Address, spender: Address): Promise<Allowance>;

    transfer(to: Address, amount: bigint): Promise<Transfer>;

    transferFrom(from: Address, to: Address, amount: bigint): Promise<TransferFrom>;

    safeTransfer(to: Address, amount: bigint, data: Uint8Array): Promise<SafeTransfer>;

    safeTransferFrom(
        from: Address,
        to: Address,
        amount: bigint,
        data: Uint8Array,
    ): Promise<SafeTransferFrom>;

    increaseAllowance(spender: Address, amount: bigint): Promise<IncreaseAllowance>;

    decreaseAllowance(spender: Address, amount: bigint): Promise<DecreaseAllowance>;

    increaseAllowanceBySignature(
        owner: Uint8Array,
        ownerTweakedPublicKey: Uint8Array,
        spender: Address,
        amount: bigint,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<IncreaseAllowanceBySignature>;

    decreaseAllowanceBySignature(
        owner: Uint8Array,
        ownerTweakedPublicKey: Uint8Array,
        spender: Address,
        amount: bigint,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<DecreaseAllowanceBySignature>;

    burn(amount: bigint): Promise<Burn>;

    metadata(): Promise<TokenMetadata>;

    mint(address: Address, amount: bigint): Promise<Mint>;

    airdrop(addressAndAmount: AddressMap<bigint>): Promise<Airdrop>;
}
