import {
    BinaryReader,
    BufferHelper,
    IInteractionParameters,
    NetEvent,
    TransactionFactory,
    UTXO,
} from '@btc-vision/transaction';
import { Network, Signer } from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { RequestUTXOsParamsWithAmount } from '../utxos/interfaces/IUTXOsManager.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { EventList, ICallResultData, RawEventList } from './interfaces/ICallResult.js';
import { OPNetEvent } from './OPNetEvent.js';

const factory = new TransactionFactory();

export interface TransactionParameters {
    readonly signer: Signer | ECPairInterface;
    readonly refundTo: string;
    readonly priorityFee?: bigint;
    readonly feeRate?: number;
    readonly utxos?: UTXO[];
    readonly maximumAllowedSatToSpend: bigint;
    readonly network: Network;
}

export interface InteractionTransactionReceipt {
    readonly transactionId: string;
    readonly newUTXOs: UTXO[];
    readonly peerAcknowledgements: number;
}

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

    public estimatedSatGas: bigint = 0n;
    public events: OPNetEvent[] = [];

    public to: string | undefined;

    readonly #rawEvents: EventList;
    readonly #provider: AbstractRpcProvider;

    constructor(callResult: ICallResultData, provider: AbstractRpcProvider) {
        this.#rawEvents = this.parseEvents(callResult.events);
        this.accessList = callResult.accessList;
        this.#provider = provider;

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

    public setTo(to: string): void {
        this.to = to;
    }

    /**
     * Easily create a bitcoin interaction transaction from a simulated contract call.
     * @param {TransactionParameters} interactionParams - The parameters for the transaction.
     * @returns {Promise<InteractionTransactionReceipt>} The transaction hash, the transaction hex and the UTXOs used.
     */
    public async sendTransaction(
        interactionParams: TransactionParameters,
    ): Promise<InteractionTransactionReceipt> {
        if (!this.calldata) {
            throw new Error('Calldata not set');
        }

        if (!this.to) {
            throw new Error('To address not set');
        }

        const priorityFee = this.estimatedSatGas + (interactionParams.priorityFee || 0n);
        try {
            const UTXOs: UTXO[] =
                interactionParams.utxos ||
                (await this.#fetchUTXOs(
                    priorityFee + interactionParams.maximumAllowedSatToSpend,
                    interactionParams,
                ));

            const params: IInteractionParameters = {
                calldata: this.calldata,
                priorityFee: priorityFee,
                feeRate: interactionParams.feeRate || 10,
                from: interactionParams.refundTo,
                signer: interactionParams.signer,
                utxos: UTXOs,
                to: this.to,
                network: interactionParams.network,
            };

            const transaction = await factory.signInteraction(params);
            const tx1 = await this.#provider.sendRawTransaction(transaction[0], false);
            if (!tx1 || tx1.error) {
                throw new Error(`Error sending transaction: ${tx1?.error || 'Unknown error'}`);
            }

            this.#provider.utxoManager.spentUTXO(UTXOs, transaction[2]);

            const tx2 = await this.#provider.sendRawTransaction(transaction[1], false);
            if (!tx2 || tx2.error) {
                throw new Error(`Error sending transaction: ${tx2?.error || 'Unknown error'}`);
            }

            if (!tx2.result) {
                throw new Error('No transaction ID returned');
            }

            return {
                transactionId: tx2.result,
                peerAcknowledgements: tx2.peers || 0,
                newUTXOs: transaction[2],
            };
        } catch (e) {
            // We need to clean up the UTXOs if the transaction fails
            this.#provider.utxoManager.clean();

            throw e;
        }
    }

    public setGasEstimation(estimatedGas: bigint): void {
        this.estimatedSatGas = estimatedGas;
    }

    public setDecoded(decoded: DecodedOutput): void {
        this.properties = Object.freeze(decoded.obj) as T;

        this.decoded.push(...decoded.values);
    }

    public setCalldata(calldata: Buffer): void {
        this.calldata = calldata;
    }

    async #fetchUTXOs(amount: bigint, interactionParams: TransactionParameters): Promise<UTXO[]> {
        if (!interactionParams.refundTo) {
            throw new Error('Refund address not set');
        }

        const utxoSetting: RequestUTXOsParamsWithAmount = {
            address: interactionParams.refundTo,
            amount: 10000n + amount,
        };

        const utxos: UTXO[] = await this.#provider.utxoManager.getUTXOsForAmount(utxoSetting);
        if (!utxos) {
            throw new Error('No UTXOs found');
        }

        return utxos;
    }

    private parseEvents(events: RawEventList): EventList {
        const eventsList: EventList = {};

        for (const [contract, value] of Object.entries(events)) {
            const events: NetEvent[] = [];

            for (const event of value) {
                const eventData = new NetEvent(event.type, Buffer.from(event.data, 'base64'));

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
