import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IDeploymentTransaction } from '../interfaces/transactions/IDeploymentTransaction.js';
import { TransactionBase } from '../Transaction.js';

/**
 * @description This class is used to provide a deployment transaction.
 * @class DeploymentTransaction
 * @category Transactions<>
 */
export class DeploymentTransaction
    extends TransactionBase<OPNetTransactionTypes.Deployment>
    implements IDeploymentTransaction
{
    public readonly contractAddress: string;
    public readonly virtualAddress: string;

    public readonly p2trAddress: string;

    public readonly bytecode: Buffer;
    public readonly wasCompressed: boolean;

    public readonly deployerPubKey: Buffer;
    public readonly deployerAddress: string;

    public readonly contractSeed: Buffer;
    public readonly contractSaltHash: Buffer;

    public readonly from: string;

    constructor(transaction: IDeploymentTransaction) {
        super(transaction);

        this.from = transaction.from;

        this.contractAddress = transaction.contractAddress;
        this.virtualAddress = transaction.virtualAddress;
        this.p2trAddress = transaction.p2trAddress;

        this.bytecode = Buffer.from(transaction.bytecode as string, 'base64');
        this.wasCompressed = transaction.wasCompressed;

        this.deployerPubKey = Buffer.from(transaction.deployerPubKey as string, 'base64');
        this.deployerAddress = transaction.deployerAddress;

        this.contractSeed = Buffer.from(transaction.contractSeed as string, 'base64');
        this.contractSaltHash = Buffer.from(transaction.contractSaltHash as string, 'base64');
    }
}
