import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IMempoolTransactionData } from '../../providers/interfaces/mempool/MempoolTransactionData.js';
import { MempoolTransactionData } from '../MempoolTransactionData.js';

/**
 * Decoded mempool transaction data for generic (non-OPNet) transactions.
 */
export class MempoolGenericTransactionData extends MempoolTransactionData<OPNetTransactionTypes.Generic> {
    public constructor(data: IMempoolTransactionData) {
        super(data);
    }
}
