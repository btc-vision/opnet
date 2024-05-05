import { CallResult } from '../contracts/CallResult.js';
import { ICallRequestError } from '../contracts/interfaces/ICallResult.js';

/**
 * @description This type is used to represent a base contract property.
 * @cathegory Abi
 */
export type BaseContractProperty = CallResult | ICallRequestError;
