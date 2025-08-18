import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

export type PoolCreatedEvent = {
    readonly token0: Address;
    readonly token1: Address;
    readonly pool: Address;
};

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
     * @returns {Promise<CallResult<{pool: Address}>>} Return the requested pool virtual address as bigint.
     */
    getPool(token0: Address, token1: Address): Promise<CallResult<{ pool: Address }>>;

    /**
     * @description This method creates a new pool for the given tokens.
     * @param {Address} token0 The first token address
     * @param {Address} token1 The second token address
     * @returns {Promise<CallResult<{address: Address}>>} Return the pool virtual address as bigint and the actual pool address.
     */
    createPool(
        token0: Address,
        token1: Address,
    ): Promise<CallResult<{ address: Address }, [OPNetEvent<PoolCreatedEvent>]>>;

    setStakingContractAddress(stakingContractAddress: Address): Promise<CallResult>;

    getStakingContractAddress(): Promise<CallResult<{ stakingContractAddress: Address }>>;
}
