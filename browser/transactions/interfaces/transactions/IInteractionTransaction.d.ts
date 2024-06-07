/// <reference types="node" />
import { InteractionType } from '../../../interfaces/opnet/OPNetTransactionTypes.js';
import { ContractEvents } from '../ITransactionReceipt.js';
import { ICommonTransaction } from './ICommonTransaction.js';
export interface IInteractionTransaction extends ICommonTransaction<InteractionType> {
    readonly calldata: string | Buffer;
    readonly senderPubKeyHash: string | Buffer;
    readonly contractSecret: string | Buffer;
    readonly interactionPubKey: string | Buffer;
    readonly from: string;
    readonly events: ContractEvents;
    readonly receipt?: string | Buffer;
    readonly receiptProofs?: string[];
}
