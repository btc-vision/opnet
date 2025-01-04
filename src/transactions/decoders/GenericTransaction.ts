import { Network } from '@btc-vision/bitcoin';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IGenericTransaction } from '../interfaces/ITransaction.js';
import { TransactionBase } from '../Transaction.js';

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
    public constructor(transaction: IGenericTransaction, network: Network) {
        super(transaction, network);
    }
}
