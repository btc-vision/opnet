import { Buffer } from 'buffer';
import { InteractionType } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IInteractionTransaction } from '../interfaces/transactions/IInteractionTransaction.js';
import { TransactionBase } from '../Transaction.js';
export declare class InteractionTransaction extends TransactionBase<InteractionType> implements IInteractionTransaction {
    readonly calldata: Buffer;
    readonly senderPubKeyHash: Buffer;
    readonly contractSecret: Buffer;
    readonly interactionPubKey: Buffer;
    readonly wasCompressed: boolean;
    readonly from: string;
    readonly contractAddress: string;
    constructor(transaction: IInteractionTransaction);
}
