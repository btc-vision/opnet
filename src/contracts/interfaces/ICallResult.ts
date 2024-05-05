import { NetEvent } from '@btc-vision/bsi-binary';
import { BufferReader } from 'bitcoinjs-lib/src/bufferutils.js';
import { IAccessList } from './IAccessList.js';

export interface ICallRequestError {
    readonly error: string;
}

export interface ICallResultData {
    readonly result: string | BufferReader;
    readonly events: NetEvent[];
    readonly accessList: IAccessList;
}

export type ICallResult = ICallRequestError | ICallResultData;
