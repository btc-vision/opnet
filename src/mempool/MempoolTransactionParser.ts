import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import {
    IMempoolDeploymentTransactionData,
    IMempoolInteractionTransactionData,
    IMempoolTransactionData,
} from '../providers/interfaces/mempool/MempoolTransactionData.js';
import { MempoolDeploymentTransactionData } from './decoders/MempoolDeploymentTransactionData.js';
import { MempoolGenericTransactionData } from './decoders/MempoolGenericTransactionData.js';
import { MempoolInteractionTransactionData } from './decoders/MempoolInteractionTransactionData.js';
import { MempoolTransactionData } from './MempoolTransactionData.js';

export class MempoolTransactionParser {
    public static parseTransactions(
        transactions: IMempoolTransactionData[],
    ): MempoolTransactionData<OPNetTransactionTypes>[] {
        if (!transactions) {
            return [];
        }

        const result: MempoolTransactionData<OPNetTransactionTypes>[] = [];
        for (const tx of transactions) {
            if (!tx) throw new Error('Something went wrong while parsing mempool transactions');
            result.push(this.parseTransaction(tx));
        }

        return result;
    }

    public static parseTransaction(
        data: IMempoolTransactionData,
    ): MempoolTransactionData<OPNetTransactionTypes> {
        if (!data) throw new Error('Mempool transaction data is required');

        switch (data.transactionType as OPNetTransactionTypes) {
            case OPNetTransactionTypes.Generic:
                return new MempoolGenericTransactionData(data);
            case OPNetTransactionTypes.Interaction:
                return new MempoolInteractionTransactionData(
                    data as IMempoolInteractionTransactionData,
                );
            case OPNetTransactionTypes.Deployment:
                return new MempoolDeploymentTransactionData(
                    data as IMempoolDeploymentTransactionData,
                );
            default:
                throw new Error(`Unknown mempool transaction type: ${data.transactionType}`);
        }
    }
}
