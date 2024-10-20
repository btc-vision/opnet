import { Address } from '@btc-vision/transaction';
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
    public readonly tweakedPublicKey: Address;

    public readonly bytecode: Buffer;
    public readonly wasCompressed: boolean;

    public readonly deployerPubKey: Buffer;
    public readonly deployerAddress: Address;

    public readonly contractSeed: Buffer;
    public readonly contractSaltHash: Buffer;

    public readonly from: Address;

    constructor(transaction: IDeploymentTransaction) {
        super(transaction);

        this.from = new Address(Buffer.from(transaction.from as string, 'base64'));

        this.contractAddress = transaction.contractAddress;
        this.tweakedPublicKey = new Address(
            Buffer.from(transaction.tweakedPublicKey as string, 'base64'),
        );

        this.bytecode = Buffer.from(transaction.bytecode as string, 'base64');
        this.wasCompressed = transaction.wasCompressed;

        this.deployerPubKey = Buffer.from(transaction.deployerPubKey as string, 'base64');
        this.deployerAddress = new Address(this.deployerPubKey);

        this.contractSeed = Buffer.from(transaction.contractSeed as string, 'base64');
        this.contractSaltHash = Buffer.from(transaction.contractSaltHash as string, 'base64');
    }
}
