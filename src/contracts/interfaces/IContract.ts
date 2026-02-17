import { Address, NetEvent } from '@btc-vision/transaction';
import { BlockGasParameters } from '../../block/BlockGasParameters.js';
import { ContractEvents } from '../../transactions/interfaces/ITransactionReceipt.js';
import { OPNetEvent } from '../OPNetEvent.js';
import { IAccessList } from './IAccessList.js';
import { ParsedSimulatedTransaction } from './SimulatedTransaction.js';

/**
 * @description This interface is used to define a contract.
 * @interface IContract
 * @category Contracts
 */
export interface IContract {
    readonly address: Address | string;

    get p2op(): string;

    currentGasParameters(): Promise<BlockGasParameters>;

    setSender(sender: Address): void;

    decodeEvents(events: NetEvent[] | ContractEvents): OPNetEvent[];

    decodeEvent(event: NetEvent): OPNetEvent;

    encodeCalldata(method: string, ...args: unknown[]): Uint8Array;

    setSimulatedHeight(height: bigint | undefined): void;

    setTransactionDetails(tx: ParsedSimulatedTransaction): void;

    setAccessList(accessList: IAccessList): void;
}
