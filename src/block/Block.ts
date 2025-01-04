import { Network } from '@btc-vision/bitcoin';
import { BigNumberish } from '../common/CommonTypes.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransaction } from '../transactions/interfaces/ITransaction.js';
import { TransactionBase } from '../transactions/Transaction.js';
import { TransactionParser } from '../transactions/TransactionParser.js';
import { BlockHeaderChecksumProof, IBlock } from './interfaces/IBlock.js';

/**
 * @description This class is used to represent a block.
 * @class Block
 * @category Block
 */
export class Block implements Omit<IBlock, 'gasUsed' | 'ema' | 'baseGas'> {
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

    public readonly ema: bigint;
    public readonly baseGas: bigint;
    public readonly gasUsed: bigint;

    public readonly checksumProofs: BlockHeaderChecksumProof;

    public readonly transactions: TransactionBase<OPNetTransactionTypes>[] = [];

    constructor(block: IBlock, network: Network) {
        this.height = BigInt(block.height.toString());

        this.hash = block.hash;
        this.previousBlockHash = block.previousBlockHash;
        this.previousBlockChecksum = block.previousBlockChecksum;

        this.bits = block.bits;
        this.nonce = block.nonce;
        this.version = block.version;
        this.size = block.size;
        this.txCount = block.txCount;

        this.ema = BigInt(block.ema);
        this.baseGas = BigInt(block.baseGas);
        this.gasUsed = BigInt(block.gasUsed);

        this.weight = block.weight;
        this.strippedSize = block.strippedSize;

        this.time = block.time;
        this.medianTime = block.medianTime;

        this.checksumRoot = block.checksumRoot;
        this.merkleRoot = block.merkleRoot;
        this.storageRoot = block.storageRoot;
        this.receiptRoot = block.receiptRoot;

        this.checksumProofs = block.checksumProofs;

        this.transactions = TransactionParser.parseTransactions(
            block.transactions as ITransaction[],
            network
        );
    }
}
