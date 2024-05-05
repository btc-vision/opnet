/// <reference types="node" />
import { IRawContract } from './interfaces/IRawContract.js';
export declare class ContractData implements IRawContract {
    readonly contractAddress: string;
    readonly virtualAddress: string;
    readonly bytecode: Buffer;
    readonly wasCompressed: boolean;
    readonly deployedTransactionId: string;
    readonly deployedTransactionHash: string;
    readonly deployerPubKey: Buffer;
    readonly contractSeed: Buffer;
    readonly contractSaltHash: Buffer;
    readonly deployerAddress: string;
    constructor(raw: IRawContract);
}
