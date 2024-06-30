import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { DeploymentTransaction } from './decoders/DeploymentTransaction.js';
import { GenericTransaction } from './decoders/GenericTransaction.js';
import { InteractionTransaction } from './decoders/InteractionTransaction.js';
import { UnwrapTransaction } from './decoders/UnwrapTransaction.js';
import { WrapTransaction } from './decoders/WrapTransaction.js';
import { IGenericTransaction, ITransaction } from './interfaces/ITransaction.js';
import { IDeploymentTransaction } from './interfaces/transactions/IDeploymentTransaction.js';
import { IInteractionTransaction } from './interfaces/transactions/IInteractionTransaction.js';
import { IUnwrapTransaction } from './interfaces/transactions/IUnwrapTransaction.js';
import { IWrapTransaction } from './interfaces/transactions/IWrapTransaction.js';
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
        const opnetType: OPNetTransactionTypes = transaction.OPNetType;

        switch (opnetType) {
            case OPNetTransactionTypes.Generic:
                return new GenericTransaction(transaction as IGenericTransaction);
            case OPNetTransactionTypes.Interaction:
                return new InteractionTransaction(transaction as IInteractionTransaction);
            case OPNetTransactionTypes.Deployment:
                return new DeploymentTransaction(transaction as IDeploymentTransaction);
            case OPNetTransactionTypes.WrapInteraction:
                return new WrapTransaction(transaction as IWrapTransaction);
            case OPNetTransactionTypes.UnwrapInteraction:
                return new UnwrapTransaction(transaction as IUnwrapTransaction);
            default:
                throw new Error('Unknown transaction type');
        }
    }
}
