import { BinaryReader, BufferHelper, NetEvent } from '@btc-vision/transaction';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { EventList, ICallResultData, RawEventList } from './interfaces/ICallResult.js';
import { OPNetEvent } from './OPNetEvent.js';

/**
 * Represents the result of a contract call.
 * @category Contracts
 */
export class CallResult<T extends ContractDecodedObjectResult = {}>
    implements Omit<ICallResultData, 'estimatedGas' | 'events'>
{
    public readonly result: BinaryReader;
    public readonly accessList: IAccessList;
    public readonly revert: string | undefined;

    public calldata: Buffer | undefined;
    public readonly estimatedGas: bigint | undefined;

    public readonly decoded: Array<DecodedCallResult> = [];
    public properties: T = {} as T;

    public events: OPNetEvent[] = [];

    readonly #rawEvents: EventList;

    constructor(callResult: ICallResultData) {
        this.#rawEvents = this.parseEvents(callResult.events);
        this.accessList = callResult.accessList;

        if (callResult.estimatedGas) {
            this.estimatedGas = BigInt(callResult.estimatedGas);
        }

        this.revert = callResult.revert;

        this.result =
            typeof callResult.result === 'string'
                ? new BinaryReader(this.base64ToUint8Array(callResult.result))
                : callResult.result;
    }

    public get rawEvents(): EventList {
        return this.#rawEvents;
    }

    public setDecoded(decoded: DecodedOutput): void {
        this.properties = Object.freeze(decoded.obj) as T;

        this.decoded.push(...decoded.values);
    }

    public setCalldata(calldata: Buffer): void {
        this.calldata = calldata;
    }

    private parseEvents(events: RawEventList): EventList {
        const eventsList: EventList = {};

        for (const [contract, value] of Object.entries(events)) {
            const events: NetEvent[] = [];

            for (const event of value) {
                const eventData = new NetEvent(
                    event.eventType,
                    Buffer.from(event.eventData, 'base64'),
                );

                events.push(eventData);
            }

            eventsList[contract] = events;
        }

        return eventsList;
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        return BufferHelper.bufferToUint8Array(Buffer.from(base64, 'base64'));
    }
}
