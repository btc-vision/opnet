import { IContract } from '../../contracts/interfaces/IContract.js';
import { BaseContractProperty } from '../BaseContractProperty.js';

/**
 * Base contract properties.
 * @cathegory Interfaces
 */
export interface BaseContractProperties extends IContract {
    [key: symbol]: BaseContractProperty;
}
