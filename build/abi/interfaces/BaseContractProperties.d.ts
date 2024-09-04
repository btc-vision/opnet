import { IContract } from '../../contracts/interfaces/IContract.js';
import { BaseContractProperty } from '../BaseContractProperty.js';
export interface BaseContractProperties extends IContract {
    [key: symbol]: BaseContractProperty;
}
