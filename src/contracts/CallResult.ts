import { NetEvent } from '@btc-vision/bsi-binary';
import { BufferReader } from 'bitcoinjs-lib/src/bufferutils.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { ICallResultData } from './interfaces/ICallResult.js';

export class CallResult implements ICallResultData {
    public readonly result: BufferReader;
    public readonly events: NetEvent[];
    public readonly accessList: IAccessList;

    constructor(iCallResult: ICallResultData) {
        this.events = iCallResult.events;
        this.accessList = iCallResult.accessList;

        this.result =
            typeof iCallResult.result === 'string'
                ? new BufferReader(Buffer.from(iCallResult.result, 'hex'))
                : iCallResult.result;
    }
}
