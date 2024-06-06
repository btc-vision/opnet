import { NetEvent } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BitcoinInterface } from '../abi/BitcoinInterface.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinInterfaceAbi } from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike, DecodedCallResult } from '../common/CommonTypes.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { ContractEvents } from '../transactions/interfaces/ITransactionReceipt.js';
import { IContract } from './interfaces/IContract.js';
import { OPNetEvent } from './OPNetEvent.js';
declare const internal: unique symbol;
export type ContractDecodedObjectResult = {
    [key: string]: DecodedCallResult;
};
export type DecodedOutput = {
    values: Array<DecodedCallResult>;
    obj: ContractDecodedObjectResult;
};
export declare abstract class IBaseContract<T extends BaseContractProperties> implements IContract {
    readonly address: BitcoinAddressLike;
    readonly interface: BitcoinInterface;
    readonly provider: AbstractRpcProvider;
    readonly [internal]: keyof T | undefined;
    private events;
    protected constructor(address: BitcoinAddressLike, abi: BitcoinInterface | BitcoinInterfaceAbi, provider: AbstractRpcProvider);
    decodeEvents(events: NetEvent[] | ContractEvents): OPNetEvent[];
    decodeEvent(event: NetEvent): OPNetEvent;
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
