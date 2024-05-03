import { NetEvent } from '@btc-vision/bsi-binary';
import { BigNumberish } from 'ethers';
import { ITransactionInput, TransactionInput } from '../../transactions/TransactionInput.js';
import { ITransactionOutput, TransactionOutput } from '../../transactions/TransactionOutput.js';
import { OPNetTransactionTypes } from '../opnet/OPNetTransactionTypes.js';

export interface ITransactionBase<T extends OPNetTransactionTypes> {
    readonly id: string;
    readonly hash: string;

    readonly index: number; // Mark the order of the transaction in the block

    readonly burnedBitcoin: string | BigNumberish;
    readonly revert?: string | Buffer;

    readonly inputs: ITransactionInput[] | TransactionInput[];
    readonly outputs: ITransactionOutput[] | TransactionOutput[];

    readonly OPNetType: T;
}

export interface IGenericTransaction extends ITransactionBase<OPNetTransactionTypes.Generic> {}

export interface IDeploymentTransaction
    extends ITransactionBase<OPNetTransactionTypes.Deployment> {}

export interface IInteractionTransaction
    extends ITransactionBase<OPNetTransactionTypes.Interaction> {
    readonly calldata: string | Buffer;
    readonly senderPubKeyHash: string | Buffer;
    readonly contractSecret: string | Buffer;
    readonly interactionPubKey: string | Buffer;

    readonly wasCompressed: boolean;

    readonly events: NetEvent[];
    readonly receipt?: string | Buffer;
    readonly receiptProofs?: string[];
}

export type ITransaction = IDeploymentTransaction | IInteractionTransaction | IGenericTransaction;
