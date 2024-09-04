import { NetEvent } from '@btc-vision/bsi-binary';
export interface NetEventDocument {
    readonly contractAddress: string;
    readonly eventType: string;
    readonly eventDataSelector: string;
    readonly eventData: string;
}
export interface IRawContractEvents {
    [key: string]: NetEventDocument[];
}
export type RawContractEvents = IRawContractEvents | NetEventDocument[];
export interface ContractEvents {
    [key: string]: NetEvent[];
}
export interface ITransactionReceipt {
    readonly receipt?: string | Buffer;
    readonly receiptProofs?: string[];
    readonly events?: RawContractEvents | ContractEvents;
    readonly revert?: string | Buffer;
}
