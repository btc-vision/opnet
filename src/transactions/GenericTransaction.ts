import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IGenericTransaction } from './interfaces/ITransaction.js';
import { TransactionBase } from './Transaction.js';

/**
 * @description This class is used to create a generic transaction.
 * @class GenericTransaction
 * @extends {TransactionBase<OPNetTransactionTypes.Generic>}
 * @implements {IGenericTransaction}
 * @category Transactions
 */
export class GenericTransaction
    extends TransactionBase<OPNetTransactionTypes.Generic>
    implements IGenericTransaction
{
    constructor(transaction: IGenericTransaction) {
        super(transaction);
    }
}
