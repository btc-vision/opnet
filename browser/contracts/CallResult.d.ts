import { NetEvent } from '@btc-vision/bsi-binary';
import { BufferReader } from 'bitcoinjs-lib/src/bufferutils.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { ICallResultData } from './interfaces/ICallResult.js';
export declare class CallResult implements ICallResultData {
    readonly result: BufferReader;
    readonly events: NetEvent[];
    readonly accessList: IAccessList;
    constructor(iCallResult: ICallResultData);
}
