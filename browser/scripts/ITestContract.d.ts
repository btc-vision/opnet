import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinInterfaceAbi } from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';
export interface WBTCContract extends BaseContractProperties {
    balanceOf(address: BitcoinAddressLike): Promise<BaseContractProperty>;
    owner(): Promise<BaseContractProperty>;
}
export declare const wBTCAbi: BitcoinInterfaceAbi;
