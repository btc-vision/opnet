import { fromBase64, fromHex, Network } from '@btc-vision/bitcoin';
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

    public readonly bytecode?: Uint8Array;
    public readonly wasCompressed?: boolean;

    public readonly deployerPubKey?: Uint8Array;
    public readonly deployerHashedPublicKey?: Uint8Array;
    public readonly deployerAddress?: Address;

    public readonly contractSeed?: Uint8Array;
    public readonly contractSaltHash?: Uint8Array;

    public readonly from?: Address;

    constructor(transaction: IDeploymentTransaction, network: Network) {
        super(transaction, network);

        if (
            !transaction.deployerAddress &&
            (transaction.revert === null || transaction.revert === undefined)
        ) {
            throw new Error('Deployer address is missing');
        }

        try {
            this.from = new Address(
                fromBase64(transaction.from as string),
                fromBase64(transaction.fromLegacy as string),
            );

            this.contractAddress = transaction.contractAddress;
            this.contractPublicKey = new Address(
                fromBase64(transaction.contractPublicKey as string),
            );

            this.bytecode = fromBase64(transaction.bytecode as string);
            this.wasCompressed = transaction.wasCompressed;

            if (transaction.deployerPubKey) {
                this.deployerPubKey = fromBase64(transaction.deployerPubKey as string);
            }

            if (transaction.deployerAddress) {
                const deployerAddr = transaction.deployerAddress as string;
                this.deployerHashedPublicKey = fromHex(
                    deployerAddr.startsWith('0x') ? deployerAddr.slice(2) : deployerAddr,
                );
            }

            if (this.deployerHashedPublicKey && this.deployerPubKey) {
                this.deployerAddress = new Address(
                    this.deployerHashedPublicKey,
                    this.deployerPubKey,
                );
            }

            this.contractSeed = fromBase64(transaction.contractSeed as string);
            this.contractSaltHash = fromBase64(transaction.contractSaltHash as string);
        } catch {}
    }
}
