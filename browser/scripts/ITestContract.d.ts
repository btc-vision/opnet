import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinInterfaceAbi } from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';
export interface WBTCContract extends BaseContractProperties {
    balanceOf(address: BitcoinAddressLike): Promise<BaseContractProperty>;
    owner(): Promise<BaseContractProperty>;
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
    isAddressOwner(address: BitcoinAddressLike): Promise<BaseContractProperty>;
}
export declare const wBTCAbi: BitcoinInterfaceAbi;
