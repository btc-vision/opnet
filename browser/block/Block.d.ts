import { BigNumberish } from 'ethers';
import { BlockHeaderChecksumProof, IBlock } from '../interfaces/blocks/IBlock.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { TransactionBase } from '../transactions/Transaction.js';
export declare class Block implements IBlock {
    readonly height: BigNumberish;
    readonly hash: string;
    readonly previousBlockHash: string;
    readonly previousBlockChecksum: string;
    readonly bits: string;
    readonly nonce: number;
    readonly version: number;
    readonly size: number;
    readonly txCount: number;
    readonly weight: number;
    readonly strippedSize: number;
    readonly time: number;
    readonly medianTime: number;
    readonly checksumRoot: string;
    readonly merkleRoot: string;
    readonly storageRoot: string;
    readonly receiptRoot: string;
    readonly checksumProofs: BlockHeaderChecksumProof;
    readonly transactions?: TransactionBase<OPNetTransactionTypes>[];
    constructor(block: IBlock);
    private getTransactions;
}
