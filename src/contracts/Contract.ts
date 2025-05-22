import { Network } from '@btc-vision/bitcoin';
import {
    ABICoder,
    ABIDataTypes,
    Address,
    AddressMap,
    AddressVerificator,
    BinaryReader,
    BinaryWriter,
    NetEvent,
} from '@btc-vision/transaction';
import { BitcoinAbiTypes } from '../abi/BitcoinAbiTypes.js';
import { BitcoinInterface } from '../abi/BitcoinInterface.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinAbiValue } from '../abi/interfaces/BitcoinAbiValue.js';
import {
    BitcoinInterfaceAbi,
    EventBaseData,
    FunctionBaseData,
} from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BlockGasParameters } from '../block/BlockGasParameters.js';
import { DecodedCallResult } from '../common/CommonTypes.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { ContractEvents } from '../transactions/interfaces/ITransactionReceipt.js';
import { CallResult } from './CallResult.js';
import { IAccessList } from './interfaces/IAccessList.js';
import { IContract } from './interfaces/IContract.js';
import { ParsedSimulatedTransaction } from './interfaces/SimulatedTransaction.js';
import { OPNetEvent } from './OPNetEvent.js';
import { AbiTypeToStr } from './TypeToStr.js';

const internal = Symbol.for('_btc_internal');
const bitcoinAbiCoder = new ABICoder();

export type ContractDecodedObjectResult = { [key: string]: DecodedCallResult };
export type DecodedOutput = { values: Array<DecodedCallResult>; obj: ContractDecodedObjectResult };

/**
 * Represents the base contract class.
 * @category Contracts
 * @abstract
 */
export abstract class IBaseContract<T extends BaseContractProperties> implements IContract {
    /**
     * The address of the contract.
     */
    public readonly address: string | Address;

    /**
     * The address of the contract.
     */
    public readonly network: Network;

    /**
     * The interface of the contract.
     */
    public readonly interface!: BitcoinInterface;

    /**
     * A generic provider for the contract.
     */
    public readonly provider: AbstractRpcProvider;

    /**
     * Who is sending the transaction.
     */
    public from?: Address;

    /**
     * The internal functions of the contract.
     * @protected
     */
    readonly [internal]: keyof T | undefined;

    private events: Map<string, EventBaseData> = new Map();
    private gasParameters:
        | {
              cachedAt: number;
              params: Promise<BlockGasParameters>;
          }
        | undefined;

    private readonly fetchGasParametersAfter: number = 1000 * 10;

    private currentTxDetails: ParsedSimulatedTransaction | undefined;
    private simulatedHeight: bigint | undefined = undefined;
    private accessList: IAccessList | undefined;

    protected constructor(
        address: string | Address,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
        network: Network,
        from?: Address,
    ) {
        if (typeof address === 'string') {
            if (!AddressVerificator.detectAddressType(address, network)) {
                throw new Error(
                    `It seems that the address ${address} is not a valid Bitcoin address.`,
                );
            }
        }

        this.address = address;
        this.provider = provider;
        this.interface = BitcoinInterface.from(abi);
        this.network = network;
        this.from = from;

        Object.defineProperty(this, internal, { value: {} });

        this.defineInternalFunctions();
    }

    /**
     * The P2TR address of the contract.
     * @returns {string} The P2TR address of the contract.
     */
    public get p2trOrTweaked(): string {
        if (typeof this.address !== 'string') {
            return this.address.p2tr(this.network);
        }

        return this.address;
    }

    /**
     * Sets the sender of the transaction.
     * @param {Address} sender The sender of the transaction.
     */
    public setSender(sender: Address): void {
        this.from = sender;
    }

    /**
     * Decodes the events from the contract.
     * @param {NetEvent[] | ContractEvents} events The events to decode.
     * @returns {OPNetEvent[]} The decoded events.
     */
    public decodeEvents(
        events: NetEvent[] | ContractEvents,
    ): OPNetEvent<ContractDecodedObjectResult>[] {
        const decodedEvents: OPNetEvent<ContractDecodedObjectResult>[] = [];

        if (!Array.isArray(events)) {
            events = events[this.p2trOrTweaked];

            if (!events && typeof this.address === 'string' && this.address.startsWith('0x')) {
                const addy = Address.fromString(this.address);
                const p2tr = addy.p2tr(this.network);

                events = events[p2tr];
            }

            if (!events) {
                return [];
            }
        }

        for (const event of events) {
            decodedEvents.push(this.decodeEvent(event));
        }

        return decodedEvents;
    }

    /**
     * Decodes a single event.
     * @param {NetEvent} event The event to decode.
     * @returns {OPNetEvent} The decoded event.
     */
    public decodeEvent(event: NetEvent): OPNetEvent {
        const eventData = this.events.get(event.type);
        if (!eventData || eventData.values.length === 0) {
            return new OPNetEvent(event.type, event.data);
        }

        const binaryReader: BinaryReader = new BinaryReader(event.data);
        const out: DecodedOutput = this.decodeOutput(eventData.values, binaryReader);
        const decodedEvent = new OPNetEvent(event.type, event.data);

        decodedEvent.setDecoded(out);

        return decodedEvent;
    }

    /**
     * Encodes the calldata for a function.
     * @param {string} functionName The name of the function.
     * @param {unknown[]} args The arguments for the function.
     * @returns {Buffer} The encoded calldata.
     */
    public encodeCalldata(functionName: string, args: unknown[]): Buffer {
        for (const element of this.interface.abi) {
            if (element.name === functionName) {
                const data = this.encodeFunctionData(element as FunctionBaseData, args);
                return Buffer.from(data.getBuffer());
            }
        }

        throw new Error(`Function not found: ${functionName}`);
    }

    public async currentGasParameters(): Promise<BlockGasParameters> {
        if (
            this.gasParameters &&
            this.gasParameters.cachedAt + this.fetchGasParametersAfter > Date.now()
        ) {
            return this.gasParameters.params;
        }

        this.gasParameters = {
            cachedAt: Date.now(),
            params: this.provider.gasParameters(),
        };

        return await this.gasParameters.params;
    }

    public setTransactionDetails(tx: ParsedSimulatedTransaction): void {
        for (let i = 0; i < tx.outputs.length; i++) {
            const input = tx.outputs[i];

            if (input.index === 0 || input.index === 1) {
                throw new Error(`Outputs 0 and 1 are reserved for the contract internal use.`);
            }
        }

        this.currentTxDetails = tx;
    }

    public setAccessList(accessList: IAccessList): void {
        this.accessList = accessList;
    }

    public setSimulatedHeight(height: bigint | undefined): void {
        this.simulatedHeight = height;
    }

    protected getFunction(
        name: symbol | string,
    ):
        | CallResult
        | undefined
        | string
        | number
        | symbol
        | Address
        | Network
        | (() => Promise<BlockGasParameters>)
        | ((functionName: string, args: unknown[]) => Buffer) {
        const key = name as keyof Omit<
            IBaseContract<T>,
            | 'address'
            | 'provider'
            | 'interface'
            | 'decodeEvents'
            | 'decodeEvent'
            | 'setSender'
            | 'setSimulatedHeight'
            | 'setTransactionDetails'
            | 'setAccessList'
        >;

        return this[key];
    }

    /**
     * Defines the internal functions of the contract. These functions are generated for the ABI provided.
     * @private
     */
    private defineInternalFunctions(): void {
        for (const element of this.interface.abi) {
            switch (element.type) {
                case BitcoinAbiTypes.Function: {
                    // We will allow overwrites.
                    //if (this[element.name]) {
                    //    throw new Error(`Duplicate function found in the ABI: ${element.name}.`);
                    //}

                    if (this.getFunction(element.name)) {
                        continue;
                    }

                    Object.defineProperty(this, element.name, {
                        value: this.callFunction(element).bind(this),
                    });

                    break;
                }
                case BitcoinAbiTypes.Event: {
                    if (this.events.has(element.name)) {
                        throw new Error(`Duplicate event found in the ABI: ${element.name}.`);
                    }

                    this.events.set(element.name, element);
                    break;
                }
                default:
                    throw new Error(`Unsupported type.`);
            }
        }
    }

    private getSelector(element: FunctionBaseData): string {
        let name = element.name;

        if (element.inputs && element.inputs.length) {
            name += '(';
            for (let i = 0; i < element.inputs.length; i++) {
                const input = element.inputs[i];
                const str = AbiTypeToStr[input.type];

                if (!str) {
                    throw new Error(`Unsupported type: ${input.type}`);
                }

                if (i > 0) {
                    name += ',';
                }

                name += str;
            }
            name += ')';
        }

        return name;
    }

    private encodeFunctionData(element: FunctionBaseData, args: unknown[]): BinaryWriter {
        const writer = new BinaryWriter();

        const selectorStr = this.getSelector(element);
        const selector = Number('0x' + bitcoinAbiCoder.encodeSelector(selectorStr));
        writer.writeSelector(selector);

        if (args.length !== (element.inputs?.length ?? 0)) {
            throw new Error('Invalid number of arguments provided');
        }

        if (!element.inputs || (element.inputs && element.inputs.length === 0)) {
            return writer;
        }

        for (let i = 0; i < element.inputs.length; i++) {
            this.encodeInput(writer, element.inputs[i], args[i]);
        }

        return writer;
    }

    private encodeInput(writer: BinaryWriter, abi: BitcoinAbiValue, value: unknown): void {
        const type = abi.type;
        const name = abi.name;

        switch (type) {
            case ABIDataTypes.INT128: {
                if (typeof value !== 'bigint') {
                    throw new Error(`Expected value to be of type bigint (${name})`);
                }
                writer.writeI128(value);
                break;
            }
            case ABIDataTypes.UINT256: {
                if (typeof value !== 'bigint') {
                    throw new Error(`Expected value to be of type bigint (${name})`);
                }
                writer.writeU256(value);
                break;
            }
            case ABIDataTypes.BOOL: {
                if (typeof value !== 'boolean') {
                    throw new Error(`Expected value to be of type boolean (${name})`);
                }
                writer.writeBoolean(value);
                break;
            }
            case ABIDataTypes.STRING: {
                if (typeof value !== 'string') {
                    throw new Error(`Expected value to be of type string (${name})`);
                }
                writer.writeStringWithLength(value);
                break;
            }
            case ABIDataTypes.ADDRESS: {
                if (!value) throw new Error(`Expected value to be of type Address (${name})`);
                if (!('equals' in (value as Address))) {
                    throw new Error(
                        `Expected value to be of type Address (${name}) was ${typeof value}`,
                    );
                }

                writer.writeAddress(value as Address);
                break;
            }
            case ABIDataTypes.UINT8: {
                if (typeof value !== 'number') {
                    throw new Error(`Expected value to be of type number (${name})`);
                }
                writer.writeU8(value);
                break;
            }
            case ABIDataTypes.UINT16: {
                if (typeof value !== 'number') {
                    throw new Error(`Expected value to be of type number (${name})`);
                }
                writer.writeU16(value);
                break;
            }
            case ABIDataTypes.UINT32: {
                if (typeof value !== 'number') {
                    throw new Error(`Expected value to be of type number (${name})`);
                }
                writer.writeU32(value);
                break;
            }
            case ABIDataTypes.BYTES32: {
                if (!(value instanceof Uint8Array)) {
                    throw new Error(`Expected value to be of type Uint8Array (${name})`);
                }
                writer.writeBytes(value);
                break;
            }
            case ABIDataTypes.ADDRESS_UINT256_TUPLE: {
                writer.writeAddressValueTuple(value as AddressMap<bigint>);
                break;
            }
            case ABIDataTypes.BYTES: {
                if (!(value instanceof Uint8Array)) {
                    throw new Error(`Expected value to be of type Uint8Array (${name})`);
                }

                writer.writeBytesWithLength(value);
                break;
            }
            case ABIDataTypes.UINT64: {
                if (typeof value !== 'bigint') {
                    throw new Error(`Expected value to be of type bigint (${name})`);
                }

                writer.writeU64(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_ADDRESSES: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeAddressArray(value as Address[]);
                break;
            }
            case ABIDataTypes.ARRAY_OF_UINT256: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeU256Array(value as bigint[]);
                break;
            }
            case ABIDataTypes.ARRAY_OF_UINT32: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeU32Array(value as number[]);
                break;
            }

            case ABIDataTypes.ARRAY_OF_STRING: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeStringArray(value as string[]);
                break;
            }

            case ABIDataTypes.ARRAY_OF_BYTES: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeBytesArray(value as Uint8Array[]);
                break;
            }

            case ABIDataTypes.ARRAY_OF_UINT64: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeU64Array(value as bigint[]);
                break;
            }

            case ABIDataTypes.ARRAY_OF_UINT8: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeU8Array(value as number[]);
                break;
            }

            case ABIDataTypes.ARRAY_OF_UINT16: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeU16Array(value as number[]);
                break;
            }

            case ABIDataTypes.UINT128: {
                if (typeof value !== 'bigint') {
                    throw new Error(`Expected value to be of type bigint (${name})`);
                }

                writer.writeU128(value);
                break;
            }

            case ABIDataTypes.ARRAY_OF_UINT128: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeU128Array(value as bigint[]);
                break;
            }

            default: {
                throw new Error(`Unsupported type: ${type} (${name})`);
            }
        }
    }

    private decodeOutput(abi: BitcoinAbiValue[], reader: BinaryReader): DecodedOutput {
        const result: Array<DecodedCallResult> = [];
        const obj: ContractDecodedObjectResult = {};

        for (let i = 0; i < abi.length; i++) {
            const type = abi[i].type;
            const name = abi[i].name;

            let decodedResult: DecodedCallResult;
            switch (type) {
                case ABIDataTypes.INT128:
                    decodedResult = reader.readI128();
                    break;
                case ABIDataTypes.UINT256:
                    decodedResult = reader.readU256();
                    break;
                case ABIDataTypes.BOOL:
                    decodedResult = reader.readBoolean();
                    break;
                case ABIDataTypes.STRING:
                    decodedResult = reader.readStringWithLength();
                    break;
                case ABIDataTypes.ADDRESS:
                    decodedResult = reader.readAddress();
                    break;
                case ABIDataTypes.UINT8:
                    decodedResult = reader.readU8();
                    break;
                case ABIDataTypes.UINT16:
                    decodedResult = reader.readU16();
                    break;
                case ABIDataTypes.UINT32:
                    decodedResult = reader.readU32();
                    break;
                case ABIDataTypes.BYTES32:
                    decodedResult = reader.readBytes(32);
                    break;
                case ABIDataTypes.ADDRESS_UINT256_TUPLE:
                    decodedResult = reader.readAddressValueTuple();
                    break;
                case ABIDataTypes.BYTES: {
                    decodedResult = reader.readBytesWithLength();
                    break;
                }
                case ABIDataTypes.UINT64: {
                    decodedResult = reader.readU64();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_ADDRESSES: {
                    decodedResult = reader.readAddressArray();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_UINT256: {
                    decodedResult = reader.readU256Array();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_UINT32: {
                    decodedResult = reader.readU32Array();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_STRING: {
                    decodedResult = reader.readStringArray();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_BYTES: {
                    decodedResult = reader.readBytesArray();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_UINT64: {
                    decodedResult = reader.readU64Array();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_UINT8: {
                    decodedResult = reader.readU8Array();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_UINT16: {
                    decodedResult = reader.readU16Array();
                    break;
                }
                case ABIDataTypes.UINT128: {
                    decodedResult = reader.readU128();
                    break;
                }
                case ABIDataTypes.ARRAY_OF_UINT128: {
                    decodedResult = reader.readU128Array();
                    break;
                }
                default: {
                    throw new Error(`Unsupported type: ${type} (${name})`);
                }
            }

            result.push(decodedResult);
            obj[name] = decodedResult;
        }

        return {
            values: result,
            obj: obj,
        };
    }

    private async estimateGas(gas: bigint): Promise<bigint> {
        const gasParameters = await this.currentGasParameters();

        const gasPerSat = gasParameters.gasPerSat;
        const exactGas = (gas * gasPerSat) / 1000000000000n;

        // Add 25% extra gas
        const finalGas = (exactGas * 100n) / (100n - 30n);
        return this.max(finalGas, 1000n);
    }

    private max(a: bigint, b: bigint): bigint {
        return a > b ? a : b;
    }

    private callFunction(element: FunctionBaseData): (...args: unknown[]) => Promise<CallResult> {
        return async (...args: unknown[]): Promise<CallResult> => {
            const txDetails: ParsedSimulatedTransaction | undefined = this.currentTxDetails;
            const accessList: IAccessList | undefined = this.accessList;
            this.currentTxDetails = undefined;
            this.accessList = undefined;

            const data = this.encodeFunctionData(element, args);
            const buffer = Buffer.from(data.getBuffer());
            const response = await this.provider.call(
                this.address,
                buffer,
                this.from,
                this.simulatedHeight,
                txDetails,
                accessList,
            );

            if ('error' in response) {
                throw new Error(`Error in calling function: ${response.error}`);
            }

            if (response.revert) {
                throw new Error(`Execution Reverted: ${response.revert}`);
            }

            const decoded: DecodedOutput = element.outputs
                ? this.decodeOutput(element.outputs, response.result)
                : { values: [], obj: {} };

            response.setTo(this.p2trOrTweaked);
            response.setDecoded(decoded);
            response.setCalldata(buffer);

            const gas = await this.estimateGas(response.estimatedGas || 0n);
            const gasRefunded = await this.estimateGas(response.refundedGas || 0n);

            response.setGasEstimation(gas, gasRefunded);
            response.setEvents(this.decodeEvents(response.rawEvents));

            return response;
        };
    }
}

/**
 * Represents the base contract class.
 * @category Contracts
 */
export class BaseContract<T extends BaseContractProperties> extends IBaseContract<T> {
    constructor(
        address: string | Address,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
        network: Network,
        sender?: Address,
    ) {
        super(address, abi, provider, network, sender);

        return this.proxify();
    }

    /**
     * Proxifies the contract to allow for type checking.
     * @private
     */
    private proxify(): T & BaseContract<T> {
        return new Proxy(this, {
            get: (target: BaseContract<T>, prop: typeof internal, receiver) => {
                if (typeof prop === 'symbol' || prop in target) {
                    return Reflect.get(target, prop, receiver);
                }

                // Undefined properties should return undefined
                try {
                    return this.getFunction(prop);
                } catch (error: unknown) {
                    if (!(error instanceof Error)) {
                        throw new Error(
                            `Something went wrong when trying to get the function: ${error}`,
                        );
                    } else {
                        throw error;
                    }
                }
            },
            has: (target, prop) => {
                if (typeof prop === 'symbol' || prop in target) {
                    return Reflect.has(target, prop);
                }

                return target.interface.hasFunction(prop);
            },
        }) as BaseContract<T> & T;
    }
}

/**
 * Creates a new contract class.
 */
function contractBase<T extends BaseContractProperties>(): new (
    address: string | Address,
    abi: BitcoinInterface | BitcoinInterfaceAbi,
    provider: AbstractRpcProvider,
    network: Network,
    sender?: Address,
) => BaseContract<T> & Omit<T, keyof BaseContract<T>> {
    return BaseContract as new (
        address: string | Address,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
        network: Network,
        sender?: Address,
    ) => BaseContract<T> & Omit<T, keyof BaseContract<T>>;
}

/**
 * Creates a new contract instance.
 * @param {string | Address} address The address of the contract.
 * @param {BitcoinInterface | BitcoinInterfaceAbi} abi The ABI of the contract.
 * @param {AbstractRpcProvider} provider The provider for the contract.
 * @param {Address} [sender] Who is sending the transaction.
 * @param {Network} [network] The network of the contract.
 * @returns {BaseContract<T> & Omit<T, keyof BaseContract<T>>} The contract instance.
 * @template T The properties of the contract.
 * @category Contracts
 *
 * @example
 * const contractAddress: string | Address = 'bcrt1p9p97ftxmx25ehgltlfn2j8wmgxnm0gwjlm6p2wveytxc5pzgtspqx93dy5';
 * const senderAddress: Address = new Address([
 *    40, 11, 228, 172, 219, 50, 169, 155, 163, 235, 250, 102, 169, 29, 219, 65, 167, 183, 161, 210,
 *    254, 244, 21, 57, 153, 34, 205, 138, 4, 72, 92, 2,
 * ]);
 * const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org');
 * const contract: IOP_20Contract = getContract<IOP_20Contract>(
 *     contractAddress,
 *     OP_20_ABI,
 *     provider,
 *     networks.regtest,
 *     senderAddress,
 * );
 *
 * const balanceExample = await contract.balanceOf(
 *     senderAddress
 * );
 *
 * if ('error' in balanceExample) throw new Error('Error in fetching balance');
 * console.log('Balance:', balanceExample.decoded);
 */
export function getContract<T extends BaseContractProperties>(
    address: string | Address,
    abi: BitcoinInterface | BitcoinInterfaceAbi,
    provider: AbstractRpcProvider,
    network: Network,
    sender?: Address,
): BaseContract<T> & Omit<T, keyof BaseContract<T>> {
    const base = contractBase<T>();

    return new base(address, abi, provider, network, sender);
}
