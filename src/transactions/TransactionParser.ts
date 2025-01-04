import { Network } from '@btc-vision/bitcoin';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { DeploymentTransaction } from './decoders/DeploymentTransaction.js';
import { GenericTransaction } from './decoders/GenericTransaction.js';
import { InteractionTransaction } from './decoders/InteractionTransaction.js';
import { IGenericTransaction, ITransaction } from './interfaces/ITransaction.js';
import { IDeploymentTransaction } from './interfaces/transactions/IDeploymentTransaction.js';
import { IInteractionTransaction } from './interfaces/transactions/IInteractionTransaction.js';
import { TransactionBase } from './Transaction.js';

/**
 * Transaction parser
 * @category Transactions
 */
export class TransactionParser {
    public static parseTransactions(
        transactions: ITransaction[],
        network: Network,
    ): TransactionBase<OPNetTransactionTypes>[] {
        if (!transactions) {
            return [];
        }

        const transactionArray: TransactionBase<OPNetTransactionTypes>[] = [];
        for (const transaction of transactions) {
            if (!transaction) throw new Error(`Something went wrong while parsing transactions`);

            transactionArray.push(this.parseTransaction(transaction, network));
        }

        return transactionArray;
    }

    public static parseTransaction(
        transaction: ITransaction,
        network: Network,
    ): TransactionBase<OPNetTransactionTypes> {
        if (!transaction) throw new Error('Transaction is required');

        const opnetType: OPNetTransactionTypes = transaction.OPNetType;

        switch (opnetType) {
            case OPNetTransactionTypes.Generic:
                return new GenericTransaction(transaction as IGenericTransaction, network);
            case OPNetTransactionTypes.Interaction:
                return new InteractionTransaction(transaction as IInteractionTransaction, network);
            case OPNetTransactionTypes.Deployment:
                return new DeploymentTransaction(transaction as IDeploymentTransaction, network);
            default:
                throw new Error('Unknown transaction type');
        }
    }
}
