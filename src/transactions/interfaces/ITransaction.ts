import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransactionBase } from './ITransactionBase.js';
import { IDeploymentTransaction } from './transactions/IDeploymentTransaction.js';
import { IInteractionTransaction } from './transactions/IInteractionTransaction.js';

/**
 * @description This interface represents a generic transaction.
 * @interface IGenericTransaction
 * @category ITransactions
 */
export interface IGenericTransaction extends ITransactionBase<OPNetTransactionTypes.Generic> {}

/**
 * @description This type represents a transaction.
 * @type ITransaction
 * @category ITransactions
 */
export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction;
