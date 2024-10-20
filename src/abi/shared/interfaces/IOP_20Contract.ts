import { Address } from '@btc-vision/transaction';
import { AddressMap } from '@btc-vision/transaction/src/deterministic/AddressMap.js';
import { CallResult } from '../../../contracts/CallResult.js';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_NETContract } from './IOP_NETContract.js';

/**
 * @description This interface represents the OP_20 base contract.
 * @interface IOP_20Contract
 * @extends {IOP_NETContract}
 * @cathegory Contracts
 *
 * @example
 * import { Address } from '@btc-vision/transaction';
 * import { IOP_20Contract } from '../abi/shared/interfaces/IOP_20Contract.js';
 * import { OP_20_ABI } from '../abi/shared/json/OP_20_ABI.js';
 * import { CallResult } from '../contracts/CallResult.js';
 * import { getContract } from '../contracts/Contract.js';
 * import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
 *
 * const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org');
 * const contract: IOP_20Contract = getContract<IOP_20Contract>(
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
 * if ('error' in balanceExample) throw new Error('Error in fetching balance');
 * console.log('Balance:', balanceExample.decoded);
 */

type Name = BaseContractProperty & CallResult<{ name: string }>;
type BalanceOf = BaseContractProperty & CallResult<{ balance: bigint }>;
type SymbolOf = BaseContractProperty & CallResult<{ symbol: string }>;
type TotalSupply = BaseContractProperty & CallResult<{ totalSupply: bigint }>;
type MaxSupply = BaseContractProperty & CallResult<{ maxSupply: bigint }>;
type Decimals = BaseContractProperty & CallResult<{ decimals: bigint }>;

type Transfer = BaseContractProperty & CallResult<{ success: boolean }>;
type TransferFrom = BaseContractProperty & CallResult<{ success: boolean }>;
type Approve = BaseContractProperty & CallResult<{ success: boolean }>;
type Allowance = BaseContractProperty & CallResult<{ allowance: bigint }>;
type Burn = BaseContractProperty & CallResult<{ success: boolean }>;
type Mint = BaseContractProperty & CallResult<{ success: boolean }>;
type Airdrop = BaseContractProperty & CallResult<{ success: boolean }>;
type AirdropWithAmount = BaseContractProperty & CallResult<{ success: boolean }>;

export interface IOP_20Contract extends IOP_NETContract {
    balanceOf(account: Address): Promise<BalanceOf>;

    name(): Promise<Name>;

    symbol(): Promise<SymbolOf>;

    totalSupply(): Promise<TotalSupply>;

    maxSupply(): Promise<MaxSupply>;

    decimals(): Promise<Decimals>;

    transfer(recipient: Address, amount: bigint): Promise<Transfer>;

    transferFrom(sender: Address, recipient: Address, amount: bigint): Promise<TransferFrom>;

    approve(spender: Address, amount: bigint): Promise<Approve>;

    allowance(owner: Address, spender: Address): Promise<Allowance>;

    burn(value: bigint): Promise<Burn>;

    mint(value: bigint): Promise<Mint>;

    airdrop(tuple: AddressMap<bigint>): Promise<Airdrop>;

    airdropWithAmount(amount: bigint, addresses: Address[]): Promise<AirdropWithAmount>;
}
