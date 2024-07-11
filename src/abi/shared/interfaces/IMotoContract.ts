import { Address } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_20Contract } from './IOP_20Contract.js';

/**
 * @description This interface represents the Moto token contract.
 * @interface IMotoContract
 * @extends {IOP_20Contract}
 * @cathegory Contracts
 */
export interface IMotoContract extends IOP_20Contract {
    /**
     * @description This method call an airdrop to the given list of addresses.
     * @returns {Promise<BaseContractProperty>}
     */
    airdrop(list: Map<Address, bigint>): Promise<BaseContractProperty>;
}
