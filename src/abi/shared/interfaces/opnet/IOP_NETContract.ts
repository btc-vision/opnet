import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { BaseContractProperties } from '../../../interfaces/BaseContractProperties.js';

/**
 * @description This interface represents the OP_NET base contract.
 * @interface IOP_NETContract
 * @extends {BaseContractProperties}
 * @cathegory Contracts
 */
export interface IOP_NETContract extends BaseContractProperties {
    deployer(): Promise<CallResult<{ deployer: Address }>>;
}
