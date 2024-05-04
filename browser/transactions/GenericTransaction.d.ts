import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IGenericTransaction } from '../interfaces/transactions/ITransaction.js';
import { TransactionBase } from './Transaction.js';
export declare class GenericTransaction extends TransactionBase<OPNetTransactionTypes.Generic> implements IGenericTransaction {
    constructor(transaction: IGenericTransaction);
}
