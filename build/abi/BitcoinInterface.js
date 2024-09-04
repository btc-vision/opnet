import { BitcoinAbiTypes } from './BitcoinAbiTypes.js';
export class BitcoinInterface {
    constructor(abi) {
        this.verifyAbi(abi);
        this.abi = abi;
    }
    static from(abi) {
        if (abi instanceof BitcoinInterface) {
            return abi;
        }
        return new BitcoinInterface(abi);
    }
    hasFunction(name) {
        return this.abi.some((element) => element.name === name && element.type === BitcoinAbiTypes.Function);
    }
    hasEvent(name) {
        return this.abi.some((element) => element.name === name && element.type === BitcoinAbiTypes.Event);
    }
    verifyAbi(abi) {
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
                if (element.inputs && element.inputs.length)
                    this.verifyAbiValues(element.inputs);
                if (element.outputs && element.outputs.length) {
                    this.verifyAbiValues(element.outputs);
                }
            }
            else if (element.type === BitcoinAbiTypes.Event) {
                if (element.values && element.values.length)
                    this.verifyAbiValues(element.values);
            }
        }
    }
    verifyAbiValues(inputs) {
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
