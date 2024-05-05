import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IGenericTransaction } from './interfaces/ITransaction.js';
import { TransactionBase } from './Transaction.js';

export class GenericTransaction
    extends TransactionBase<OPNetTransactionTypes.Generic>
    implements IGenericTransaction
{
    constructor(transaction: IGenericTransaction) {
        super(transaction);
    }
}
