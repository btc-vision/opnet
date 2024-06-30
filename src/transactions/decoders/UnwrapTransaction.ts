import {
    IUnwrapTransaction,
    ParsedPartialWBTCUTXODocument,
    PartialWBTCUTXODocument,
    UsedUTXO,
} from '../interfaces/transactions/IUnwrapTransaction.js';
import { InteractionTransaction } from './InteractionTransaction.js';

/**
 * Defines a wrap transaction.
 * @category Transactions
 */
export class UnwrapTransaction extends InteractionTransaction implements IUnwrapTransaction {
    /**
     * @description The trusted indexers that authorized this transaction.
     */
    public readonly authorizedBy: string[];

    /**
     * @description The UTXOs used in this transaction.
     */
    public readonly usedUTXOs: UsedUTXO[];

    /**
     * @description The consolidated vault. If any.
     */
    public readonly consolidatedVault: ParsedPartialWBTCUTXODocument | undefined;

    /**
     * @description The amount to unwrap.
     */
    public readonly unwrapAmount: bigint;

    /**
     * @description The requested amount.
     */
    public readonly requestedAmount: bigint;

    constructor(transaction: IUnwrapTransaction) {
        super(transaction);

        this.authorizedBy = transaction.authorizedBy;
        this.usedUTXOs = transaction.usedUTXOs;
        this.consolidatedVault = this.decodePartialWBTCUTXODocument(
            transaction.consolidatedVault as PartialWBTCUTXODocument,
        );

        this.unwrapAmount = BigInt(transaction.unwrapAmount);
        this.requestedAmount = BigInt(transaction.requestedAmount);
    }

    private decodePartialWBTCUTXODocument(
        document: PartialWBTCUTXODocument | undefined,
    ): ParsedPartialWBTCUTXODocument | undefined {
        if (!document) {
            return undefined;
        }

        return {
            vault: document.vault,
            hash: document.hash,
            value: BigInt(document.value),
            outputIndex: document.outputIndex,
            output: Buffer.from(document.output, 'base64'),
        };
    }
}
