import { BufferHelper } from '@btc-vision/bsi-binary';
export class StoredValue {
    constructor(iStoredValue) {
        this.pointer =
            typeof iStoredValue.pointer === 'string'
                ? this.base64ToBigInt(iStoredValue.pointer)
                : iStoredValue.pointer;
        if (iStoredValue.value instanceof Buffer) {
            this.value = iStoredValue.value;
        }
        else {
            this.value = Buffer.from(iStoredValue.value, 'base64');
        }
        this.height = BigInt(iStoredValue.height);
        this.proofs = iStoredValue.proofs || [];
    }
    base64ToBigInt(base64) {
        return BufferHelper.uint8ArrayToPointer(Buffer.from(base64, 'base64'));
    }
}
