import { fromHex } from '@btc-vision/bitcoin';

import { OPNetTransactionTypes } from '../../interfaces/opnet/OPNetTransactionTypes.js';
import { IMempoolOPNetTransactionData } from '../../providers/interfaces/mempool/MempoolTransactionData.js';
import { MempoolTransactionData } from '../MempoolTransactionData.js';

/**
 * Decoded mempool transaction data for OPNet transactions.
 *
 * Decodes OPNet-specific fields (gas limit, priority fee, calldata, etc.)
 * from their hex wire-format representations.
 */
export class MempoolOPNetTransactionData<
    T extends OPNetTransactionTypes = OPNetTransactionTypes.Interaction,
> extends MempoolTransactionData<T> {
    /** Theoretical gas limit for OPNet execution. */
    public readonly theoreticalGasLimit: bigint;

    /** Priority fee attached to the transaction. */
    public readonly priorityFee: bigint;

    /** The sender address (p2tr format). */
    public readonly from: string;

    /** The target contract address (p2op format). */
    public readonly contractAddress: string;

    /** Decoded calldata. */
    public readonly calldata: Uint8Array;

    protected constructor(data: IMempoolOPNetTransactionData) {
        super(data);

        if (data.theoreticalGasLimit === undefined) {
            throw new Error('Missing theoreticalGasLimit field in OPNet transaction mempool data.');
        }

        if (data.calldata === undefined) {
            throw new Error('Missing calldata field in OPNet transaction mempool data.');
        }

        if (data.from === undefined) {
            throw new Error('Missing from field in OPNet transaction mempool data.');
        }

        if (data.contractAddress === undefined) {
            throw new Error('Missing contractAddress field in OPNet transaction mempool data.');
        }

        this.theoreticalGasLimit = BigInt(data.theoreticalGasLimit);
        this.priorityFee = BigInt(data.priorityFee || '0x00');
        this.from = data.from;
        this.contractAddress = data.contractAddress;

        const calldataHex = data.calldata.startsWith('0x') ? data.calldata.slice(2) : data.calldata;

        this.calldata = fromHex(calldataHex);
    }
}
