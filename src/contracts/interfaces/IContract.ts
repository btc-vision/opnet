import { BitcoinAddressLike } from '../../common/CommonTypes.js';

/**
 * @description This interface is used to define a contract.
 * @interface IContract
 * @category Contracts
 */
export interface IContract {
    readonly address: BitcoinAddressLike;
}
