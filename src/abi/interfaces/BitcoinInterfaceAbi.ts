import { BitcoinAbiTypes } from '../BitcoinAbiTypes.js';
import { BitcoinAbiValue } from './BitcoinAbiValue.js';

/**
 * @description This interface is used to define the Bitcoin interface ABI.
 * @cathegory Abi
 */
export interface BitcoinInterfaceAbiBase<T extends BitcoinAbiTypes> {
    readonly name: string;

    readonly type: T;
}

export interface FunctionBaseData extends BitcoinInterfaceAbiBase<BitcoinAbiTypes.Function> {
    readonly constant?: boolean;
    readonly payable?: boolean;

    readonly inputs?: BitcoinAbiValue[];
    readonly outputs?: BitcoinAbiValue[];
}

export interface EventBaseData extends BitcoinInterfaceAbiBase<BitcoinAbiTypes.Event> {
    readonly values: BitcoinAbiValue[];
}

export type BitcoinInterfaceAbi = (FunctionBaseData | EventBaseData)[];
