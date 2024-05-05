import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransaction } from './interfaces/ITransaction.js';
import { TransactionBase } from './Transaction.js';
export declare class TransactionParser {
    static parseTransactions(transactions: ITransaction[]): TransactionBase<OPNetTransactionTypes>[];
    static parseTransaction(transaction: ITransaction): TransactionBase<OPNetTransactionTypes>;
}
