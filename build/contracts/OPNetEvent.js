import { NetEvent } from '@btc-vision/bsi-binary';
export class OPNetEvent extends NetEvent {
    constructor(eventType, eventDataSelector, eventData) {
        super(eventType, eventDataSelector, eventData);
        this.eventType = eventType;
        this.eventDataSelector = eventDataSelector;
        this.eventData = eventData;
        this.properties = {};
        this.values = [];
    }
    setDecoded(decoded) {
        this.properties = Object.freeze(decoded.obj);
        this.values.push(...decoded.values);
    }
}
