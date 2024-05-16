import { NetEvent } from '@btc-vision/bsi-binary';
import { ITransactionReceipt, NetEventDocument } from './interfaces/ITransactionReceipt.js';

/**
 * Transaction receipt
 * @category Transactions
 */
export class TransactionReceipt implements ITransactionReceipt {
    /**
     * @description The receipt of the transaction.
     */
    public readonly receipt?: Buffer;

    /**
     * @description The receipt proofs of the transaction.
     */
    public readonly receiptProofs: string[];

    /**
     * @description The events of the transaction.
     */
    public readonly events: NetEvent[];

    /**
     * @description If the transaction was reverted, this field will contain the revert message.
     */
    public readonly revert?: Buffer;

    constructor(receipt: ITransactionReceipt) {
        this.receipt = receipt.receipt
            ? Buffer.from(receipt.receipt as string, 'base64')
            : undefined;

        this.receiptProofs = receipt.receiptProofs || [];

        this.events = receipt.events ? this.parseEvents(receipt.events) : [];
        this.revert = receipt.revert ? Buffer.from(receipt.revert as string, 'base64') : undefined;
    }

    /**
     * @description Parse transaction events.
     * @param events - The events to parse.
     * @private
     */
    private parseEvents(events: NetEventDocument[] | NetEvent[]): NetEvent[] {
        return events.map((event: NetEventDocument | NetEvent) => {
            let eventData: Uint8Array;
            let eventDataSelector: bigint;

            if (typeof event.eventData === 'string') {
                eventData = new Uint8Array(Buffer.from(event.eventData, 'base64'));
            } else {
                eventData = event.eventData;
            }

            if (typeof event.eventDataSelector === 'string') {
                eventDataSelector = BigInt(event.eventDataSelector);
            } else {
                eventDataSelector = event.eventDataSelector;
            }

            return new NetEvent(event.eventType, eventDataSelector, eventData);
        });
    }
}
