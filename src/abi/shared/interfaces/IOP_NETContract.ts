import { BitcoinAddressLike } from '../../../common/CommonTypes.js';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { BaseContractProperties } from '../../interfaces/BaseContractProperties.js';

/**
 * @description This interface represents the OP_NET base contract.
 * @interface IOP_NETContract
 * @extends {BaseContractProperties}
 * @cathegory Contracts
 */
export interface IOP_NETContract extends BaseContractProperties {
    owner(): Promise<BaseContractProperty>;

    isAddressOwner(address: BitcoinAddressLike): Promise<BaseContractProperty>;
}
