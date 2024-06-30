import { IUnwrapTransaction, ParsedPartialWBTCUTXODocument, UsedUTXO } from '../interfaces/transactions/IUnwrapTransaction.js';
import { InteractionTransaction } from './InteractionTransaction.js';
export declare class UnwrapTransaction extends InteractionTransaction implements IUnwrapTransaction {
    readonly authorizedBy: string[];
    readonly usedUTXOs: UsedUTXO[];
    readonly consolidatedVault: ParsedPartialWBTCUTXODocument | undefined;
    readonly unwrapAmount: bigint;
    readonly requestedAmount: bigint;
    constructor(transaction: IUnwrapTransaction);
    private decodePartialWBTCUTXODocument;
}
