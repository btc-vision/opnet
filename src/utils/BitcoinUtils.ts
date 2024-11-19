import BigNumber from 'bignumber.js';
import { BigNumberish } from '../common/CommonTypes.js';

BigNumber.config({
    EXPONENTIAL_AT: 1e9,
    DECIMAL_PLACES: 18,
});

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

    /**
     * Convert number or string to BigInt
     * @param {number | string} n
     * @param {number | string} decimals
     * @returns {bigint}
     */
    public static expandToDecimals(n: number | string, decimals: number | string): bigint {
        const amount = new BigNumber(n)
            .multipliedBy(new BigNumber(10).pow(decimals))
            .decimalPlaces(0);

        return BigInt(amount.toString());
    }
}
