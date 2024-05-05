import { NetEvent } from '@btc-vision/bsi-binary';

export interface ITransactionReceipt {
    readonly receipt: string | null | Buffer;
    readonly receiptProofs: string[];
    readonly events: NetEvent[];

    readonly revert?: string | Buffer;
}
