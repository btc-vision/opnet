import { NetEvent } from '@btc-vision/bsi-binary';
import { Buffer } from 'buffer';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IInteractionTransaction } from '../interfaces/transactions/ITransaction.js';
import { TransactionBase } from './Transaction.js';

export class InteractionTransaction
    extends TransactionBase<OPNetTransactionTypes.Interaction>
    implements IInteractionTransaction
{
    public readonly calldata: Buffer;
    public readonly senderPubKeyHash: Buffer;
    public readonly contractSecret: Buffer;
    public readonly interactionPubKey: Buffer;

    public readonly wasCompressed: boolean;
    public readonly events: NetEvent[];

    public readonly receipt?: Buffer;

    public readonly receiptProofs?: string[];

    constructor(transaction: IInteractionTransaction) {
        super(transaction);

        this.calldata = Buffer.from(transaction.calldata as string, 'base64');
        this.senderPubKeyHash = Buffer.from(transaction.senderPubKeyHash as string, 'base64');
        this.contractSecret = Buffer.from(transaction.contractSecret as string, 'base64');
        this.interactionPubKey = Buffer.from(transaction.interactionPubKey as string, 'base64');

        this.wasCompressed = transaction.wasCompressed;

        this.events = transaction.events;
        this.receipt = transaction.receipt
            ? Buffer.from(transaction.receipt as string, 'base64')
            : undefined;

        this.receiptProofs = transaction.receiptProofs;
    }
}
