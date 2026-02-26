import { QuantumBIP32Interface } from '@btc-vision/bip32';
import {
    fromBase64,
    fromHex,
    Network,
    networks,
    PsbtOutputExtended,
    Signer,
    toHex,
} from '@btc-vision/bitcoin';
import { UniversalSigner } from '@btc-vision/ecpair';
import {
    Address,
    BinaryReader,
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
import { UTXO } from '../bitcoin/UTXOs.js';
import { BitcoinFees } from '../block/BlockGasParameters.js';
import { decodeRevertData } from '../utils/RevertDecoder.js';
import { RequestUTXOsParamsWithAmount } from '../utxos/interfaces/IUTXOsManager.js';
import { CallResultSerializer, NetworkName } from './CallResultSerializer.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { EventList, ICallResultData, RawEventList } from './interfaces/ICallResult.js';
import { IProviderForCallResult } from './interfaces/IProviderForCallResult.js';
import { OPNetEvent } from './OPNetEvent.js';
import { TransactionHelper } from './TransactionHelpper.js';
import { ContractDecodedObjectResult, DecodedOutput } from './types/ContractTypes.js';

const factory = new TransactionFactory();

export interface TransactionParameters {
    readonly signer: Signer | UniversalSigner | null;
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
    readonly note?: string | Uint8Array;
    readonly p2wda?: boolean;
    readonly from?: Address;

    readonly txVersion?: SupportedTransactionVersion;
    readonly anchor?: boolean;

    readonly dontUseCSVUtxos?: boolean;

    readonly maxUTXOs?: number;
    readonly throwIfUTXOsLimitReached?: boolean;

    readonly linkMLDSAPublicKeyToAddress?: boolean;
    readonly revealMLDSAPublicKey?: boolean;

    readonly challenge?: ChallengeSolution;

    readonly subtractExtraUTXOFromAmountRequired?: boolean;
}

export interface UTXOTrackingInfo {
    readonly csvUTXOs: UTXO[];
    readonly p2wdaUTXOs: UTXO[];
    readonly regularUTXOs: UTXO[];
    readonly refundAddress: string;
    readonly refundToAddress: string;
    readonly csvAddress?: IP2WSHAddress;
    readonly p2wdaAddress?: { readonly address: string; readonly witnessScript: Uint8Array };
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
    readonly fundingInputUtxos: UTXO[];
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
    readonly fundingInputUtxos: UTXO[];
    readonly compiledTargetScript: string | null;
}

/**
 * Represents the result of a contract call.
 * @category Contracts
 */
export class CallResult<
    T extends ContractDecodedObjectResult = {},
    U extends OPNetEvent<ContractDecodedObjectResult>[] = OPNetEvent<ContractDecodedObjectResult>[],
> implements Omit<ICallResultData, 'estimatedGas' | 'events' | 'specialGas'> {
    public readonly result: BinaryReader;
    public readonly accessList: IAccessList;
    public revert: string | undefined;

    public constant: boolean = false;
    public payable: boolean = false;

    public calldata: Uint8Array | undefined;
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
    readonly #provider: IProviderForCallResult;
    readonly #resultBase64: string;

    constructor(callResult: ICallResultData, provider: IProviderForCallResult) {
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

        // Store original result for serialization
        if (typeof callResult.result === 'string') {
            this.#resultBase64 = callResult.result;
            this.result = new BinaryReader(this.base64ToUint8Array(callResult.result));
        } else if (callResult.result instanceof Uint8Array) {
            this.#resultBase64 = '';
            this.result = new BinaryReader(callResult.result);
        } else {
            // If already a BinaryReader, we can't easily get the base64 back
            // This shouldn't happen in normal flow
            this.#resultBase64 = '';
            this.result = callResult.result;
        }
    }

    public get rawEvents(): EventList {
        return this.#rawEvents;
    }

    public static decodeRevertData(revertDataBytes: Uint8Array): string {
        return decodeRevertData(revertDataBytes);
    }

    /**
     * Reconstructs a CallResult from offline serialized buffer.
     * Use this on a device to sign transactions offline.
     * @param {Uint8Array | string} input - The serialized offline data as Uint8Array or hex string.
     * @returns {CallResult} A CallResult instance ready for offline signing.
     *
     * @example
     * ```typescript
     * // Offline device: reconstruct from buffer
     * const buffer = fs.readFileSync('offline-tx.bin');
     * const simulation = CallResult.fromOfflineBuffer(buffer);
     *
     * // Now sign offline
     * const signedTx = await simulation.signTransaction({
     *     signer: wallet.keypair,
     *     // ... other params
     * });
     * ```
     */
    public static fromOfflineBuffer(input: Uint8Array | string): CallResult {
        const buffer = typeof input === 'string' ? fromHex(input) : input;
        const data = CallResultSerializer.deserialize(buffer);

        // Resolve network
        const network = CallResult.resolveNetwork(data.network);

        // Create ChallengeSolution from serialized RawChallenge
        // Use the original public key (33 bytes) instead of the tweaked key (32 bytes)
        const challengeWithOriginalKey = {
            ...data.challenge,
            legacyPublicKey: '0x' + toHex(data.challengeOriginalPublicKey),
        };
        const challengeSolution = new ChallengeSolution(challengeWithOriginalKey);

        // Create offline provider
        const offlineProvider: IProviderForCallResult = {
            network,
            utxoManager: {
                getUTXOsForAmount: () => Promise.resolve(data.utxos),
                spentUTXO: () => {},
                clean: () => {},
            },
            getChallenge: () => Promise.resolve(challengeSolution),
            sendRawTransaction: () => {
                return Promise.reject(
                    new Error(
                        'Cannot broadcast from offline CallResult. Export signed transaction and broadcast online.',
                    ),
                );
            },
            getCSV1ForAddress: () => {
                if (!data.csvAddress) {
                    throw new Error('CSV address not available in offline data');
                }
                return data.csvAddress;
            },
        };

        // Create ICallResultData
        // Note: revert is set directly below to avoid double-decoding
        const callResultData: ICallResultData = {
            result: data.result,
            accessList: data.accessList,
            events: {},
            revert: undefined,
            estimatedGas: data.estimatedGas?.toString(),
            specialGas: data.refundedGas?.toString(),
        };

        const callResult = new CallResult(callResultData, offlineProvider);

        // Restore state
        // Set revert directly since it's already decoded (not base64 bytes)
        callResult.revert = data.revert;
        callResult.calldata = data.calldata;
        callResult.to = data.to;
        callResult.address = Address.fromString(data.contractAddress);
        callResult.estimatedSatGas = data.estimatedSatGas;
        callResult.estimatedRefundedGasInSat = data.estimatedRefundedGasInSat;
        callResult.csvAddress = data.csvAddress;

        if (data.bitcoinFees) {
            callResult.setBitcoinFee(data.bitcoinFees);
        }

        return callResult;
    }

    /**
     * Resolves a NetworkName enum to a Network object.
     */
    private static resolveNetwork(networkName: NetworkName): Network {
        switch (networkName) {
            case NetworkName.Mainnet:
                return networks.bitcoin;
            case NetworkName.Testnet:
                return networks.testnet;
            case NetworkName.OpnetTestnet:
                return networks.opnetTestnet;
            case NetworkName.Regtest:
                return networks.regtest;
            default:
                return networks.regtest;
        }
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
     * @param {bigint} amountAddition - Additional satoshis to request when acquiring UTXOs.
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

        if (this.constant) {
            throw new Error(
                'Cannot send a transaction on a constant (view) function. Use the returned CallResult directly.',
            );
        }

        if (this.payable) {
            const hasExtraInputs =
                interactionParams.extraInputs && interactionParams.extraInputs.length > 0;

            const hasExtraOutputs =
                interactionParams.extraOutputs && interactionParams.extraOutputs.length > 0;

            if (!hasExtraInputs && !hasExtraOutputs) {
                throw new Error(
                    'Payable function requires extraInputs or extraOutputs in the transaction parameters.',
                );
            }
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
        const challenge: ChallengeSolution =
            interactionParams.challenge || (await this.#provider.getChallenge());

        const sharedParams = {
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
            note: interactionParams.note,
            anchor: interactionParams.anchor || false,
            txVersion: interactionParams.txVersion || 2,
            linkMLDSAPublicKeyToAddress: interactionParams.linkMLDSAPublicKeyToAddress ?? true,
            revealMLDSAPublicKey: interactionParams.revealMLDSAPublicKey ?? false,
            subtractExtraUTXOFromAmountRequired:
                interactionParams.subtractExtraUTXOFromAmountRequired ?? false,
        };

        const params: IInteractionParameters | InteractionParametersWithoutSigner =
            interactionParams.signer !== null
                ? {
                      ...sharedParams,
                      signer: interactionParams.signer,
                      challenge: challenge,
                      mldsaSigner: interactionParams.mldsaSigner,
                  }
                : sharedParams;

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
            fundingInputUtxos: transaction.fundingInputUtxos,
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
            fundingInputUtxos: signedTx.fundingInputUtxos,
            compiledTargetScript: signedTx.compiledTargetScript,
        };
    }

    /**
     * Signs and broadcasts a bitcoin interaction transaction from a simulated contract call.
     * @param {TransactionParameters} interactionParams - The parameters for the transaction.
     * @param {bigint} amountAddition - Additional satoshis to request when acquiring UTXOs.
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

    /**
     * Set the gas estimation values.
     * @param {bigint} estimatedGas - The estimated gas in satoshis.
     * @param {bigint} refundedGas - The refunded gas in satoshis.
     */
    public setGasEstimation(estimatedGas: bigint, refundedGas: bigint): void {
        this.estimatedSatGas = estimatedGas;
        this.estimatedRefundedGasInSat = refundedGas;
    }

    /**
     * Set the Bitcoin fee rates.
     * @param {BitcoinFees} fees - The Bitcoin fee rates.
     */
    public setBitcoinFee(fees: BitcoinFees): void {
        this.#bitcoinFees = fees;
    }

    /**
     * Set the decoded contract output properties.
     * @param {DecodedOutput} decoded - The decoded output.
     */
    public setDecoded(decoded: DecodedOutput): void {
        this.properties = Object.freeze(decoded.obj) as T;
    }

    /**
     * Set the contract events.
     * @param {U} events - The contract events.
     */
    public setEvents(events: U): void {
        this.events = events;
    }

    /**
     * Set the calldata for the transaction.
     * @param {Uint8Array} calldata - The calldata.
     */
    public setCalldata(calldata: Uint8Array): void {
        this.calldata = calldata;
    }

    /**
     * Serializes this CallResult to a Uint8Array.
     * Call this on an online device after simulation, then transfer the result
     * to an offline device for signing.
     *
     * @param {string} refundAddress - The address to fetch UTXOs from (your p2tr address).
     * @param {bigint} amount - The amount of satoshis needed for the transaction.
     * @returns {Promise<Uint8Array>} Serialized buffer ready for offline signing.
     *
     * @example
     * ```typescript
     * // Online device: prepare for offline signing
     * const simulation = await contract.transfer(recipient, amount);
     * const offlineBuffer = await simulation.toOfflineBuffer(wallet.p2tr, 50000n);
     *
     * // Save to file or encode as base64 for QR code
     * fs.writeFileSync('offline-tx.bin', offlineBuffer);
     * // Or: const qrData = offlineBuffer.toString('base64');
     * ```
     */
    public async toOfflineBuffer(refundAddress: string, amount: bigint): Promise<Uint8Array> {
        if (!this.calldata) {
            throw new Error('Calldata not set');
        }

        if (!this.to) {
            throw new Error('Contract address not set');
        }

        if (!this.address) {
            throw new Error('Contract Address object not set');
        }

        if (this.revert) {
            throw new Error(`Cannot serialize reverted simulation: ${this.revert}`);
        }

        // Fetch UTXOs and challenge while online
        const utxos = await this.#provider.utxoManager.getUTXOsForAmount({
            address: refundAddress,
            amount: amount + this.estimatedSatGas + 10000n, // Add buffer for fees
            throwErrors: true,
        });

        const challengeSolution = await this.#provider.getChallenge();

        // Get network name
        const networkName = this.#getNetworkName();

        return CallResultSerializer.serialize({
            calldata: this.calldata,
            to: this.to,
            contractAddress: this.address.toHex(),
            estimatedSatGas: this.estimatedSatGas,
            estimatedRefundedGasInSat: this.estimatedRefundedGasInSat,
            revert: this.revert,
            result: fromBase64(this.#resultBase64),
            accessList: this.accessList,
            bitcoinFees: this.#bitcoinFees,
            network: networkName,
            estimatedGas: this.estimatedGas,
            refundedGas: this.refundedGas,
            challenge: challengeSolution.toRaw(),
            challengeOriginalPublicKey: challengeSolution.publicKey.originalPublicKeyBuffer(),
            utxos,
            csvAddress: this.csvAddress,
        });
    }

    /**
     * Gets the NetworkName enum from the provider's network.
     * @returns {NetworkName} The network name enum value.
     */
    #getNetworkName(): NetworkName {
        const network = this.#provider.network;
        if (network === networks.bitcoin) return NetworkName.Mainnet;
        if (network === networks.testnet) return NetworkName.Testnet;
        if (network === networks.opnetTestnet) return NetworkName.OpnetTestnet;
        if (network === networks.regtest) return NetworkName.Regtest;
        return NetworkName.Regtest; // Default fallback
    }

    /**
     * Clone a UTXO and attach a witness script.
     * @param {UTXO} utxo - The UTXO to clone.
     * @param {Uint8Array} witnessScript - The witness script to attach.
     * @returns {UTXO} The cloned UTXO with witness script.
     */
    #cloneUTXOWithWitnessScript(utxo: UTXO, witnessScript: Uint8Array): UTXO {
        const clone = Object.assign(
            Object.create(Object.getPrototypeOf(utxo) as object) as UTXO,
            utxo,
        );
        clone.witnessScript = witnessScript;
        return clone;
    }

    /**
     * Process UTXO tracking after transaction broadcast.
     * @param {SignedInteractionTransactionReceipt} signedTx - The signed transaction receipt.
     */
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

    /**
     * Acquire UTXOs for the transaction.
     * @param {TransactionParameters} interactionParams - The transaction parameters.
     * @param {bigint} amountAddition - Additional amount to request.
     * @returns {Promise<UTXO[]>} The acquired UTXOs.
     */
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
        const totalOuts = addedOuts.reduce((s, o) => s + BigInt(o.value), 0n);

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

    /**
     * Return the maximum of two bigints.
     * @param {bigint} a - First value.
     * @param {bigint} b - Second value.
     * @returns {bigint} The maximum value.
     */
    private bigintMax(a: bigint, b: bigint): bigint {
        return a > b ? a : b;
    }

    /**
     * Fetch UTXOs from the provider.
     * @param {bigint} amount - The amount needed.
     * @param {TransactionParameters} interactionParams - The transaction parameters.
     * @returns {Promise<UTXO[]>} The fetched UTXOs.
     */
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

        let utxos: UTXO[] = await this.#provider.utxoManager.getUTXOsForAmount(utxoSetting);
        if (!utxos) {
            throw new Error('No UTXOs found');
        }

        // Remove any UTXOs that overlap with extraInputs so they never count
        // toward the funding balance. Without this, acquire's `have` sum
        // includes value that signTransaction will strip out, causing the
        // funding transaction to be short or to double-spend the extra inputs.
        if (interactionParams.extraInputs && interactionParams.extraInputs.length > 0) {
            utxos = utxos.filter((utxo) => {
                if (!interactionParams.extraInputs) {
                    throw new Error('extraInputs should be defined here');
                }

                return !interactionParams.extraInputs.some(
                    (extra) =>
                        extra.transactionId === utxo.transactionId &&
                        extra.outputIndex === utxo.outputIndex,
                );
            });
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

    /**
     * Get storage keys from access list.
     * @returns {LoadedStorage} The loaded storage map.
     */
    private getValuesFromAccessList(): LoadedStorage {
        const storage: LoadedStorage = {};

        for (const contract in this.accessList) {
            const contractData = this.accessList[contract];
            storage[contract] = Object.keys(contractData);
        }

        return storage;
    }

    /**
     * Convert contract address to p2op string.
     * @param {string} contract - The contract address hex.
     * @returns {string} The p2op address string.
     */
    private contractToString(contract: string): string {
        const addressCa = Address.fromString(contract);

        return addressCa.p2op(this.#provider.network);
    }

    /**
     * Parse raw events into EventList format.
     * @param {RawEventList} events - The raw events.
     * @returns {EventList} The parsed events.
     */
    private parseEvents(events: RawEventList): EventList {
        const eventsList: EventList = {};

        for (const [contract, value] of Object.entries(events)) {
            const events: NetEvent[] = [];

            for (const event of value) {
                const eventData = new NetEvent(event.type, fromBase64(event.data));

                events.push(eventData);
            }

            eventsList[this.contractToString(contract)] = events;
        }

        return eventsList;
    }

    /**
     * Convert base64 string to Uint8Array.
     * @param {string} base64 - The base64 encoded string.
     * @returns {Uint8Array} The decoded bytes.
     */
    private base64ToUint8Array(base64: string): Uint8Array {
        return fromBase64(base64);
    }
}
