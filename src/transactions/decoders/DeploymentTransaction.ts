import { Network } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IDeploymentTransaction } from '../interfaces/transactions/IDeploymentTransaction.js';
import { TransactionBase } from '../Transaction.js';

/**
 * @desc This class is used to provide a deployment transaction. Properties could be null if reverted.
 * @class DeploymentTransaction
 * @category Transactions
 */
export class DeploymentTransaction
    extends TransactionBase<OPNetTransactionTypes.Deployment>
    implements IDeploymentTransaction
{
    public readonly contractAddress?: string;
    public readonly contractPublicKey?: Address;

    public readonly bytecode?: Buffer;
    public readonly wasCompressed?: boolean;

    public readonly deployerPubKey?: Buffer;
    public readonly deployerHashedPublicKey?: Buffer;
    public readonly deployerAddress?: Address;

    public readonly contractSeed?: Buffer;
    public readonly contractSaltHash?: Buffer;

    public readonly from?: Address;

    constructor(transaction: IDeploymentTransaction, network: Network) {
        super(transaction, network);

        if (!transaction.deployerAddress && !transaction.revert) {
            throw new Error('Deployer address is missing');
        }

        try {
            this.from = new Address(
                Buffer.from(transaction.from as string, 'base64'),
                Buffer.from(transaction.fromLegacy as string, 'base64'),
            );

            this.contractAddress = transaction.contractAddress;
            this.contractPublicKey = new Address(
                Buffer.from(transaction.contractPublicKey as string, 'base64'),
            );

            this.bytecode = Buffer.from(transaction.bytecode as string, 'base64');
            this.wasCompressed = transaction.wasCompressed;

            if (transaction.deployerPubKey) {
                this.deployerPubKey = Buffer.from(transaction.deployerPubKey as string, 'base64');
            }

            if (transaction.deployerAddress) {
                this.deployerHashedPublicKey = Buffer.from(
                    (transaction.deployerAddress as string).replace('0x', ''),
                    'hex',
                );
            }

            if (this.deployerHashedPublicKey && this.deployerPubKey) {
                this.deployerAddress = new Address(
                    this.deployerHashedPublicKey,
                    this.deployerPubKey,
                );
            }

            this.contractSeed = Buffer.from(transaction.contractSeed as string, 'base64');
            this.contractSaltHash = Buffer.from(transaction.contractSaltHash as string, 'base64');
        } catch {}
    }
}
