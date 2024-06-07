import { OPNetTransactionTypes } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from '../ITransaction.js';
export interface ICommonTransaction<T extends OPNetTransactionTypes> extends ITransactionBase<T> {
    readonly from: string;
    readonly contractAddress: string;
    readonly wasCompressed: boolean;
}
