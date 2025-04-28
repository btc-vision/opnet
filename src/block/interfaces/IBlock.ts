import { BigNumberish } from '../../common/CommonTypes.js';
import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { ITransaction } from '../../transactions/interfaces/ITransaction.js';
import { TransactionBase } from '../../transactions/Transaction.js';

export type BlockHeaderChecksumProof = Array<[number, string[]]>;

/**
 * @description This interface is used to define the common properties of a block.
 * @cathegory Raw
 */
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

    /** Allows us to verify that the block is correct and not regenerated. */
    checksumRoot: string;
    merkleRoot: string;
    storageRoot: string;
    receiptRoot: string;

    ema: string;
    baseGas: string;
    gasUsed: string;

    checksumProofs: BlockHeaderChecksumProof;
}

/**
 * @description This interface is used to define the properties of a block.
 * @cathegory Raw
 */
export interface IBlock extends IBlockCommon {
    transactions?: ITransaction[] | TransactionBase<OPNetTransactionTypes>[];
    deployments?: string[];
}
