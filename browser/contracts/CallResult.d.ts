import { BinaryReader, NetEvent } from '@btc-vision/bsi-binary';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { ICallResultData } from './interfaces/ICallResult.js';
export declare class CallResult implements ICallResultData {
    readonly result: BinaryReader;
    readonly events: NetEvent[];
    readonly accessList: IAccessList;
    readonly decoded: Array<DecodedCallResult>;
    constructor(iCallResult: ICallResultData);
    setDecoded(decoded: Array<DecodedCallResult>): void;
    private base64ToUint8Array;
}
