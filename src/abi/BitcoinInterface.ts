import { BitcoinAbiTypes } from './BitcoinAbiTypes.js';
import { BitcoinAbiValue } from './interfaces/BitcoinAbiValue.js';
import { BitcoinInterfaceAbi } from './interfaces/BitcoinInterfaceAbi.js';

/**
 * @description This class is used to provide a Bitcoin interface.
 * @cathegory Abi
 */
export class BitcoinInterface {
    public readonly abi: BitcoinInterfaceAbi;

    constructor(abi: BitcoinInterfaceAbi) {
        this.verifyAbi(abi);

        this.abi = abi;
    }

    public static from(abi: BitcoinInterface | BitcoinInterfaceAbi): BitcoinInterface {
        if (abi instanceof BitcoinInterface) {
            return abi;
        }

        return new BitcoinInterface(abi);
    }

    public hasFunction(name: string): boolean {
        return this.abi.some(
            (element) => element.name === name && element.type === BitcoinAbiTypes.Function,
        );
    }

    public hasEvent(name: string): boolean {
        return this.abi.some(
            (element) => element.name === name && element.type === BitcoinAbiTypes.Event,
        );
    }

    private verifyAbi(abi: BitcoinInterfaceAbi): void {
        if (abi.length === 0) {
            throw new Error('The ABI provided is empty.');
        }

        for (let i = 0; i < abi.length; i++) {
            const element = abi[i];

            if (!element.name) {
                throw new Error('The ABI provided is missing a name.');
            }

            if (!element.type) {
                throw new Error('The ABI provided is missing a type.');
            }

            if (element.type === BitcoinAbiTypes.Function) {
                if (element.inputs && element.inputs?.length) this.verifyAbiValues(element.inputs);
                if (element.outputs && element.outputs?.length) {
                    this.verifyAbiValues(element.outputs);
                }
            } else if (element.type === BitcoinAbiTypes.Event) {
                if (element.values && element.values?.length) this.verifyAbiValues(element.values);
            }
        }
    }

    private verifyAbiValues(inputs: BitcoinAbiValue[]): void {
        for (let j = 0; j < inputs.length; j++) {
            const input = inputs[j];

            if (!input.name) {
                throw new Error('The ABI provided is missing an input name.');
            }

            if (!input.type) {
                throw new Error('The ABI provided is missing an input type.');
            }
        }
    }
}
