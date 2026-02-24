import { fromHex } from '@btc-vision/bitcoin';

import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IMempoolDeploymentTransactionData } from '../../providers/interfaces/mempool/MempoolTransactionData.js';
import { MempoolOPNetTransactionData } from './MempoolOPNetTransactionData.js';

/**
 * Decoded mempool transaction data for deployment transactions.
 *
 * Adds the decoded `bytecode` field on top of the OPNet-specific fields.
 */
export class MempoolDeploymentTransactionData extends MempoolOPNetTransactionData<OPNetTransactionTypes.Deployment> {
    /** Decoded contract bytecode. */
    public readonly bytecode: Uint8Array;

    public constructor(data: IMempoolDeploymentTransactionData) {
        super(data);

        if (data.bytecode === undefined) {
            throw new Error('Bytecode is required for deployment transactions.');
        }

        const bytecodeHex = data.bytecode.startsWith('0x') ? data.bytecode.slice(2) : data.bytecode;

        this.bytecode = fromHex(bytecodeHex);
    }
}
