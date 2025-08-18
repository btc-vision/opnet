import { Address, AddressMap } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP_NETContract } from './IOP_NETContract.js';

export type MintedEvent = {
    to: Address;
    amount: bigint;
};

export type TransferredEvent = {
    from: Address;
    to: Address;
    amount: bigint;
};

export type BurnedEvent = {
    from: Address;
    amount: bigint;
};

export type ApprovedEvent = {
    owner: Address;
    spender: Address;
    value: bigint;
};

export type Name = CallResult<{ name: string }, []>;
export type BalanceOf = CallResult<{ balance: bigint }, []>;
export type SymbolOf = CallResult<{ symbol: string }, []>;
export type TotalSupply = CallResult<{ totalSupply: bigint }, []>;
export type MaxSupply = CallResult<{ maximumSupply: bigint }, []>;
export type Decimals = CallResult<{ decimals: number }, []>;
export type TokenIcon = CallResult<{ icon: string }, []>;
export type DomainSeparator = CallResult<{ domainSeparator: Uint8Array }, []>;
export type NonceOf = CallResult<{ nonce: bigint }, []>;
export type TokenMetadata = CallResult<
    {
        name: string;
        symbol: string;
        decimals: number;
        maximumSupply: bigint;
        icon: string;
        domainSeparator: Uint8Array;
        nonce: bigint;
    },
    []
>;

export type SafeTransfer = CallResult<{}, [OPNetEvent<TransferredEvent>]>;
export type SafeTransferFrom = CallResult<{}, [OPNetEvent<TransferredEvent>]>;
export type IncreaseAllowance = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;
export type DecreaseAllowance = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;
export type IncreaseAllowanceBySignature = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;
export type DecreaseAllowanceBySignature = CallResult<{}, [OPNetEvent<ApprovedEvent>]>;
export type Allowance = CallResult<{ remaining: bigint }, []>;
export type Burn = CallResult<{}, [OPNetEvent<BurnedEvent>]>;
export type Mint = CallResult<{}, [OPNetEvent<MintedEvent>]>;
export type Airdrop = CallResult<{}, OPNetEvent<MintedEvent>[]>;
export type AirdropWithAmount = CallResult<{}, OPNetEvent<MintedEvent>[]>;

/**
 * @description This interface represents the OP20 base contract.
 * @interface IOP20Contract
 * @extends {IOP_NETContract}
 * @cathegory Contracts
 *
 * @example
 * import { Address } from '@btc-vision/transaction';
 * import { IOP20Contract } from '../abi/shared/interfaces/IOP20Contract.js';
 * import { OP_20_ABI } from '../abi/shared/json/OP_20_ABI.js';
 * import { CallResult } from '../contracts/CallResult.js';
 * import { getContract } from '../contracts/Contract.js';
 * import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
 *
 * const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org');
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
    balanceOf(account: Address): Promise<BalanceOf>;

    name(): Promise<Name>;

    symbol(): Promise<SymbolOf>;

    totalSupply(): Promise<TotalSupply>;

    maximumSupply(): Promise<MaxSupply>;

    domainSeparator(): Promise<DomainSeparator>;

    nonceOf(owner: Address): Promise<NonceOf>;

    decimals(): Promise<Decimals>;

    icon(): Promise<TokenIcon>;

    safeTransfer(to: Address, amount: bigint, data: Uint8Array): Promise<SafeTransfer>;

    safeTransferFrom(
        from: Address,
        to: Address,
        amount: bigint,
        data: Uint8Array,
    ): Promise<SafeTransferFrom>;

    increaseAllowance(spender: Address, amount: bigint): Promise<IncreaseAllowance>;

    decreaseAllowance(spender: Address, amount: bigint): Promise<DecreaseAllowance>;

    metadata(): Promise<TokenMetadata>;

    increaseAllowanceBySignature(
        owner: Address,
        spender: Address,
        amount: bigint,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<IncreaseAllowanceBySignature>;

    decreaseAllowanceBySignature(
        owner: Address,
        spender: Address,
        amount: bigint,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<DecreaseAllowanceBySignature>;

    allowance(owner: Address, spender: Address): Promise<Allowance>;

    burn(value: bigint): Promise<Burn>;

    mint(address: Address, value: bigint): Promise<Mint>;

    airdrop(map: AddressMap<bigint>): Promise<Airdrop>;

    airdropWithAmount(amount: bigint, addresses: Address[]): Promise<AirdropWithAmount>;
}
