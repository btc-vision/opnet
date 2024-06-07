/// <reference types="node" />
import { Address } from '@btc-vision/bsi-binary';
import { IRawContract } from './interfaces/IRawContract.js';
export declare class ContractData implements IRawContract {
    readonly contractAddress: Address;
    readonly virtualAddress: Address;
    readonly p2trAddress: Address;
    readonly bytecode: Buffer;
    readonly wasCompressed: boolean;
    readonly deployedTransactionId: string;
    readonly deployedTransactionHash: string;
    readonly deployerPubKey: Buffer;
    readonly contractSeed: Buffer;
    readonly contractSaltHash: Buffer;
    readonly deployerAddress: Address;
    constructor(raw: IRawContract);
}
