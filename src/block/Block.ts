import { Network } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';
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
export class Block implements Omit<IBlock, 'gasUsed' | 'ema' | 'baseGas' | 'deployments'> {
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

    private readonly _rawBlock: IBlock;
    private readonly _network: Network;

    constructor(block: IBlock, network: Network) {
        if (!block) throw new Error('Invalid block.');

        this._rawBlock = block;
        this._network = network;

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
    }

    private _transactions?: TransactionBase<OPNetTransactionTypes>[];

    public get transactions(): TransactionBase<OPNetTransactionTypes>[] {
        if (!this._transactions) {
            this._transactions = TransactionParser.parseTransactions(
                this._rawBlock.transactions as ITransaction[],
                this._network,
            );
        }
        return this._transactions;
    }

    private _deployments?: Address[];

    public get deployments(): Address[] {
        if (!this._deployments) {
            this._deployments = this._rawBlock.deployments
                ? this._rawBlock.deployments.map((address) => Address.fromString(address))
                : [];
        }
        return this._deployments;
    }

    // For cases where you need raw without parsing
    public get rawTransactions(): ITransaction[] {
        return this._rawBlock.transactions as ITransaction[];
    }
}
