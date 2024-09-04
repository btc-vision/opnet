import BigNumber from 'bignumber.js';
export class BitcoinUtils {
    static formatUnits(value, decimals = 8) {
        const bn = new BigNumber(value.toString());
        return bn.dividedBy(new BigNumber(10).pow(decimals)).toString();
    }
}
