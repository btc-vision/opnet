import { fromBase64, Network } from '@btc-vision/bitcoin';
import { NetEvent } from '@btc-vision/transaction';
import { getP2op } from '../../cache/P2OPCache.js';
import { decodeRevertData } from '../../utils/RevertDecoder.js';
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
    public readonly receipt?: Uint8Array;

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
    public readonly rawRevert?: Uint8Array;

    public readonly revert?: string;

    /**
     * @description Whether the transaction failed (reverted) or not.
     */
    public readonly failed: boolean = false;

    public readonly gasUsed: bigint;
    public readonly specialGasUsed: bigint;

    constructor(receipt: ITransactionReceipt, network: Network) {
        this.receipt = receipt.receipt ? fromBase64(receipt.receipt as string) : undefined;

        this.receiptProofs = receipt.receiptProofs || [];
        this.events = receipt.events ? this.parseEvents(receipt.events, network) : {};

        this.rawRevert = receipt.revert ? fromBase64(receipt.revert as string) : undefined;

        this.revert = this.rawRevert ? decodeRevertData(this.rawRevert) : undefined;
        this.failed = receipt.revert !== undefined && receipt.revert !== null;

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
                const caP2op = getP2op(key, network);
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
                const caP2op = getP2op(contractAddress, network);

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
            eventData = fromBase64(event.data);
        } else {
            eventData = event.data;
        }

        return new NetEvent(event.type, eventData);
    }
}
