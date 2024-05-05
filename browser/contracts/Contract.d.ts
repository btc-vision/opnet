import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BitcoinInterface } from '../abi/BitcoinInterface.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinInterfaceAbi } from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { IContract } from './interfaces/IContract.js';
declare const internal: unique symbol;
export declare class IBaseContract<T extends BaseContractProperties> implements IContract {
    readonly address: BitcoinAddressLike;
    readonly interface: BitcoinInterface;
    readonly provider: AbstractRpcProvider;
    readonly [internal]: keyof T | undefined;
    private events;
    constructor(address: BitcoinAddressLike, abi: BitcoinInterface | BitcoinInterfaceAbi, provider: AbstractRpcProvider);
    protected getFunction(name: symbol): BaseContractProperty | undefined | string | number | symbol;
    private defineInternalFunctions;
    private encodeFunctionData;
    private encodeInput;
    private decodeOutput;
    private callFunction;
}
export declare class BaseContract<T extends BaseContractProperties> extends IBaseContract<T> {
    constructor(address: BitcoinAddressLike, abi: BitcoinInterface | BitcoinInterfaceAbi, provider: AbstractRpcProvider);
    private proxify;
}
export declare function getContract<T extends BaseContractProperties>(address: BitcoinAddressLike, abi: BitcoinInterface | BitcoinInterfaceAbi, provider: AbstractRpcProvider): BaseContract<T> & Omit<T, keyof BaseContract<T>>;
export {};
