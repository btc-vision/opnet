import { NetEvent } from '@btc-vision/bsi-binary';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';
export interface IDecodedEvent extends NetEvent {
    readonly values: Array<DecodedCallResult>;
}
export declare class OPNetEvent<T extends ContractDecodedObjectResult = {}> extends NetEvent implements IDecodedEvent {
    readonly eventType: string;
    readonly eventDataSelector: bigint;
    readonly eventData: Uint8Array;
    properties: T;
    values: Array<DecodedCallResult>;
    constructor(eventType: string, eventDataSelector: bigint, eventData: Uint8Array);
    setDecoded(decoded: DecodedOutput): void;
}
