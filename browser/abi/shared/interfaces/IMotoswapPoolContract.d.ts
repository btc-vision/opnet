import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_20Contract } from './IOP_20Contract.js';
export interface IMotoswapPoolContract extends Omit<IOP_20Contract, 'burn' | 'mint'> {
    token0(): Promise<BaseContractProperty>;
    token1(): Promise<BaseContractProperty>;
    getReserves(): Promise<BaseContractProperty>;
    swap(amount0Out: bigint, amount1Out: bigint, to: string, data: Uint8Array): Promise<BaseContractProperty>;
    burn(amount0: bigint, amount1: bigint): Promise<BaseContractProperty>;
    sync(): Promise<BaseContractProperty>;
    price0CumulativeLast(): Promise<BaseContractProperty>;
    price1CumulativeLast(): Promise<BaseContractProperty>;
}
