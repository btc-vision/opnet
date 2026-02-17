import { BinaryReader, LoadedStorage, NetEvent } from '@btc-vision/transaction';
import { IAccessList } from './IAccessList.js';

/**
 * @description This interface is used to define the call request error.
 * @interface ICallRequestError
 * @category Interfaces
 */
export interface ICallRequestError {
    readonly error: string;
}

export interface RawNetEvent {
    readonly type: string;
    readonly data: string;
}

export interface RawEventList {
    readonly [key: string]: RawNetEvent[];
}

export interface EventList {
    [key: string]: NetEvent[];
}

/**
 * @description This interface is used to define the call result data.
 * @interface ICallResultData
 * @category Interfaces
 */
export interface ICallResultData {
    readonly result: string | Uint8Array | BinaryReader;
    readonly events: RawEventList;
    readonly accessList: IAccessList;
    readonly revert?: string;
    readonly estimatedGas?: string;
    readonly specialGas?: string;
    readonly loadedStorage?: LoadedStorage;
}

/**
 * @description This type is used to define the call result.
 * @type ICallResult
 * @category Interfaces
 */
export type ICallResult = ICallRequestError | ICallResultData;
