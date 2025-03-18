import { Network, PsbtOutputExtended, Signer } from '@btc-vision/bitcoin';
import {
    Address,
    BinaryReader,
    BufferHelper,
    IInteractionParameters,
    InteractionParametersWithoutSigner,
    NetEvent,
    TransactionFactory,
    UTXO,
} from '@btc-vision/transaction';
import { ECPairInterface } from 'ecpair';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { RequestUTXOsParamsWithAmount } from '../utxos/interfaces/IUTXOsManager.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { EventList, ICallResultData, RawEventList } from './interfaces/ICallResult.js';
import { OPNetEvent } from './OPNetEvent.js';

const factory = new TransactionFactory();

export interface TransactionParameters {
    readonly signer?: Signer | ECPairInterface;
    readonly refundTo: string;
    readonly priorityFee?: bigint;
    readonly feeRate?: number;
    readonly utxos?: UTXO[];
    readonly maximumAllowedSatToSpend: bigint;
    readonly network: Network;

    readonly extraOutputs?: PsbtOutputExtended[];
}

export interface InteractionTransactionReceipt {
    readonly transactionId: string;
    readonly newUTXOs: UTXO[];
    readonly peerAcknowledgements: number;
    readonly estimatedFees: bigint;
    readonly preimage: string;
}

/**
 * Represents the result of a contract call.
 * @category Contracts
 */
export class CallResult<
    T extends ContractDecodedObjectResult = {},
    U extends OPNetEvent<ContractDecodedObjectResult>[] = OPNetEvent<ContractDecodedObjectResult>[],
> implements Omit<ICallResultData, 'estimatedGas' | 'events'>
{
    public readonly result: BinaryReader;
    public readonly accessList: IAccessList;
    public readonly revert: string | undefined;

    public calldata: Buffer | undefined;
    public readonly estimatedGas: bigint | undefined;

    public properties: T = {} as T;

    public estimatedSatGas: bigint = 0n;
    public events: U = [] as unknown as U;

    public to: string | undefined;

    readonly #rawEvents: EventList;
    readonly #provider: AbstractRpcProvider;

    constructor(callResult: ICallResultData, provider: AbstractRpcProvider) {
        this.#provider = provider;
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

    public setTo(to: string): void {
        this.to = to;
    }

    /**
     * Easily create a bitcoin interaction transaction from a simulated contract call.
     * @param {TransactionParameters} interactionParams - The parameters for the transaction.
     * @param amountAddition
     * @returns {Promise<InteractionTransactionReceipt>} The transaction hash, the transaction hex and the UTXOs used.
     */
    public async sendTransaction(
        interactionParams: TransactionParameters,
        amountAddition: bigint = 0n,
    ): Promise<InteractionTransactionReceipt> {
        if (!this.calldata) {
            throw new Error('Calldata not set');
        }

        if (!this.to) {
            throw new Error('To address not set');
        }

        if (this.revert) {
            throw new Error(`Can not send transaction! Simulation reverted: ${this.revert}`);
        }

        const addedOutputs = interactionParams.extraOutputs || [];
        const totalAmount = BigInt(addedOutputs.reduce((acc, output) => acc + output.value, 0));

        const priorityFee = interactionParams.priorityFee || 0n;
        const totalFee: bigint = this.estimatedSatGas + priorityFee;
        try {
            const UTXOs: UTXO[] =
                interactionParams.utxos ||
                (await this.#fetchUTXOs(
                    totalFee +
                        interactionParams.maximumAllowedSatToSpend +
                        totalAmount +
                        amountAddition,
                    interactionParams,
                ));

            if (!UTXOs || UTXOs.length === 0) {
                throw new Error('No UTXOs found');
            }

            const preimage = await this.#provider.getPreimage();
            const params: IInteractionParameters | InteractionParametersWithoutSigner = {
                calldata: this.calldata,
                priorityFee: priorityFee,
                gasSatFee: this.estimatedSatGas,
                feeRate: interactionParams.feeRate || 10,
                from: interactionParams.refundTo,
                utxos: UTXOs,
                to: this.to,
                network: interactionParams.network,
                optionalOutputs: interactionParams.extraOutputs || [],
                signer: interactionParams.signer,
                preimage: preimage,
            };

            const transaction = await factory.signInteraction(params);
            const tx1 = await this.#provider.sendRawTransaction(
                transaction.fundingTransaction,
                false,
            );
            
            if (!tx1 || tx1.error) {
                throw new Error(`Error sending transaction: ${tx1?.error || 'Unknown error'}`);
            }

            const tx2 = await this.#provider.sendRawTransaction(
                transaction.interactionTransaction,
                false,
            );

            if (!tx2 || tx2.error) {
                throw new Error(`Error sending transaction: ${tx2?.error || 'Unknown error'}`);
            }

            if (!tx2.result) {
                throw new Error('No transaction ID returned');
            }

            this.#provider.utxoManager.spentUTXO(UTXOs, transaction.nextUTXOs);

            return {
                transactionId: tx2.result,
                peerAcknowledgements: tx2.peers || 0,
                newUTXOs: transaction.nextUTXOs,
                estimatedFees: transaction.estimatedFees,
                preimage: transaction.preimage,
            };
        } catch (e) {
            const msgStr = (e as Error).message;

            if (msgStr.includes('Insufficient funds to pay the fees') && amountAddition === 0n) {
                return await this.sendTransaction(interactionParams, 200_000n);
            }

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
    }

    public setEvents(events: U): void {
        this.events = events;
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
            amount: 50_000n + amount,
            throwErrors: true,
        };

        const utxos: UTXO[] = await this.#provider.utxoManager.getUTXOsForAmount(utxoSetting);
        if (!utxos) {
            throw new Error('No UTXOs found');
        }

        return utxos;
    }

    private contractToString(contract: string): string {
        const addressCa = Address.fromString(contract);

        return addressCa.p2tr(this.#provider.network);
    }

    private parseEvents(events: RawEventList): EventList {
        const eventsList: EventList = {};

        for (const [contract, value] of Object.entries(events)) {
            const events: NetEvent[] = [];

            for (const event of value) {
                const eventData = new NetEvent(event.type, Buffer.from(event.data, 'base64'));

                events.push(eventData);
            }

            eventsList[this.contractToString(contract)] = events;
        }

        return eventsList;
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        return BufferHelper.bufferToUint8Array(Buffer.from(base64, 'base64'));
    }
}
