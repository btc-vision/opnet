import { BitcoinAbiTypes } from '../BitcoinAbiTypes.js';
import { BitcoinAbiValue } from './BitcoinAbiValue.js';

export interface BitcoinInterfaceAbiBase {
    readonly constant?: boolean;
    readonly name: string;

    readonly inputs?: BitcoinAbiValue[];
    readonly outputs?: BitcoinAbiValue[];

    readonly type: BitcoinAbiTypes;
    readonly payable?: boolean;
}

export type BitcoinInterfaceAbi = BitcoinInterfaceAbiBase[];
