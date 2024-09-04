import { Address } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_20Contract } from './IOP_20Contract.js';
export interface IMotoContract extends IOP_20Contract {
    airdrop(list: Map<Address, bigint>): Promise<BaseContractProperty>;
}
