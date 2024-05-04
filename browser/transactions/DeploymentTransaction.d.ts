import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IDeploymentTransaction } from '../interfaces/transactions/ITransaction.js';
import { TransactionBase } from './Transaction.js';
export declare class DeploymentTransaction extends TransactionBase<OPNetTransactionTypes.Deployment> implements IDeploymentTransaction {
    constructor(transaction: IDeploymentTransaction);
}
