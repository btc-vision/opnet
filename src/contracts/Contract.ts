import {
    ABICoder,
    ABIDataTypes,
    Address,
    BinaryReader,
    BinaryWriter,
    NetEvent,
} from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BitcoinAbiTypes } from '../abi/BitcoinAbiTypes.js';
import { BitcoinInterface } from '../abi/BitcoinInterface.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinAbiValue } from '../abi/interfaces/BitcoinAbiValue.js';
import {
    BitcoinInterfaceAbi,
    EventBaseData,
    FunctionBaseData,
} from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike, DecodedCallResult } from '../common/CommonTypes.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { ContractEvents } from '../transactions/interfaces/ITransactionReceipt.js';
import { IContract } from './interfaces/IContract.js';
import { OPNetEvent } from './OPNetEvent.js';

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
    public readonly address: BitcoinAddressLike;

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

    protected constructor(
        address: BitcoinAddressLike,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
        from?: Address,
    ) {
        this.address = address;
        this.provider = provider;
        this.interface = BitcoinInterface.from(abi);
        this.from = from;

        Object.defineProperty(this, internal, { value: {} });

        this.defineInternalFunctions();
    }

    /**
     * Sets the sender of the transaction.
     * @param {Address} sender The sender of the transaction.
     */
    public setSender(sender: Address): void {
        this.from = sender;
    }

    public decodeEvents(events: NetEvent[] | ContractEvents): OPNetEvent[] {
        const decodedEvents: OPNetEvent[] = [];

        if (!Array.isArray(events)) {
            events = events[this.address.toString()];

            if (!events) {
                return [];
            }
        }

        for (const event of events) {
            decodedEvents.push(this.decodeEvent(event));
        }

        return decodedEvents;
    }

    public decodeEvent(event: NetEvent): OPNetEvent {
        const eventData = this.events.get(event.eventType);
        if (!eventData || eventData.values.length === 0) {
            return new OPNetEvent(event.eventType, event.eventDataSelector, event.eventData);
        }

        const binaryReader: BinaryReader = new BinaryReader(event.eventData);
        const out: DecodedOutput = this.decodeOutput(eventData.values, binaryReader);
        const decodedEvent = new OPNetEvent(
            event.eventType,
            event.eventDataSelector,
            event.eventData,
        );

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

    protected getFunction(
        name: symbol | string,
    ):
        | BaseContractProperty
        | undefined
        | string
        | number
        | symbol
        | ((functionName: string, args: unknown[]) => Buffer) {
        const key = name as keyof Omit<
            IBaseContract<T>,
            'address' | 'provider' | 'interface' | 'decodeEvents' | 'decodeEvent' | 'setSender'
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

    private encodeFunctionData(element: FunctionBaseData, args: unknown[]): BinaryWriter {
        const writer = new BinaryWriter();
        const selector = Number('0x' + bitcoinAbiCoder.encodeSelector(element.name));
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
                const address = value as BitcoinAddressLike;
                writer.writeAddress(address.toString());
                break;
            }
            case ABIDataTypes.TUPLE: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeTuple(value as bigint[]);
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
                if (!(value instanceof Map)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeAddressValueTupleMap(value as Map<Address, bigint>);
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
                case ABIDataTypes.TUPLE:
                    decodedResult = reader.readTuple();
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
                default:
                    throw new Error(`Unsupported type: ${type} (${name})`);
            }

            result.push(decodedResult);
            obj[name] = decodedResult;
        }

        return {
            values: result,
            obj: obj,
        };
    }

    private callFunction(
        element: FunctionBaseData,
    ): (...args: unknown[]) => Promise<BaseContractProperty> {
        return async (...args: unknown[]): Promise<BaseContractProperty> => {
            const data = this.encodeFunctionData(element, args);
            const buffer = Buffer.from(data.getBuffer());
            const response = await this.provider.call(this.address, buffer, this.from);

            if ('error' in response) {
                return response;
            }

            const decoded: DecodedOutput = element.outputs
                ? this.decodeOutput(element.outputs, response.result)
                : { values: [], obj: {} };

            response.setDecoded(decoded);
            response.setCalldata(buffer);

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
        address: BitcoinAddressLike,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
        sender?: Address,
    ) {
        super(address, abi, provider, sender);

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
    address: BitcoinAddressLike,
    abi: BitcoinInterface | BitcoinInterfaceAbi,
    provider: AbstractRpcProvider,
    sender?: Address,
) => BaseContract<T> & Omit<T, keyof BaseContract<T>> {
    return BaseContract as new (
        address: BitcoinAddressLike,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
        sender?: Address,
    ) => BaseContract<T> & Omit<T, keyof BaseContract<T>>;
}

/**
 * Creates a new contract instance.
 * @param {BitcoinAddressLike} address The address of the contract.
 * @param {BitcoinInterface | BitcoinInterfaceAbi} abi The ABI of the contract.
 * @param {AbstractRpcProvider} provider The provider for the contract.
 * @param {Address} [sender] Who is sending the transaction.
 * @returns {BaseContract<T> & Omit<T, keyof BaseContract<T>>} The contract instance.
 * @template T The properties of the contract.
 * @category Contracts
 *
 * @example
 * const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org');
 * const contract: IOP_20Contract = getContract<IOP_20Contract>(
 *     'bcrt1qxeyh0pacdtkqmlna9n254fztp3ptadkkfu6efl',
 *     OP_20_ABI,
 *     provider,
 * );
 *
 * const balanceExample = await contract.balanceOf(
 *     'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
 * );
 *
 * if ('error' in balanceExample) throw new Error('Error in fetching balance');
 * console.log('Balance:', balanceExample.decoded);
 */
export function getContract<T extends BaseContractProperties>(
    address: BitcoinAddressLike,
    abi: BitcoinInterface | BitcoinInterfaceAbi,
    provider: AbstractRpcProvider,
    sender?: Address,
): BaseContract<T> & Omit<T, keyof BaseContract<T>> {
    const base = contractBase<T>();

    return new base(address, abi, provider, sender);
}
