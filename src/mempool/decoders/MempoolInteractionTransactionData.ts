import { InteractionType } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IMempoolInteractionTransactionData } from '../../providers/interfaces/mempool/MempoolTransactionData.js';
import { MempoolOPNetTransactionData } from './MempoolOPNetTransactionData.js';

/**
 * Decoded mempool transaction data for interaction transactions.
 */
export class MempoolInteractionTransactionData extends MempoolOPNetTransactionData<InteractionType> {
    public constructor(data: IMempoolInteractionTransactionData) {
        super(data);
    }
}
