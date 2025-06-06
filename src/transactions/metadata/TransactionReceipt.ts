import { Network } from '@btc-vision/bitcoin';
import { Address, NetEvent } from '@btc-vision/transaction';
import { CallResult } from '../../contracts/CallResult.js';
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

    public readonly rawEvents: ContractEvents = {};

    /**
     * @description If the transaction was reverted, this field will contain the revert message.
     */
    public readonly rawRevert?: Buffer;

    public readonly revert?: string;

    public readonly gasUsed: bigint;
    public readonly specialGasUsed: bigint;

    constructor(receipt: ITransactionReceipt, network: Network) {
        this.receipt = receipt.receipt
            ? Buffer.from(receipt.receipt as string, 'base64')
            : undefined;

        this.receiptProofs = receipt.receiptProofs || [];

        this.events = receipt.events ? this.parseEvents(receipt.events, network) : {};

        this.rawRevert = receipt.revert
            ? Buffer.from(receipt.revert as string, 'base64')
            : undefined;

        this.revert = this.rawRevert ? CallResult.decodeRevertData(this.rawRevert) : undefined;

        this.gasUsed = BigInt(receipt.gasUsed || '0x00') || 0n;
        this.specialGasUsed = BigInt(receipt.specialGasUsed || '0x00') || 0n;
    }

    /**
     * @description Parse transaction events.
     * @param events - The events to parse.
     * @param network - The network to use.
     * @private
     */
    private parseEvents(
        events: RawContractEvents | ContractEvents,
        network: Network,
    ): ContractEvents {
        const parsedEvents: ContractEvents = {};
        if (!Array.isArray(events)) {
            for (const [key, value] of Object.entries(events)) {
                const ca = Address.fromString(key);
                const caP2op = ca.p2op(network);
                const v = (value as NetEventDocument[]).map((event: NetEventDocument) => {
                    return this.decodeEvent(event);
                });

                parsedEvents[caP2op] = v;

                this.rawEvents[key] = v;
            }
        } else {
            for (const event of events) {
                const parsedEvent = this.decodeEvent(event);
                const contractAddress = event.contractAddress;

                // TODO: Add a weak cache to avoid parsing the same address multiple times?
                const ca = Address.fromString(contractAddress);
                const caP2op = ca.p2op(network);

                if (!parsedEvents[caP2op]) {
                    parsedEvents[caP2op] = [];
                }

                if (!parsedEvents[caP2op]) {
                    parsedEvents[caP2op] = [];
                }

                parsedEvents[caP2op].push(parsedEvent);

                if (!this.rawEvents[contractAddress]) {
                    this.rawEvents[contractAddress] = [];
                }

                this.rawEvents[contractAddress].push(parsedEvent);
            }
        }

        return parsedEvents;
    }

    private decodeEvent(event: NetEventDocument): NetEvent {
        let eventData: Uint8Array;
        if (typeof event.data === 'string') {
            const buf = Buffer.from(event.data, 'base64');
            eventData = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
        } else {
            eventData = event.data;
        }

        return new NetEvent(event.type, eventData);
    }
}
