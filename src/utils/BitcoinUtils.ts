import BigNumber from 'bignumber.js';
import { BigNumberish } from '../common/CommonTypes.js';

/**
 * Bitcoin Utilities
 * @description This class is used to provide utility functions for Bitcoin.
 * @class BitcoinUtils
 * @category Utils
 */
export class BitcoinUtils {
    /**
     * Get Satoshis or any other unit, bitcoin by default.
     * @description This function is used to format a value in satoshis to Bitcoin.
     * @param value Value in satoshis or any other unit
     * @param decimals Default is 8
     */
    public static formatUnits(value: BigNumberish, decimals: number = 8): string {
        const bn: BigNumber = new BigNumber(value.toString());

        return bn.dividedBy(new BigNumber(10).pow(decimals)).toString();
    }
}
