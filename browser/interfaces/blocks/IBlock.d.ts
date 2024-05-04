import { BigNumberish } from 'ethers';
import { TransactionBase } from '../../transactions/Transaction.js';
import { OPNetTransactionTypes } from '../opnet/OPNetTransactionTypes.js';
import { ITransaction } from '../transactions/ITransaction.js';
export type BlockHeaderChecksumProof = Array<[number, string[]]>;
export interface IBlockCommon {
    height: string | BigNumberish;
    hash: string;
    previousBlockHash: string;
    previousBlockChecksum: string;
    bits: string;
    nonce: number;
    version: number;
    size: number;
    txCount: number;
    weight: number;
    strippedSize: number;
    time: number;
    medianTime: number;
    checksumRoot: string;
    merkleRoot: string;
    storageRoot: string;
    receiptRoot: string;
    checksumProofs: BlockHeaderChecksumProof;
}
export interface IBlock extends IBlockCommon {
    transactions?: ITransaction[] | TransactionBase<OPNetTransactionTypes>[];
}
