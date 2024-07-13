import { BinaryReader, NetEvent } from '@btc-vision/bsi-binary';
import { IAccessList } from './IAccessList.js';
export interface ICallRequestError {
    readonly error: string;
}
export interface ICallResultData {
    readonly result: string | BinaryReader;
    readonly events: NetEvent[];
    readonly accessList: IAccessList;
    readonly estimatedGas?: string;
}
export type ICallResult = ICallRequestError | ICallResultData;
