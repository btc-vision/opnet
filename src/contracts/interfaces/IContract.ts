import { BitcoinAddressLike } from '../../common/CommonTypes.js';

export interface IContract {
    readonly address: BitcoinAddressLike;
}
