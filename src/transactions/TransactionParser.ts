import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { DeploymentTransaction } from './DeploymentTransaction.js';
import { GenericTransaction } from './GenericTransaction.js';
import { InteractionTransaction } from './InteractionTransaction.js';
import {
    IDeploymentTransaction,
    IGenericTransaction,
    IInteractionTransaction,
    ITransaction,
} from './interfaces/ITransaction.js';
import { TransactionBase } from './Transaction.js';

/**
 * Transaction parser
 * @category Transactions
 */
export class TransactionParser {
    public static parseTransactions(
        transactions: ITransaction[],
    ): TransactionBase<OPNetTransactionTypes>[] {
        if (!transactions) {
            return [];
        }

        const transactionArray: TransactionBase<OPNetTransactionTypes>[] = [];
        for (let transaction of transactions) {
            transactionArray.push(this.parseTransaction(transaction));
        }

        return transactionArray;
    }

    public static parseTransaction(
        transaction: ITransaction,
    ): TransactionBase<OPNetTransactionTypes> {
        switch (transaction.OPNetType) {
            case OPNetTransactionTypes.Generic:
                return new GenericTransaction(transaction as IGenericTransaction);
            case OPNetTransactionTypes.Interaction:
                return new InteractionTransaction(transaction as IInteractionTransaction);
            case OPNetTransactionTypes.Deployment:
                return new DeploymentTransaction(transaction as IDeploymentTransaction);
            default:
                throw new Error('Unknown transaction type');
        }
    }
}
