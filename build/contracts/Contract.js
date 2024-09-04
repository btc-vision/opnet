import { ABICoder, ABIDataTypes, BinaryReader, BinaryWriter, } from '@btc-vision/bsi-binary';
import { BitcoinAbiTypes } from '../abi/BitcoinAbiTypes.js';
import { BitcoinInterface } from '../abi/BitcoinInterface.js';
import { OPNetEvent } from './OPNetEvent.js';
const internal = Symbol.for('_btc_internal');
const bitcoinAbiCoder = new ABICoder();
export class IBaseContract {
    constructor(address, abi, provider, from) {
        this.events = new Map();
        this.address = address;
        this.provider = provider;
        this.interface = BitcoinInterface.from(abi);
        this.from = from;
        Object.defineProperty(this, internal, { value: {} });
        this.defineInternalFunctions();
    }
    setSender(sender) {
        this.from = sender;
    }
    decodeEvents(events) {
        const decodedEvents = [];
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
    decodeEvent(event) {
        const eventData = this.events.get(event.eventType);
        if (!eventData || eventData.values.length === 0) {
            return new OPNetEvent(event.eventType, event.eventDataSelector, event.eventData);
        }
        const binaryReader = new BinaryReader(event.eventData);
        const out = this.decodeOutput(eventData.values, binaryReader);
        const decodedEvent = new OPNetEvent(event.eventType, event.eventDataSelector, event.eventData);
        decodedEvent.setDecoded(out);
        return decodedEvent;
    }
    encodeCalldata(functionName, args) {
        for (const element of this.interface.abi) {
            if (element.name === functionName) {
                const data = this.encodeFunctionData(element, args);
                return Buffer.from(data.getBuffer());
            }
        }
        throw new Error(`Function not found: ${functionName}`);
    }
    getFunction(name) {
        const key = name;
        return this[key];
    }
    defineInternalFunctions() {
        for (const element of this.interface.abi) {
            switch (element.type) {
                case BitcoinAbiTypes.Function: {
                    if (this[element.name]) {
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
    encodeFunctionData(element, args) {
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
    encodeInput(writer, abi, value) {
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
                const address = value;
                writer.writeAddress(address.toString());
                break;
            }
            case ABIDataTypes.TUPLE: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeTuple(value);
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
                writer.writeAddressValueTupleMap(value);
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
                writer.writeAddressArray(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_UINT256: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeU256Array(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_UINT32: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeU32Array(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_STRING: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeStringArray(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_BYTES: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeBytesArray(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_UINT64: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeU64Array(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_UINT8: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeU8Array(value);
                break;
            }
            case ABIDataTypes.ARRAY_OF_UINT16: {
                if (!(value instanceof Array)) {
                    throw new Error(`Expected value to be of type Array (${name})`);
                }
                writer.writeU16Array(value);
                break;
            }
            default: {
                throw new Error(`Unsupported type: ${type} (${name})`);
            }
        }
    }
    decodeOutput(abi, reader) {
        const result = [];
        const obj = {};
        for (let i = 0; i < abi.length; i++) {
            const type = abi[i].type;
            const name = abi[i].name;
            let decodedResult;
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
    callFunction(element) {
        return async (...args) => {
            const data = this.encodeFunctionData(element, args);
            const buffer = Buffer.from(data.getBuffer());
            const response = await this.provider.call(this.address, buffer, this.from);
            if ('error' in response) {
                return response;
            }
            const decoded = element.outputs
                ? this.decodeOutput(element.outputs, response.result)
                : { values: [], obj: {} };
            response.setDecoded(decoded);
            response.setCalldata(buffer);
            return response;
        };
    }
}
export class BaseContract extends IBaseContract {
    constructor(address, abi, provider, sender) {
        super(address, abi, provider, sender);
        return this.proxify();
    }
    proxify() {
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (typeof prop === 'symbol' || prop in target) {
                    return Reflect.get(target, prop, receiver);
                }
                try {
                    return this.getFunction(prop);
                }
                catch (error) {
                    if (!(error instanceof Error)) {
                        throw new Error(`Something went wrong when trying to get the function: ${error}`);
                    }
                    else {
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
        });
    }
}
function contractBase() {
    return BaseContract;
}
export function getContract(address, abi, provider, sender) {
    const base = contractBase();
    return new base(address, abi, provider, sender);
}
