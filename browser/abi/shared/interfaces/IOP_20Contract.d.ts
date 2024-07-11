import { BitcoinAddressLike } from '../../../common/CommonTypes.js';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_NETContract } from './IOP_NETContract.js';
export interface IOP_20Contract extends IOP_NETContract {
    balanceOf(address: BitcoinAddressLike): Promise<BaseContractProperty>;
    name(): Promise<BaseContractProperty>;
    symbol(): Promise<BaseContractProperty>;
    totalSupply(): Promise<BaseContractProperty>;
    decimals(): Promise<BaseContractProperty>;
    transfer(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;
    transferFrom(from: BitcoinAddressLike, to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;
    approve(spender: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;
    allowance(owner: BitcoinAddressLike, spender: BitcoinAddressLike): Promise<BaseContractProperty>;
    mint(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;
    burn(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;
}
