import { BinaryReader, BufferHelper, NetEvent } from '@btc-vision/bsi-binary';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { ICallResultData } from './interfaces/ICallResult.js';

/**
 * Represents the result of a contract call.
 * @category Contracts
 */
export class CallResult implements ICallResultData {
    public readonly result: BinaryReader;
    public readonly events: NetEvent[];
    public readonly accessList: IAccessList;

    public readonly decoded: Array<DecodedCallResult> = [];
    public properties: ContractDecodedObjectResult = {};

    constructor(iCallResult: ICallResultData) {
        this.events = iCallResult.events;
        this.accessList = iCallResult.accessList;

        this.result =
            typeof iCallResult.result === 'string'
                ? new BinaryReader(this.base64ToUint8Array(iCallResult.result))
                : iCallResult.result;
    }

    public setDecoded(decoded: DecodedOutput): void {
        this.properties = Object.freeze(decoded.obj);

        this.decoded.push(...decoded.values);
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        return BufferHelper.bufferToUint8Array(Buffer.from(base64, 'base64'));
    }
}
