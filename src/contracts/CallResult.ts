import { Network, PsbtOutputExtended, Signer } from '@btc-vision/bitcoin';
import {
    Address,
    BinaryReader,
    BufferHelper,
    ChallengeSolution,
    IInteractionParameters,
    InteractionParametersWithoutSigner,
    IP2WSHAddress,
    LoadedStorage,
    NetEvent,
    RawChallenge,
    SupportedTransactionVersion,
    TransactionFactory,
} from '@btc-vision/transaction';
import { ECPairInterface } from 'ecpair';
import { UTXO } from '../bitcoin/UTXOs.js';
import { BitcoinFees } from '../block/BlockGasParameters.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { RequestUTXOsParamsWithAmount } from '../utxos/interfaces/IUTXOsManager.js';
import { ContractDecodedObjectResult, DecodedOutput } from './Contract.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { EventList, ICallResultData, RawEventList } from './interfaces/ICallResult.js';
import { OPNetEvent } from './OPNetEvent.js';
import { TransactionHelper } from './TransactionHelpper.js';
import { QuantumBIP32Interface } from '@btc-vision/bip32';

const factory = new TransactionFactory();

export interface TransactionParameters {
    readonly signer: Signer | ECPairInterface | null;
    readonly mldsaSigner: QuantumBIP32Interface | null;

    readonly refundTo: string;
    readonly sender?: string;
    readonly priorityFee?: bigint;

    feeRate?: number;

    readonly utxos?: UTXO[];
    readonly maximumAllowedSatToSpend: bigint;
    readonly network: Network;

    readonly extraInputs?: UTXO[];
    readonly extraOutputs?: PsbtOutputExtended[];

    readonly minGas?: bigint;
    readonly note?: string | Buffer;
    readonly p2wda?: boolean;
    readonly from?: Address;

    readonly txVersion?: SupportedTransactionVersion;
    readonly anchor?: boolean;

    readonly dontUseCSVUtxos?: boolean;

    readonly maxUTXOs?: number;
    readonly throwIfUTXOsLimitReached?: boolean;

    readonly linkMLDSAPublicKeyToAddress?: boolean;
    readonly revealMLDSAPublicKey?: boolean;
}

export interface UTXOTrackingInfo {
    readonly csvUTXOs: UTXO[];
    readonly p2wdaUTXOs: UTXO[];
    readonly regularUTXOs: UTXO[];
    readonly refundAddress: string;
    readonly refundToAddress: string;
    readonly csvAddress?: IP2WSHAddress;
    readonly p2wdaAddress?: { readonly address: string; readonly witnessScript: Buffer };
    readonly isP2WDA: boolean;
}

export interface SignedInteractionTransactionReceipt {
    readonly fundingTransactionRaw: string | null;
    readonly interactionTransactionRaw: string;
    readonly nextUTXOs: UTXO[];
    readonly estimatedFees: bigint;
    readonly challengeSolution: RawChallenge;
    readonly interactionAddress: string | null;
    readonly fundingUTXOs: UTXO[];
    readonly compiledTargetScript: string | null;
    readonly utxoTracking: UTXOTrackingInfo;
}

export interface InteractionTransactionReceipt {
    readonly transactionId: string;
    readonly newUTXOs: UTXO[];
    readonly peerAcknowledgements: number;
    readonly estimatedFees: bigint;
    readonly challengeSolution: RawChallenge;
    readonly rawTransaction: string;
    readonly interactionAddress: string | null;
    readonly fundingUTXOs: UTXO[];
    readonly compiledTargetScript: string | null;
}

/**
 * Represents the result of a contract call.
 * @category Contracts
 */
export class CallResult<
    T extends ContractDecodedObjectResult = {},
    U extends OPNetEvent<ContractDecodedObjectResult>[] = OPNetEvent<ContractDecodedObjectResult>[],
> implements Omit<ICallResultData, 'estimatedGas' | 'events' | 'specialGas'>
{
    public readonly result: BinaryReader;
    public readonly accessList: IAccessList;
    public readonly revert: string | undefined;

    public calldata: Buffer | undefined;
    public loadedStorage: LoadedStorage | undefined;
    public readonly estimatedGas: bigint | undefined;
    public readonly refundedGas: bigint | undefined;

    public properties: T = {} as T;

    public estimatedSatGas: bigint = 0n;
    public estimatedRefundedGasInSat: bigint = 0n;
    public events: U = [] as unknown as U;

    public to: string | undefined;
    public address: Address | undefined;
    public fromAddress: Address | undefined;
    public csvAddress: IP2WSHAddress | undefined;

    #bitcoinFees: BitcoinFees | undefined;

    readonly #rawEvents: EventList;
    readonly #provider: AbstractRpcProvider;

    constructor(callResult: ICallResultData, provider: AbstractRpcProvider) {
        this.#provider = provider;
        this.#rawEvents = this.parseEvents(callResult.events);
        this.accessList = callResult.accessList;
        this.loadedStorage = callResult.loadedStorage;

        if (callResult.estimatedGas) {
            this.estimatedGas = BigInt(callResult.estimatedGas);
        }

        if (callResult.specialGas) {
            this.refundedGas = BigInt(callResult.specialGas);
        }

        const revert =
            typeof callResult.revert === 'string'
                ? this.base64ToUint8Array(callResult.revert)
                : callResult.revert;

        if (revert) {
            this.revert = CallResult.decodeRevertData(revert);
        }

        this.result =
            typeof callResult.result === 'string'
                ? new BinaryReader(this.base64ToUint8Array(callResult.result))
                : callResult.result;
    }

    public get rawEvents(): EventList {
        return this.#rawEvents;
    }

    public static decodeRevertData(revertDataBytes: Uint8Array | Buffer): string {
        if (this.startsWithErrorSelector(revertDataBytes)) {
            const decoder = new TextDecoder();
            const buf = Buffer.from(revertDataBytes.subarray(8));

            return decoder.decode(buf);
        } else {
            return `Unknown Revert: 0x${this.bytesToHexString(revertDataBytes)}`;
        }
    }

    private static startsWithErrorSelector(revertDataBytes: Uint8Array | Buffer) {
        const errorSelectorBytes = Uint8Array.from([0x63, 0x73, 0x9d, 0x5c]);

        return (
            revertDataBytes.length >= 4 &&
            this.areBytesEqual(Buffer.from(revertDataBytes.subarray(0, 4)), errorSelectorBytes)
        );
    }

    private static areBytesEqual(a: Uint8Array | Buffer, b: Uint8Array | Buffer) {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    private static bytesToHexString(byteArray: Uint8Array): string {
        return Array.from(byteArray, function (byte) {
            return ('0' + (byte & 0xff).toString(16)).slice(-2);
        }).join('');
    }

    public setTo(to: string, address: Address): void {
        this.to = to;
        this.address = address;
    }

    public setFromAddress(from?: Address): void {
        this.fromAddress = from;
        this.csvAddress =
            this.fromAddress && this.fromAddress.originalPublicKey
                ? this.#provider.getCSV1ForAddress(this.fromAddress)
                : undefined;
    }

    /**
     * Signs a bitcoin interaction transaction from a simulated contract call without broadcasting.
     * @param {TransactionParameters} interactionParams - The parameters for the transaction.
     * @param amountAddition - Additional satoshis to request when acquiring UTXOs.
     * @returns {Promise<SignedInteractionTransactionReceipt>} The signed transaction data and UTXO tracking info.
     */
    public async signTransaction(
        interactionParams: TransactionParameters,
        amountAddition: bigint = 0n,
    ): Promise<SignedInteractionTransactionReceipt> {
        if (!this.address) {
            throw new Error('Contract address not set');
        }

        if (!this.calldata) {
            throw new Error('Calldata not set');
        }

        if (!this.to) {
            throw new Error('To address not set');
        }

        if (this.revert) {
            throw new Error(`Can not send transaction! Simulation reverted: ${this.revert}`);
        }

        let UTXOs: UTXO[] =
            interactionParams.utxos || (await this.acquire(interactionParams, amountAddition));

        if (interactionParams.extraInputs) {
            UTXOs = UTXOs.filter((utxo) => {
                return (
                    interactionParams.extraInputs?.find((input) => {
                        return (
                            input.outputIndex === utxo.outputIndex &&
                            input.transactionId === utxo.transactionId
                        );
                    }) === undefined
                );
            });
        }

        if (!UTXOs || UTXOs.length === 0) {
            throw new Error('No UTXOs found');
        }

        const priorityFee: bigint = interactionParams.priorityFee || 0n;
        const challenge: ChallengeSolution = await this.#provider.getChallenge();
        const params: IInteractionParameters | InteractionParametersWithoutSigner = {
            contract: this.address.toHex(),
            calldata: this.calldata,
            priorityFee: priorityFee,
            gasSatFee: this.bigintMax(this.estimatedSatGas, interactionParams.minGas || 0n),
            feeRate: interactionParams.feeRate || this.#bitcoinFees?.conservative || 10,
            from: interactionParams.refundTo,
            utxos: UTXOs,
            to: this.to,
            network: interactionParams.network,
            optionalInputs: interactionParams.extraInputs || [],
            optionalOutputs: interactionParams.extraOutputs || [],
            signer: interactionParams.signer as Signer | ECPairInterface,
            challenge: challenge,
            note: interactionParams.note,
            anchor: interactionParams.anchor || false,
            txVersion: interactionParams.txVersion || 2,
            mldsaSigner: interactionParams.mldsaSigner,
            linkMLDSAPublicKeyToAddress: interactionParams.linkMLDSAPublicKeyToAddress ?? true,
            revealMLDSAPublicKey: interactionParams.revealMLDSAPublicKey ?? false,
        };

        const transaction = await factory.signInteraction(params);

        const csvUTXOs = UTXOs.filter((u) => u.isCSV === true);
        const p2wdaUTXOs = UTXOs.filter((u) => u.witnessScript && u.isCSV !== true);
        const regularUTXOs = UTXOs.filter((u) => !u.witnessScript && u.isCSV !== true);

        const refundAddress = interactionParams.sender || interactionParams.refundTo;
        const p2wdaAddress = interactionParams.from?.p2wda(this.#provider.network);

        let refundToAddress: string;
        if (this.csvAddress && refundAddress === this.csvAddress.address) {
            refundToAddress = this.csvAddress.address;
        } else if (p2wdaAddress && refundAddress === p2wdaAddress.address) {
            refundToAddress = p2wdaAddress.address;
        } else {
            refundToAddress = refundAddress;
        }

        const utxoTracking: UTXOTrackingInfo = {
            csvUTXOs,
            p2wdaUTXOs,
            regularUTXOs,
            refundAddress,
            refundToAddress,
            csvAddress: this.csvAddress,
            p2wdaAddress: p2wdaAddress
                ? { address: p2wdaAddress.address, witnessScript: p2wdaAddress.witnessScript }
                : undefined,
            isP2WDA: interactionParams.p2wda || false,
        };

        return {
            fundingTransactionRaw: transaction.fundingTransaction,
            interactionTransactionRaw: transaction.interactionTransaction,
            nextUTXOs: transaction.nextUTXOs,
            estimatedFees: transaction.estimatedFees,
            challengeSolution: transaction.challenge,
            interactionAddress: transaction.interactionAddress,
            fundingUTXOs: transaction.fundingUTXOs,
            compiledTargetScript: transaction.compiledTargetScript,
            utxoTracking,
        };
    }

    /**
     * Broadcasts a pre-signed interaction transaction.
     * @param {SignedInteractionTransactionReceipt} signedTx - The signed transaction data.
     * @returns {Promise<InteractionTransactionReceipt>} The transaction receipt with broadcast results.
     */
    public async sendPresignedTransaction(
        signedTx: SignedInteractionTransactionReceipt,
    ): Promise<InteractionTransactionReceipt> {
        if (!signedTx.utxoTracking.isP2WDA) {
            if (!signedTx.fundingTransactionRaw) {
                throw new Error('Funding transaction not created');
            }

            const tx1 = await this.#provider.sendRawTransaction(
                signedTx.fundingTransactionRaw,
                false,
            );

            if (!tx1 || tx1.error) {
                throw new Error(`Error sending transaction: ${tx1?.error || 'Unknown error'}`);
            }

            if (!tx1.success) {
                throw new Error(`Error sending transaction: ${tx1.result || 'Unknown error'}`);
            }
        }

        const tx2 = await this.#provider.sendRawTransaction(
            signedTx.interactionTransactionRaw,
            false,
        );

        if (!tx2 || tx2.error) {
            throw new Error(`Error sending transaction: ${tx2?.error || 'Unknown error'}`);
        }

        if (!tx2.result) {
            throw new Error('No transaction ID returned');
        }

        if (!tx2.success) {
            throw new Error(`Error sending transaction: ${tx2.result || 'Unknown error'}`);
        }

        this.#processUTXOTracking(signedTx);

        return {
            interactionAddress: signedTx.interactionAddress,
            transactionId: tx2.result,
            peerAcknowledgements: tx2.peers || 0,
            newUTXOs: signedTx.nextUTXOs,
            estimatedFees: signedTx.estimatedFees,
            challengeSolution: signedTx.challengeSolution,
            rawTransaction: signedTx.interactionTransactionRaw,
            fundingUTXOs: signedTx.fundingUTXOs,
            compiledTargetScript: signedTx.compiledTargetScript,
        };
    }

    /**
     * Signs and broadcasts a bitcoin interaction transaction from a simulated contract call.
     * @param {TransactionParameters} interactionParams - The parameters for the transaction.
     * @param amountAddition - Additional satoshis to request when acquiring UTXOs.
     * @returns {Promise<InteractionTransactionReceipt>} The transaction receipt with broadcast results.
     */
    public async sendTransaction(
        interactionParams: TransactionParameters,
        amountAddition: bigint = 0n,
    ): Promise<InteractionTransactionReceipt> {
        try {
            const signedTx = await this.signTransaction(interactionParams, amountAddition);
            return await this.sendPresignedTransaction(signedTx);
        } catch (e) {
            const msgStr = (e as Error).message;

            if (msgStr.includes('Insufficient funds to pay the fees') && amountAddition === 0n) {
                return await this.sendTransaction(interactionParams, 200_000n);
            }

            this.#provider.utxoManager.clean();

            throw e;
        }
    }

    public setGasEstimation(estimatedGas: bigint, refundedGas: bigint): void {
        this.estimatedSatGas = estimatedGas;
        this.estimatedRefundedGasInSat = refundedGas;
    }

    public setBitcoinFee(fees: BitcoinFees): void {
        this.#bitcoinFees = fees;
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

    #cloneUTXOWithWitnessScript(utxo: UTXO, witnessScript: Buffer): UTXO {
        const clone = Object.assign(
            Object.create(Object.getPrototypeOf(utxo) as object) as UTXO,
            utxo,
        );
        clone.witnessScript = witnessScript;
        return clone;
    }

    #processUTXOTracking(signedTx: SignedInteractionTransactionReceipt): void {
        const {
            csvUTXOs,
            p2wdaUTXOs,
            regularUTXOs,
            refundAddress,
            refundToAddress,
            csvAddress,
            p2wdaAddress,
        } = signedTx.utxoTracking;

        if (csvAddress && csvUTXOs.length) {
            const finalUTXOs = signedTx.nextUTXOs.map((u) =>
                this.#cloneUTXOWithWitnessScript(u, csvAddress.witnessScript),
            );

            this.#provider.utxoManager.spentUTXO(
                csvAddress.address,
                csvUTXOs,
                refundToAddress === csvAddress.address ? finalUTXOs : [],
            );
        }

        if (p2wdaAddress && p2wdaUTXOs.length) {
            const finalUTXOs = signedTx.nextUTXOs.map((u) =>
                this.#cloneUTXOWithWitnessScript(u, p2wdaAddress.witnessScript),
            );

            this.#provider.utxoManager.spentUTXO(
                p2wdaAddress.address,
                p2wdaUTXOs,
                refundToAddress === p2wdaAddress.address ? finalUTXOs : [],
            );
        }

        if (regularUTXOs.length) {
            this.#provider.utxoManager.spentUTXO(
                refundAddress,
                regularUTXOs,
                refundToAddress === refundAddress ? signedTx.nextUTXOs : [],
            );
        }

        if (csvAddress && refundToAddress === csvAddress.address && !csvUTXOs.length) {
            const finalUTXOs = signedTx.nextUTXOs.map((u) =>
                this.#cloneUTXOWithWitnessScript(u, csvAddress.witnessScript),
            );

            this.#provider.utxoManager.spentUTXO(csvAddress.address, [], finalUTXOs);
        } else if (p2wdaAddress && refundToAddress === p2wdaAddress.address && !p2wdaUTXOs.length) {
            const finalUTXOs = signedTx.nextUTXOs.map((u) =>
                this.#cloneUTXOWithWitnessScript(u, p2wdaAddress.witnessScript),
            );

            this.#provider.utxoManager.spentUTXO(p2wdaAddress.address, [], finalUTXOs);
        } else if (refundToAddress === refundAddress && !regularUTXOs.length) {
            const isSpecialAddress =
                (csvAddress && refundToAddress === csvAddress.address) ||
                (p2wdaAddress && refundToAddress === p2wdaAddress.address);

            if (!isSpecialAddress) {
                this.#provider.utxoManager.spentUTXO(refundAddress, [], signedTx.nextUTXOs);
            }
        }
    }

    private async acquire(
        interactionParams: TransactionParameters,
        amountAddition: bigint = 0n,
    ): Promise<UTXO[]> {
        if (!this.calldata) {
            throw new Error('Calldata not set');
        }

        if (!interactionParams.feeRate) {
            interactionParams.feeRate = 1.5;
        }

        const feeRate = interactionParams.feeRate;
        const priority = interactionParams.priorityFee ?? 0n;
        const addedOuts = interactionParams.extraOutputs ?? [];
        const totalOuts = BigInt(addedOuts.reduce((s, o) => s + o.value, 0));

        const gasFee = this.bigintMax(this.estimatedSatGas, interactionParams.minGas ?? 0n);
        const preWant =
            gasFee +
            priority +
            amountAddition +
            totalOuts +
            interactionParams.maximumAllowedSatToSpend;

        let utxos = interactionParams.utxos ?? (await this.#fetchUTXOs(preWant, interactionParams));

        let refetched = false;
        while (true) {
            const miningCost = TransactionHelper.estimateMiningCost(
                utxos,
                addedOuts,
                this.calldata.length + 200,
                interactionParams.network,
                feeRate,
            );

            const want =
                gasFee +
                priority +
                amountAddition +
                totalOuts +
                miningCost +
                interactionParams.maximumAllowedSatToSpend;

            const have = utxos.reduce((s, u) => s + u.value, 0n);
            if (have >= want) break;

            if (refetched) {
                throw new Error('Not enough sat to complete transaction');
            }

            utxos = await this.#fetchUTXOs(want, interactionParams);
            refetched = true;

            const haveAfter = utxos.reduce((s, u) => s + u.value, 0n);
            if (haveAfter === have) {
                throw new Error('Not enough sat to complete transaction');
            }
        }

        return utxos;
    }

    private bigintMax(a: bigint, b: bigint): bigint {
        return a > b ? a : b;
    }

    async #fetchUTXOs(amount: bigint, interactionParams: TransactionParameters): Promise<UTXO[]> {
        if (!interactionParams.sender && !interactionParams.refundTo) {
            throw new Error('Refund address not set');
        }

        const utxoSetting: RequestUTXOsParamsWithAmount = {
            address: interactionParams.sender || interactionParams.refundTo,
            amount: amount,
            throwErrors: true,
            maxUTXOs: interactionParams.maxUTXOs,
            throwIfUTXOsLimitReached: interactionParams.throwIfUTXOsLimitReached,
            csvAddress:
                !interactionParams.p2wda && !interactionParams.dontUseCSVUtxos
                    ? this.csvAddress?.address
                    : undefined,
        };

        const utxos: UTXO[] = await this.#provider.utxoManager.getUTXOsForAmount(utxoSetting);
        if (!utxos) {
            throw new Error('No UTXOs found');
        }

        if (this.csvAddress) {
            const csvUtxos = utxos.filter((u) => u.isCSV === true);
            if (csvUtxos.length > 0) {
                for (const utxo of csvUtxos) {
                    utxo.witnessScript = this.csvAddress.witnessScript;
                }
            }
        }

        if (interactionParams.p2wda) {
            if (!interactionParams.from) {
                throw new Error('From address not set in interaction parameters');
            }

            const p2wda = interactionParams.from.p2wda(this.#provider.network);
            if (
                interactionParams.sender
                    ? p2wda.address === interactionParams.sender
                    : p2wda.address === interactionParams.refundTo
            ) {
                utxos.forEach((utxo) => {
                    utxo.witnessScript = p2wda.witnessScript;
                });
            }
        }

        return utxos;
    }

    private getValuesFromAccessList(): LoadedStorage {
        const storage: LoadedStorage = {};

        for (const contract in this.accessList) {
            const contractData = this.accessList[contract];
            storage[contract] = Object.keys(contractData);
        }

        return storage;
    }

    private contractToString(contract: string): string {
        const addressCa = Address.fromString(contract);

        return addressCa.p2op(this.#provider.network);
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
