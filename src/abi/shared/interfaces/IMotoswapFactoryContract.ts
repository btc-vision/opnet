import { Address } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_NETContract } from './IOP_NETContract.js';

/**
 * @description This is the interface that represent the MotoSwap Factory contract.
 * @interface IMotoswapFactoryContract
 * @extends {IOP_NETContract}
 * @cathegory Contracts
 */
export interface IMotoswapFactoryContract extends IOP_NETContract {
    /**
     * @description This method returns the pool address for the given tokens.
     * @param {Address} token0 The first token address
     * @param {Address} token1 The second token address
     * @returns {Promise<BaseContractProperty>} Return the requested pool virtual address as bigint.
     */
    getPool(token0: Address, token1: Address): Promise<BaseContractProperty>;

    /**
     * @description This method creates a new pool for the given tokens.
     * @param {Address} token0 The first token address
     * @param {Address} token1 The second token address
     * @returns {Promise<BaseContractProperty>} Return the pool virtual address as bigint and the actual pool address.
     */
    createPool(token0: Address, token1: Address): Promise<BaseContractProperty>;
}
