import { NetEvent } from '@btc-vision/transaction';
import {
    ContractEvents,
    ITransactionReceipt,
    NetEventDocument,
    RawContractEvents,
} from '../interfaces/ITransactionReceipt.js';

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
    public readonly events: ContractEvents;

    /**
     * @description If the transaction was reverted, this field will contain the revert message.
     */
    public readonly revert?: Buffer;

    constructor(receipt: ITransactionReceipt) {
        this.receipt = receipt.receipt
            ? Buffer.from(receipt.receipt as string, 'base64')
            : undefined;

        this.receiptProofs = receipt.receiptProofs || [];

        this.events = receipt.events ? this.parseEvents(receipt.events) : {};
        this.revert = receipt.revert ? Buffer.from(receipt.revert as string, 'base64') : undefined;
    }

    /**
     * @description Parse transaction events.
     * @param events - The events to parse.
     * @private
     */
    private parseEvents(events: RawContractEvents | ContractEvents): ContractEvents {
        const parsedEvents: ContractEvents = {};

        if (!Array.isArray(events)) {
            for (const [key, value] of Object.entries(events)) {
                parsedEvents[key] = (value as NetEventDocument[]).map((event: NetEventDocument) => {
                    return this.decodeEvent(event);
                });
            }
        } else {
            for (const event of events) {
                const parsedEvent = this.decodeEvent(event);
                const contractAddress = event.contractAddress;

                if (!parsedEvents[contractAddress]) {
                    parsedEvents[contractAddress] = [];
                }

                parsedEvents[contractAddress].push(parsedEvent);
            }
        }

        return parsedEvents;
    }

    private decodeEvent(event: NetEventDocument): NetEvent {
        let eventData: Uint8Array;

        if (typeof event.data === 'string') {
            eventData = new Uint8Array(Buffer.from(event.data, 'base64'));
        } else {
            eventData = event.data;
        }

        return new NetEvent(event.type, eventData);
    }
}
