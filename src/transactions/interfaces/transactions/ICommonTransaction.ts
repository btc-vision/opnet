import { Address } from '@btc-vision/transaction';
import { OPNetTransactionTypes } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from '../ITransaction.js';

export interface ICommonTransaction<T extends OPNetTransactionTypes> extends ITransactionBase<T> {
    /**
     * @description This indicates who sent the transaction.
     */
    readonly from: Address | string;

    /**
     * @description This indicates which contract the transaction was sent to. (AKA to)
     */
    readonly contractAddress: string;

    /**
     * @description Was the binary data compressed?
     */
    readonly wasCompressed: boolean;
}
