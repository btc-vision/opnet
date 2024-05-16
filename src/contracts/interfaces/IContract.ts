import { NetEvent } from '@btc-vision/bsi-binary';
import { BitcoinAddressLike } from '../../common/CommonTypes.js';
import { OPNetEvent } from '../OPNetEvent.js';

/**
 * @description This interface is used to define a contract.
 * @interface IContract
 * @category Contracts
 */
export interface IContract {
    readonly address: BitcoinAddressLike;

    decodeEvents(events: NetEvent[]): OPNetEvent[];
}
