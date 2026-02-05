import type { AbiType } from '@btc-vision/transaction';

/**
 * The Bitcoin ABI value.
 * @interface
 * @cathegory Abi
 */
export interface BitcoinAbiValue {
    /**
     * The name of the input.
     */
    name: string;

    /**
     * The type of the input.
     * Accepts ABIDataTypes enum values, tuple arrays, or struct objects.
     */
    type: AbiType;
}
