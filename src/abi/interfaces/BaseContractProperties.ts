import { CallResult } from '../../contracts/CallResult.js';
import { IContract } from '../../contracts/interfaces/IContract.js';

/**
 * Base contract properties.
 * @cathegory Interfaces
 */
export interface BaseContractProperties extends IContract {
    [key: symbol]: CallResult;
}
