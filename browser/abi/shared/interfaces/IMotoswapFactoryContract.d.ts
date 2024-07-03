import { Address } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_NETContract } from './IOP_NETContract.js';
export interface IMotoswapFactoryContract extends IOP_NETContract {
    getPool(token0: Address, token1: Address): Promise<BaseContractProperty>;
    createPool(token0: Address, token1: Address): Promise<BaseContractProperty>;
}
