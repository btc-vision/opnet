import { Address } from '@btc-vision/transaction';
import { IRawContract } from './interfaces/IRawContract.js';

/**
 * @description This class is used to store contract data.
 * @class ContractData
 * @category Bitcoin
 */
export class ContractData implements Omit<IRawContract, 'contractPublicKey'> {
    public readonly contractAddress: string;
    public readonly contractPublicKey: Address;

    public readonly bytecode: Buffer;
    public readonly wasCompressed: boolean;

    public readonly deployedTransactionId: string;
    public readonly deployedTransactionHash: string;

    public readonly deployerPubKey: Buffer;
    public readonly deployerHashedPublicKey: Buffer;
    public readonly contractSeed: Buffer;

    public readonly contractSaltHash: Buffer;
    public readonly deployerAddress: Address;

    constructor(raw: IRawContract) {
        this.contractAddress = raw.contractAddress;
        this.contractPublicKey = Buffer.isBuffer(raw.contractPublicKey)
            ? new Address(raw.contractPublicKey)
            : new Address(Buffer.from(raw.contractPublicKey, 'base64'));

        this.bytecode = Buffer.isBuffer(raw.bytecode)
            ? raw.bytecode
            : Buffer.from(raw.bytecode, 'base64');

        this.wasCompressed = raw.wasCompressed;
        this.deployedTransactionId = raw.deployedTransactionId;
        this.deployedTransactionHash = raw.deployedTransactionHash;

        this.deployerPubKey = Buffer.isBuffer(raw.deployerPubKey)
            ? raw.deployerPubKey
            : Buffer.from(raw.deployerPubKey, 'base64');

        this.deployerHashedPublicKey = Buffer.isBuffer(raw.deployerAddress)
            ? raw.deployerAddress
            : Buffer.from((raw.deployerAddress as unknown as string).replace('0x', ''), 'base64');

        this.contractSeed = Buffer.isBuffer(raw.contractSeed)
            ? raw.contractSeed
            : Buffer.from(raw.contractSeed, 'base64');

        this.contractSaltHash = Buffer.isBuffer(raw.contractSaltHash)
            ? raw.contractSaltHash
            : Buffer.from(raw.contractSaltHash, 'base64');

        if (this.deployerHashedPublicKey && this.deployerPubKey) {
            this.deployerAddress = new Address(this.deployerHashedPublicKey, this.deployerPubKey);
        } else {
            throw new Error('Deployer address or public key is missing');
        }
    }
}
