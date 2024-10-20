import { NetEvent } from '@btc-vision/transaction';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';

export interface IDecodedEvent extends NetEvent {
    readonly values: Array<DecodedCallResult>;
}

/**
 * An OPNet Contract event. This class is used to represent an event that has been decoded.
 * @category Contracts
 */
export class OPNetEvent<T extends ContractDecodedObjectResult = {}>
    extends NetEvent
    implements IDecodedEvent
{
    public properties: T = {} as T;
    public values: Array<DecodedCallResult> = [];

    constructor(
        public readonly eventType: string,
        public readonly eventData: Uint8Array,
    ) {
        super(eventType, eventData);
    }

    public setDecoded(decoded: DecodedOutput): void {
        this.properties = Object.freeze(decoded.obj) as T;

        this.values.push(...decoded.values);
    }
}
