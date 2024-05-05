import { ABIDataTypes } from '@btc-vision/bsi-binary';

export interface BitcoinAbiValue {
    /**
     * The name of the input.
     */
    name: string;

    /**
     * The type of the input.
     */
    type: ABIDataTypes;
}
