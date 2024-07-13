import { BinaryReader, BufferHelper, NetEvent } from '@btc-vision/bsi-binary';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { ICallResultData } from './interfaces/ICallResult.js';

/**
 * Represents the result of a contract call.
 * @category Contracts
 */
export class CallResult<T extends ContractDecodedObjectResult = {}>
    implements Omit<ICallResultData, 'estimatedGas'>
{
    public readonly result: BinaryReader;
    public readonly events: NetEvent[];
    public readonly accessList: IAccessList;
    public calldata: Buffer | undefined;
    
    public readonly estimatedGas: bigint | undefined;

    public readonly decoded: Array<DecodedCallResult> = [];
    public properties: T = {} as T;

    constructor(callResult: ICallResultData) {
        this.events = callResult.events;
        this.accessList = callResult.accessList;

        if (callResult.estimatedGas) {
            this.estimatedGas = BigInt(callResult.estimatedGas);
        }

        this.result =
            typeof callResult.result === 'string'
                ? new BinaryReader(this.base64ToUint8Array(callResult.result))
                : callResult.result;
    }

    public setDecoded(decoded: DecodedOutput): void {
        this.properties = Object.freeze(decoded.obj) as T;

        this.decoded.push(...decoded.values);
    }

    public setCalldata(calldata: Buffer): void {
        this.calldata = calldata;
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        return BufferHelper.bufferToUint8Array(Buffer.from(base64, 'base64'));
    }
}
