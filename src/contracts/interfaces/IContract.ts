import { Address, NetEvent } from '@btc-vision/transaction';
import { ContractEvents } from '../../transactions/interfaces/ITransactionReceipt.js';
import { OPNetEvent } from '../OPNetEvent.js';

/**
 * @description This interface is used to define a contract.
 * @interface IContract
 * @category Contracts
 */
export interface IContract {
    readonly address: Address | string;

    get p2trOrTweaked(): string;
    
    setSender(sender: Address): void;

    decodeEvents(events: NetEvent[] | ContractEvents): OPNetEvent[];

    decodeEvent(event: NetEvent): OPNetEvent;

    encodeCalldata(method: string, ...args: unknown[]): Buffer;
}
