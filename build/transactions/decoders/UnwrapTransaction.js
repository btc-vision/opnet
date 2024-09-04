import { InteractionTransaction } from './InteractionTransaction.js';
export class UnwrapTransaction extends InteractionTransaction {
    constructor(transaction) {
        super(transaction);
        this.authorizedBy = transaction.authorizedBy;
        this.usedUTXOs = transaction.usedUTXOs;
        this.consolidatedVault = this.decodePartialWBTCUTXODocument(transaction.consolidatedVault);
        this.unwrapAmount = BigInt(transaction.unwrapAmount);
        this.requestedAmount = BigInt(transaction.requestedAmount);
    }
    decodePartialWBTCUTXODocument(document) {
        if (!document) {
            return undefined;
        }
        console.log(document);
        return {
            vault: document.vault,
            hash: document.hash,
            value: BigInt(document.value),
            outputIndex: document.outputIndex,
            output: Buffer.from(document.output, 'base64'),
        };
    }
}
