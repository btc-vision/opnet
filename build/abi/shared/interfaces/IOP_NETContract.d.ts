import { BitcoinAddressLike } from '../../../common/CommonTypes.js';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { BaseContractProperties } from '../../interfaces/BaseContractProperties.js';
export interface IOP_NETContract extends BaseContractProperties {
    owner(): Promise<BaseContractProperty>;
    isAddressOwner(address: BitcoinAddressLike): Promise<BaseContractProperty>;
}
