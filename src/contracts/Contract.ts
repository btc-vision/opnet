import { ABICoder, ABIDataTypes, BinaryReader, BinaryWriter } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BitcoinAbiTypes } from '../abi/BitcoinAbiTypes.js';
import { BitcoinInterface } from '../abi/BitcoinInterface.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinAbiValue } from '../abi/interfaces/BitcoinAbiValue.js';
import {
    BitcoinInterfaceAbi,
    BitcoinInterfaceAbiBase,
} from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike, DecodedCallResult } from '../common/CommonTypes.js';
import { AbstractRpcProvider } from '../providers/AbstractRpcProvider.js';
import { IContract } from './interfaces/IContract.js';

const internal = Symbol.for('_btc_internal');
const bitcoinAbiCoder = new ABICoder();

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

    private events: object[] = [];

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

    protected getFunction(
        name: symbol,
    ): BaseContractProperty | undefined | string | number | symbol {
        const key = name as keyof Omit<IBaseContract<T>, 'address' | 'provider' | 'interface'>;

        // @ts-ignore
        return this[key];
    }

    /**
     * Defines the internal functions of the contract. These functions are generated for the ABI provided.
     * @private
     */
    private defineInternalFunctions(): void {
        for (const element of this.interface.abi) {
            switch (element.type) {
                case BitcoinAbiTypes.Function:
                    Object.defineProperty(this, element.name, {
                        value: this.callFunction(element).bind(this),
                    });

                    break;
                case BitcoinAbiTypes.Event:
                    this.events.push(element);
                    break;
                default:
                    break;
            }
        }
    }

    private encodeFunctionData(element: BitcoinInterfaceAbiBase, args: unknown[]): BinaryWriter {
        const writer = new BinaryWriter();
        const selector = Number('0x' + bitcoinAbiCoder.encodeSelector(element.name));
        writer.writeSelector(selector);

        if (args.length !== element.inputs!.length) {
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

    private decodeOutput(abi: BitcoinAbiValue[], reader: BinaryReader): Array<DecodedCallResult> {
        const result: Array<DecodedCallResult> = [];

        for (let i = 0; i < abi.length; i++) {
            const type = abi[i].type;
            const name = abi[i].name;

            switch (type) {
                case ABIDataTypes.UINT256:
                    result.push(reader.readU256());
                    break;
                case ABIDataTypes.BOOL:
                    result.push(reader.readBoolean());
                    break;
                case ABIDataTypes.STRING:
                    result.push(reader.readStringWithLength());
                    break;
                case ABIDataTypes.ADDRESS:
                    result.push(reader.readAddress());
                    break;
                case ABIDataTypes.TUPLE:
                    result.push(reader.readTuple());
                    break;
                case ABIDataTypes.UINT8:
                    result.push(reader.readU8());
                    break;
                case ABIDataTypes.UINT16:
                    result.push(reader.readU16());
                    break;
                case ABIDataTypes.UINT32:
                    result.push(reader.readU32());
                    break;
                case ABIDataTypes.BYTES32:
                    result.push(reader.readBytes(32));
                    break;
                default:
                    throw new Error(`Unsupported type: ${type} (${name})`);
            }
        }

        return result;
    }

    private callFunction(
        element: BitcoinInterfaceAbiBase,
    ): (...args: unknown[]) => Promise<BaseContractProperty> {
        return async (...args: unknown[]): Promise<BaseContractProperty> => {
            const data = this.encodeFunctionData(element, args);
            const response = await this.provider.call(this.address, Buffer.from(data.getBuffer()));

            if ('error' in response) {
                return response;
            }

            const decoded = element.outputs
                ? this.decodeOutput(element.outputs, response.result)
                : [];
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
