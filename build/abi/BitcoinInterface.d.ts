import { BitcoinInterfaceAbi } from './interfaces/BitcoinInterfaceAbi.js';
export declare class BitcoinInterface {
    readonly abi: BitcoinInterfaceAbi;
    constructor(abi: BitcoinInterfaceAbi);
    static from(abi: BitcoinInterface | BitcoinInterfaceAbi): BitcoinInterface;
    hasFunction(name: string): boolean;
    hasEvent(name: string): boolean;
    private verifyAbi;
    private verifyAbiValues;
}
