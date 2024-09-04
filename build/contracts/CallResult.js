import { BinaryReader, BufferHelper } from '@btc-vision/bsi-binary';
export class CallResult {
    constructor(callResult) {
        this.decoded = [];
        this.properties = {};
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
    setDecoded(decoded) {
        this.properties = Object.freeze(decoded.obj);
        this.decoded.push(...decoded.values);
    }
    setCalldata(calldata) {
        this.calldata = calldata;
    }
    base64ToUint8Array(base64) {
        return BufferHelper.bufferToUint8Array(Buffer.from(base64, 'base64'));
    }
}
