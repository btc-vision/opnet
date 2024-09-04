import { NetEvent } from '@btc-vision/bsi-binary';
export class TransactionReceipt {
    constructor(receipt) {
        this.receipt = receipt.receipt
            ? Buffer.from(receipt.receipt, 'base64')
            : undefined;
        this.receiptProofs = receipt.receiptProofs || [];
        this.events = receipt.events ? this.parseEvents(receipt.events) : {};
        this.revert = receipt.revert ? Buffer.from(receipt.revert, 'base64') : undefined;
    }
    parseEvents(events) {
        const parsedEvents = {};
        if (!Array.isArray(events)) {
            for (const [key, value] of Object.entries(events)) {
                parsedEvents[key] = value.map((event) => {
                    return this.decodeEvent(event);
                });
            }
        }
        else {
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
    decodeEvent(event) {
        let eventData;
        let eventDataSelector;
        if (typeof event.eventData === 'string') {
            eventData = new Uint8Array(Buffer.from(event.eventData, 'base64'));
        }
        else {
            eventData = event.eventData;
        }
        if (typeof event.eventDataSelector === 'string') {
            eventDataSelector = BigInt(event.eventDataSelector);
        }
        else {
            eventDataSelector = event.eventDataSelector;
        }
        return new NetEvent(event.eventType, eventDataSelector, eventData);
    }
}
