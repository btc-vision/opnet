/// <reference types="node" />
import { NetEvent } from '@btc-vision/bsi-binary';
import { Buffer } from 'buffer';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IInteractionTransaction } from '../interfaces/transactions/ITransaction.js';
import { TransactionBase } from './Transaction.js';
export declare class InteractionTransaction extends TransactionBase<OPNetTransactionTypes.Interaction> implements IInteractionTransaction {
    readonly calldata: Buffer;
    readonly senderPubKeyHash: Buffer;
    readonly contractSecret: Buffer;
    readonly interactionPubKey: Buffer;
    readonly wasCompressed: boolean;
    readonly events: NetEvent[];
    readonly receipt?: Buffer;
    readonly receiptProofs?: string[];
    constructor(transaction: IInteractionTransaction);
}
