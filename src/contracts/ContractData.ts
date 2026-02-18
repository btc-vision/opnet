import { fromBase64, fromHex } from '@btc-vision/bitcoin';
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

    public readonly bytecode: Uint8Array;
    public readonly wasCompressed: boolean;

    public readonly deployedTransactionId: string;
    public readonly deployedTransactionHash: string;

    public readonly deployerPubKey: Uint8Array;
    public readonly deployerHashedPublicKey: Uint8Array;
    public readonly contractSeed: Uint8Array;

    public readonly contractSaltHash: Uint8Array;
    public readonly deployerAddress: Address;

    constructor(raw: IRawContract) {
        this.contractAddress = raw.contractAddress;
        this.contractPublicKey =
            raw.contractPublicKey instanceof Uint8Array
                ? new Address(raw.contractPublicKey)
                : new Address(fromBase64(raw.contractPublicKey));

        this.bytecode =
            raw.bytecode instanceof Uint8Array ? raw.bytecode : fromBase64(raw.bytecode);

        this.wasCompressed = raw.wasCompressed;
        this.deployedTransactionId = raw.deployedTransactionId;
        this.deployedTransactionHash = raw.deployedTransactionHash;

        this.deployerPubKey =
            raw.deployerPubKey instanceof Uint8Array
                ? raw.deployerPubKey
                : fromBase64(raw.deployerPubKey);

        const deployerAddr = raw.deployerAddress as unknown as string;
        const cleanDeployerAddr = deployerAddr.startsWith('0x')
            ? deployerAddr.slice(2)
            : deployerAddr;

        this.deployerHashedPublicKey =
            raw.deployerAddress instanceof Address
                ? fromHex(cleanDeployerAddr)
                : fromBase64(cleanDeployerAddr);

        this.contractSeed =
            raw.contractSeed instanceof Uint8Array
                ? raw.contractSeed
                : fromBase64(raw.contractSeed);

        this.contractSaltHash =
            raw.contractSaltHash instanceof Uint8Array
                ? raw.contractSaltHash
                : fromBase64(raw.contractSaltHash);

        if (this.deployerHashedPublicKey && this.deployerPubKey) {
            this.deployerAddress = new Address(this.deployerHashedPublicKey, this.deployerPubKey);
        } else {
            throw new Error('Deployer address or public key is missing');
        }
    }
}
