import { BinaryReader, NetEvent } from '@btc-vision/bsi-binary';
import { IAccessList } from './IAccessList.js';

/**
 * @description This interface is used to define the call request error.
 * @interface ICallRequestError
 * @category Interfaces
 */
export interface ICallRequestError {
    readonly error: string;
}

/**
 * @description This interface is used to define the call result data.
 * @interface ICallResultData
 * @category Interfaces
 */
export interface ICallResultData {
    readonly result: string | BinaryReader;
    readonly events: NetEvent[];
    readonly accessList: IAccessList;
    readonly revert?: string;
    readonly estimatedGas?: string;
}

/**
 * @description This type is used to define the call result.
 * @type ICallResult
 * @category Interfaces
 */
export type ICallResult = ICallRequestError | ICallResultData;
