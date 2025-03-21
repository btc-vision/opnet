import { Address } from '@btc-vision/transaction';
import { IRawContract } from './interfaces/IRawContract.js';

/**
 * @description This class is used to store contract data.
 * @class ContractData
 * @category Bitcoin
 */
export class ContractData implements IRawContract {
    public readonly contractAddress: Address;
    public readonly virtualAddress: Address;
    public readonly p2trAddress: Address;

    public readonly bytecode: Buffer;
    public readonly wasCompressed: boolean;

    public readonly deployedTransactionId: string;
    public readonly deployedTransactionHash: string;

    public readonly deployerPubKey: Buffer;
    public readonly contractSeed: Buffer;

    public readonly contractSaltHash: Buffer;
    public readonly deployerAddress: Address;

    constructor(raw: IRawContract) {
        this.contractAddress = raw.contractAddress;
        this.virtualAddress = raw.virtualAddress;

        this.bytecode = Buffer.isBuffer(raw.bytecode)
            ? raw.bytecode
            : Buffer.from(raw.bytecode, 'base64');

        this.p2trAddress = raw.p2trAddress;

        this.wasCompressed = raw.wasCompressed;
        this.deployedTransactionId = raw.deployedTransactionId;
        this.deployedTransactionHash = raw.deployedTransactionHash;

        this.deployerPubKey = Buffer.isBuffer(raw.deployerPubKey)
            ? raw.deployerPubKey
            : Buffer.from(raw.deployerPubKey, 'base64');

        this.contractSeed = Buffer.isBuffer(raw.contractSeed)
            ? raw.contractSeed
            : Buffer.from(raw.contractSeed, 'base64');

        this.contractSaltHash = Buffer.isBuffer(raw.contractSaltHash)
            ? raw.contractSaltHash
            : Buffer.from(raw.contractSaltHash, 'base64');

        this.deployerAddress = raw.deployerAddress;
    }
}
