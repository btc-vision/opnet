import { BigNumberish } from 'ethers';
import { BlockHeaderChecksumProof, IBlock } from '../interfaces/blocks/IBlock.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import {
    IDeploymentTransaction,
    IGenericTransaction,
    IInteractionTransaction,
    ITransaction,
} from '../interfaces/transactions/ITransaction.js';
import { DeploymentTransaction } from '../transactions/DeploymentTransaction.js';
import { GenericTransaction } from '../transactions/GenericTransaction.js';
import { InteractionTransaction } from '../transactions/InteractionTransaction.js';
import { TransactionBase } from '../transactions/Transaction.js';

export class Block implements IBlock {
    public readonly height: BigNumberish;

    public readonly hash: string;
    public readonly previousBlockHash: string;
    public readonly previousBlockChecksum: string;

    public readonly bits: string;
    public readonly nonce: number;
    public readonly version: number;
    public readonly size: number;
    public readonly txCount: number;

    public readonly weight: number;
    public readonly strippedSize: number;

    public readonly time: number;
    public readonly medianTime: number;

    public readonly checksumRoot: string;
    public readonly merkleRoot: string;
    public readonly storageRoot: string;
    public readonly receiptRoot: string;

    public readonly checksumProofs: BlockHeaderChecksumProof;

    public readonly transactions?: TransactionBase<OPNetTransactionTypes>[];

    constructor(block: IBlock) {
        this.height = BigInt(block.height.toString());

        this.hash = block.hash;
        this.previousBlockHash = block.previousBlockHash;
        this.previousBlockChecksum = block.previousBlockChecksum;

        this.bits = block.bits;
        this.nonce = block.nonce;
        this.version = block.version;
        this.size = block.size;
        this.txCount = block.txCount;

        this.weight = block.weight;
        this.strippedSize = block.strippedSize;

        this.time = block.time;
        this.medianTime = block.medianTime;

        this.checksumRoot = block.checksumRoot;
        this.merkleRoot = block.merkleRoot;
        this.storageRoot = block.storageRoot;
        this.receiptRoot = block.receiptRoot;

        this.checksumProofs = block.checksumProofs;

        this.transactions = this.getTransactions(block.transactions as ITransaction[]);
    }

    private getTransactions(
        transactions: ITransaction[],
    ): TransactionBase<OPNetTransactionTypes>[] {
        if (!transactions) {
            return [];
        }

        const transactionArray: TransactionBase<OPNetTransactionTypes>[] = [];
        for (let transaction of transactions) {
            switch (transaction.OPNetType) {
                case OPNetTransactionTypes.Generic:
                    transactionArray.push(
                        new GenericTransaction(transaction as IGenericTransaction),
                    );
                    break;
                case OPNetTransactionTypes.Interaction:
                    transactionArray.push(
                        new InteractionTransaction(transaction as IInteractionTransaction),
                    );
                    break;
                case OPNetTransactionTypes.Deployment:
                    transactionArray.push(
                        new DeploymentTransaction(transaction as IDeploymentTransaction),
                    );
                    break;
                default:
                    throw new Error('Unknown transaction type');
            }
        }

        return transactionArray;
    }
}
