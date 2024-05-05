import { BitcoinAbiTypes } from '../BitcoinAbiTypes.js';
import { BitcoinAbiValue } from './BitcoinAbiValue.js';

/**
 * @description This interface is used to define the Bitcoin interface ABI.
 * @cathegory Abi
 */
export interface BitcoinInterfaceAbiBase {
    readonly constant?: boolean;
    readonly name: string;

    readonly inputs?: BitcoinAbiValue[];
    readonly outputs?: BitcoinAbiValue[];

    readonly type: BitcoinAbiTypes;
    readonly payable?: boolean;
}

export type BitcoinInterfaceAbi = BitcoinInterfaceAbiBase[];
