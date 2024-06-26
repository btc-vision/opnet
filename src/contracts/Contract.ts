import {
    ABICoder,
    ABIDataTypes,
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
     * The internal functions of the contract.
     * @protected
     */
    readonly [internal]: keyof T | undefined;

    private events: Map<string, EventBaseData> = new Map();

    protected constructor(
        address: BitcoinAddressLike,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
    ) {
        this.address = address;
        this.provider = provider;
        this.interface = BitcoinInterface.from(abi);

        Object.defineProperty(this, internal, { value: {} });

        this.defineInternalFunctions();
    }

    public decodeEvents(events: NetEvent[] | ContractEvents): OPNetEvent[] {
        const decodedEvents: OPNetEvent[] = [];

        if (!Array.isArray(events)) {
            events = events[this.address.toString()];

            if (!events) {
                return [];
            }
        }

        for (let event of events) {
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

    protected getFunction(
        name: symbol,
    ): BaseContractProperty | undefined | string | number | symbol {
        const key = name as keyof Omit<
            IBaseContract<T>,
            'address' | 'provider' | 'interface' | 'decodeEvents' | 'decodeEvent'
        >;

        // @ts-ignore
        return this[key];
    }

    /**
     * Defines the internal functions of the contract. These functions are generated for the ABI provided.
     * @private
     */
    private defineInternalFunctions(): void {
        for (const element of this.interface.abi) {
            // @ts-ignore
            if (this[element.name]) {
                throw new Error(
                    `Please do not name your method "${element.name}" inside your ABI. This is a reserved keyword.`,
                );
            }

            switch (element.type) {
                case BitcoinAbiTypes.Function:
                    Object.defineProperty(this, element.name, {
                        value: this.callFunction(element as FunctionBaseData).bind(this),
                    });

                    break;
                case BitcoinAbiTypes.Event:
                    this.events.set(element.name, element);
                    break;
                default:
                    break;
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
            case ABIDataTypes.UINT256:
                if (typeof value !== 'bigint') {
                    throw new Error(`Expected value to be of type bigint (${name})`);
                }
                writer.writeU256(value as bigint);
                break;
            case ABIDataTypes.BOOL:
                if (typeof value !== 'boolean') {
                    throw new Error(`Expected value to be of type boolean (${name})`);
                }
                writer.writeBoolean(value as boolean);
                break;
            case ABIDataTypes.STRING:
                if (typeof value !== 'string') {
                    throw new Error(`Expected value to be of type string (${name})`);
                }
                writer.writeStringWithLength(value as string);
                break;
            case ABIDataTypes.ADDRESS:
                const address = value as BitcoinAddressLike;
                writer.writeAddress(address.toString());
                break;
            case ABIDataTypes.TUPLE:
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }

                writer.writeTuple(value as bigint[]);
                break;
            case ABIDataTypes.UINT8:
                if (typeof value !== 'number') {
                    throw new Error(`Expected value to be of type number (${name})`);
                }
                writer.writeU8(value as number);
                break;
            case ABIDataTypes.UINT16:
                if (typeof value !== 'number') {
                    throw new Error(`Expected value to be of type number (${name})`);
                }
                writer.writeU16(value as number);
                break;
            case ABIDataTypes.UINT32:
                if (typeof value !== 'number') {
                    throw new Error(`Expected value to be of type number (${name})`);
                }
                writer.writeU32(value as number);
                break;
            case ABIDataTypes.BYTES32:
                if (!(value instanceof Uint8Array)) {
                    throw new Error(`Expected value to be of type Uint8Array (${name})`);
                }
                writer.writeBytes(value as Uint8Array);
                break;
            default:
                throw new Error(`Unsupported type: ${type} (${name})`);
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
            const response = await this.provider.call(this.address, buffer);

            if ('error' in response) {
                return response;
            }

            const decoded: DecodedOutput = element.outputs
                ? this.decodeOutput(element.outputs, response.result)
                : { values: [], obj: {} };

            response.setDecoded(decoded);

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
    ) {
        super(address, abi, provider);

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
) => BaseContract<T> & Omit<T, keyof BaseContract<T>> {
    return BaseContract as new (
        address: BitcoinAddressLike,
        abi: BitcoinInterface | BitcoinInterfaceAbi,
        provider: AbstractRpcProvider,
    ) => BaseContract<T> & Omit<T, keyof BaseContract<T>>;
}

/**
 * Creates a new contract instance.
 * @param {BitcoinAddressLike} address The address of the contract.
 * @param {BitcoinInterface | BitcoinInterfaceAbi} abi The ABI of the contract.
 * @param {AbstractRpcProvider} provider The provider for the contract.
 * @returns {BaseContract<T> & Omit<T, keyof BaseContract<T>>} The contract instance.
 * @template T The properties of the contract.
 * @category Contracts
 */
export function getContract<T extends BaseContractProperties>(
    address: BitcoinAddressLike,
    abi: BitcoinInterface | BitcoinInterfaceAbi,
    provider: AbstractRpcProvider,
): BaseContract<T> & Omit<T, keyof BaseContract<T>> {
    const base = contractBase<T>();

    return new base(address, abi, provider);
}
