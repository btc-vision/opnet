import { BigNumberish } from '../../common/CommonTypes.js';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransaction } from '../../transactions/interfaces/ITransaction.js';
import { TransactionBase } from '../../transactions/Transaction.js';
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
