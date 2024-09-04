import { script } from 'bitcoinjs-lib';
export class TransactionOutput {
    constructor(data) {
        this.value = this.convertValue(data.value);
        this.index = data.index;
        this.scriptPubKey = data.scriptPubKey;
        this.script = script.decompile(Buffer.from(this.scriptPubKey.hex, 'hex'));
    }
    convertValue(value) {
        return BigInt(value);
    }
}
