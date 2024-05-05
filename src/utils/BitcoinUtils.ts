import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';

export class BitcoinUtils {
    public static formatUnits(value: BigNumberish, decimals: number = 8): string {
        const bn: BigNumber = new BigNumber(value.toString());

        return bn.dividedBy(new BigNumber(10).pow(decimals)).toString();
    }
}
