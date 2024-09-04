import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { DeploymentTransaction } from './decoders/DeploymentTransaction.js';
import { GenericTransaction } from './decoders/GenericTransaction.js';
import { InteractionTransaction } from './decoders/InteractionTransaction.js';
import { UnwrapTransaction } from './decoders/UnwrapTransaction.js';
import { WrapTransaction } from './decoders/WrapTransaction.js';
export class TransactionParser {
    static parseTransactions(transactions) {
        if (!transactions) {
            return [];
        }
        const transactionArray = [];
        for (let transaction of transactions) {
            if (!transaction)
                throw new Error(`Something went wrong while parsing transactions`);
            transactionArray.push(this.parseTransaction(transaction));
        }
        return transactionArray;
    }
    static parseTransaction(transaction) {
        if (!transaction)
            throw new Error('Transaction is required');
        const opnetType = transaction.OPNetType;
        switch (opnetType) {
            case OPNetTransactionTypes.Generic:
                return new GenericTransaction(transaction);
            case OPNetTransactionTypes.Interaction:
                return new InteractionTransaction(transaction);
            case OPNetTransactionTypes.Deployment:
                return new DeploymentTransaction(transaction);
            case OPNetTransactionTypes.WrapInteraction:
                return new WrapTransaction(transaction);
            case OPNetTransactionTypes.UnwrapInteraction:
                return new UnwrapTransaction(transaction);
            default:
                throw new Error('Unknown transaction type');
        }
    }
}
