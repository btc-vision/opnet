import { fromHex } from '@btc-vision/bitcoin';
import { BinaryReader, BinaryWriter, IP2WSHAddress, RawChallenge } from '@btc-vision/transaction';
import { UTXO } from '../bitcoin/UTXOs.js';
import { BitcoinFees } from '../block/BlockGasParameters.js';
import { IAccessList } from './interfaces/IAccessList.js';

/**
 * Network name enum for serialization.
 * @category Contracts
 */
export enum NetworkName {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    OpnetTestnet = 'opnetTestnet',
    Regtest = 'regtest',
}

/**
 * Version of the serialization format.
 * Increment when making breaking changes.
 */
const SERIALIZATION_VERSION = 1;

/**
 * Serializable offline data structure.
 * @category Contracts
 */
export interface OfflineCallResultData {
    readonly calldata: Uint8Array;
    readonly to: string;
    readonly contractAddress: string;
    readonly estimatedSatGas: bigint;
    readonly estimatedRefundedGasInSat: bigint;
    readonly revert?: string;
    readonly result: Uint8Array;
    readonly accessList: IAccessList;
    readonly bitcoinFees?: BitcoinFees;
    readonly network: NetworkName;
    readonly estimatedGas?: bigint;
    readonly refundedGas?: bigint;
    readonly challenge: RawChallenge;
    readonly challengeOriginalPublicKey: Uint8Array;
    readonly utxos: UTXO[];
    readonly csvAddress?: IP2WSHAddress;
}

/**
 * Serializer/Deserializer for CallResult offline signing data.
 * Uses binary format for efficient transfer (QR codes, files, etc.)
 * @category Contracts
 */
export class CallResultSerializer {
    private static readonly FEE_PRECISION = 1000000;

    /**
     * Serializes offline data to a Uint8Array.
     * @param {OfflineCallResultData} data - The data to serialize.
     * @returns {Uint8Array} The serialized binary data.
     */
    public static serialize(data: OfflineCallResultData): Uint8Array {
        const writer = new BinaryWriter();

        // Version header
        writer.writeU8(SERIALIZATION_VERSION);

        // Network (1 byte)
        writer.writeU8(this.networkNameToU8(data.network));

        // Calldata
        writer.writeBytesWithLength(data.calldata);

        // Contract addresses
        writer.writeStringWithLength(data.to);
        writer.writeStringWithLength(data.contractAddress);

        // Gas estimates
        writer.writeU256(data.estimatedSatGas);
        writer.writeU256(data.estimatedRefundedGasInSat);
        writer.writeU256(data.estimatedGas ?? 0n);
        writer.writeU256(data.refundedGas ?? 0n);

        // Revert (optional)
        if (data.revert !== undefined) {
            writer.writeBoolean(true);
            writer.writeStringWithLength(data.revert);
        } else {
            writer.writeBoolean(false);
        }

        // Result
        writer.writeBytesWithLength(data.result);

        // Access list
        this.writeAccessList(writer, data.accessList);

        // Bitcoin fees (optional)
        if (data.bitcoinFees) {
            writer.writeBoolean(true);
            this.writeBitcoinFees(writer, data.bitcoinFees);
        } else {
            writer.writeBoolean(false);
        }

        // Challenge
        this.writeChallenge(writer, data.challenge);

        // Challenge original public key (33 bytes compressed)
        writer.writeBytesWithLength(data.challengeOriginalPublicKey);

        // UTXOs
        this.writeUTXOs(writer, data.utxos);

        // CSV Address (optional)
        if (data.csvAddress) {
            writer.writeBoolean(true);
            writer.writeStringWithLength(data.csvAddress.address);
            writer.writeBytesWithLength(data.csvAddress.witnessScript);
        } else {
            writer.writeBoolean(false);
        }

        return writer.getBuffer();
    }

    /**
     * Deserializes a Uint8Array to offline data.
     * @param {Uint8Array} buffer - The serialized data.
     * @returns {OfflineCallResultData} The deserialized data.
     */
    public static deserialize(buffer: Uint8Array): OfflineCallResultData {
        const reader = new BinaryReader(buffer);

        // Version check
        const version = reader.readU8();
        if (version !== SERIALIZATION_VERSION) {
            throw new Error(
                `Unsupported serialization version: ${version}. Expected: ${SERIALIZATION_VERSION}`,
            );
        }

        // Network
        const network = this.u8ToNetworkName(reader.readU8());

        // Calldata
        const calldata = reader.readBytesWithLength();

        // Contract addresses
        const to = reader.readStringWithLength();
        const contractAddress = reader.readStringWithLength();

        // Gas estimates
        const estimatedSatGas = reader.readU256();
        const estimatedRefundedGasInSat = reader.readU256();
        const estimatedGasRaw = reader.readU256();
        const refundedGasRaw = reader.readU256();
        const estimatedGas = estimatedGasRaw > 0n ? estimatedGasRaw : undefined;
        const refundedGas = refundedGasRaw > 0n ? refundedGasRaw : undefined;

        // Revert
        const hasRevert = reader.readBoolean();
        const revert = hasRevert ? reader.readStringWithLength() : undefined;

        // Result
        const result = reader.readBytesWithLength();

        // Access list
        const accessList = this.readAccessList(reader);

        // Bitcoin fees
        const hasBitcoinFees = reader.readBoolean();
        const bitcoinFees = hasBitcoinFees ? this.readBitcoinFees(reader) : undefined;

        // Challenge
        const challenge = this.readChallenge(reader);

        // Challenge original public key (33 bytes compressed)
        const challengeOriginalPublicKey = reader.readBytesWithLength();

        // UTXOs
        const utxos = this.readUTXOs(reader);

        // CSV Address
        const hasCsvAddress = reader.readBoolean();
        const csvAddress = hasCsvAddress
            ? {
                  address: reader.readStringWithLength(),
                  witnessScript: reader.readBytesWithLength(),
              }
            : undefined;

        return {
            calldata,
            to,
            contractAddress,
            estimatedSatGas,
            estimatedRefundedGasInSat,
            estimatedGas,
            refundedGas,
            revert,
            result,
            accessList,
            bitcoinFees,
            network,
            challenge,
            challengeOriginalPublicKey,
            utxos,
            csvAddress,
        };
    }

    private static networkNameToU8(network: NetworkName): number {
        switch (network) {
            case NetworkName.Mainnet:
                return 0;
            case NetworkName.Testnet:
                return 1;
            case NetworkName.Regtest:
                return 2;
            case NetworkName.OpnetTestnet:
                return 3;
            default:
                return 2;
        }
    }

    private static u8ToNetworkName(value: number): NetworkName {
        switch (value) {
            case 0:
                return NetworkName.Mainnet;
            case 1:
                return NetworkName.Testnet;
            case 2:
                return NetworkName.Regtest;
            case 3:
                return NetworkName.OpnetTestnet;
            default:
                return NetworkName.Regtest;
        }
    }

    private static writeAccessList(writer: BinaryWriter, accessList: IAccessList): void {
        const contracts = Object.keys(accessList);
        writer.writeU16(contracts.length);

        for (const contract of contracts) {
            writer.writeStringWithLength(contract);
            const slots = accessList[contract];
            const slotKeys = Object.keys(slots);
            writer.writeU16(slotKeys.length);

            for (const key of slotKeys) {
                writer.writeStringWithLength(key);
                writer.writeStringWithLength(slots[key]);
            }
        }
    }

    private static readAccessList(reader: BinaryReader): IAccessList {
        const accessList: IAccessList = {};
        const contractCount = reader.readU16();

        for (let i = 0; i < contractCount; i++) {
            const contract = reader.readStringWithLength();
            const slotCount = reader.readU16();
            accessList[contract] = {};

            for (let j = 0; j < slotCount; j++) {
                const key = reader.readStringWithLength();
                const value = reader.readStringWithLength();
                accessList[contract][key] = value;
            }
        }

        return accessList;
    }

    private static writeBitcoinFees(writer: BinaryWriter, fees: BitcoinFees): void {
        // Multiply by 1000000 to preserve 6 decimal places of precision
        writer.writeU64(BigInt(Math.round(fees.conservative * this.FEE_PRECISION)));
        writer.writeU64(BigInt(Math.round(fees.recommended.low * this.FEE_PRECISION)));
        writer.writeU64(BigInt(Math.round(fees.recommended.medium * this.FEE_PRECISION)));
        writer.writeU64(BigInt(Math.round(fees.recommended.high * this.FEE_PRECISION)));
    }

    private static readBitcoinFees(reader: BinaryReader): BitcoinFees {
        return {
            conservative: Number(reader.readU64()) / this.FEE_PRECISION,
            recommended: {
                low: Number(reader.readU64()) / this.FEE_PRECISION,
                medium: Number(reader.readU64()) / this.FEE_PRECISION,
                high: Number(reader.readU64()) / this.FEE_PRECISION,
            },
        };
    }

    private static writeChallenge(writer: BinaryWriter, challenge: RawChallenge): void {
        writer.writeStringWithLength(challenge.epochNumber);
        writer.writeStringWithLength(challenge.mldsaPublicKey);
        writer.writeStringWithLength(challenge.legacyPublicKey);
        writer.writeStringWithLength(challenge.solution);
        writer.writeStringWithLength(challenge.salt);
        writer.writeStringWithLength(challenge.graffiti);
        writer.writeU256(BigInt(challenge.difficulty));

        // Verification
        writer.writeStringWithLength(challenge.verification.epochHash);
        writer.writeStringWithLength(challenge.verification.epochRoot);
        writer.writeStringWithLength(challenge.verification.targetHash);
        writer.writeStringWithLength(challenge.verification.targetChecksum);
        writer.writeStringWithLength(challenge.verification.startBlock);
        writer.writeStringWithLength(challenge.verification.endBlock);
        writer.writeU16(challenge.verification.proofs.length);
        for (const proof of challenge.verification.proofs) {
            writer.writeStringWithLength(proof);
        }

        // Submission (optional)
        if (challenge.submission) {
            writer.writeBoolean(true);
            writer.writeStringWithLength(challenge.submission.mldsaPublicKey);
            writer.writeStringWithLength(challenge.submission.legacyPublicKey);
            writer.writeStringWithLength(challenge.submission.solution);
            writer.writeStringWithLength(challenge.submission.graffiti || '');
            writer.writeStringWithLength(challenge.submission.signature);
        } else {
            writer.writeBoolean(false);
        }
    }

    private static readChallenge(reader: BinaryReader): RawChallenge {
        const epochNumber = reader.readStringWithLength();
        const mldsaPublicKey = reader.readStringWithLength();
        const legacyPublicKey = reader.readStringWithLength();
        const solution = reader.readStringWithLength();
        const salt = reader.readStringWithLength();
        const graffiti = reader.readStringWithLength();
        const difficulty = Number(reader.readU256());

        // Verification
        const epochHash = reader.readStringWithLength();
        const epochRoot = reader.readStringWithLength();
        const targetHash = reader.readStringWithLength();
        const targetChecksum = reader.readStringWithLength();
        const startBlock = reader.readStringWithLength();
        const endBlock = reader.readStringWithLength();
        const proofCount = reader.readU16();
        const proofs: string[] = [];
        for (let i = 0; i < proofCount; i++) {
            proofs.push(reader.readStringWithLength());
        }

        // Submission
        const hasSubmission = reader.readBoolean();
        const submission = hasSubmission
            ? {
                  mldsaPublicKey: reader.readStringWithLength(),
                  legacyPublicKey: reader.readStringWithLength(),
                  solution: reader.readStringWithLength(),
                  graffiti: reader.readStringWithLength() || undefined,
                  signature: reader.readStringWithLength(),
              }
            : undefined;

        return {
            epochNumber,
            mldsaPublicKey,
            legacyPublicKey,
            solution,
            salt,
            graffiti,
            difficulty,
            verification: {
                epochHash,
                epochRoot,
                targetHash: targetHash,
                targetChecksum,
                startBlock,
                endBlock,
                proofs,
            },
            submission,
        };
    }

    private static writeUTXOs(writer: BinaryWriter, utxos: UTXO[]): void {
        writer.writeU16(utxos.length);

        for (const utxo of utxos) {
            writer.writeStringWithLength(utxo.transactionId);
            writer.writeU32(utxo.outputIndex);
            writer.writeU64(utxo.value);

            // ScriptPubKey
            writer.writeStringWithLength(utxo.scriptPubKey.hex);
            writer.writeStringWithLength(utxo.scriptPubKey.address || '');

            // Optional fields
            writer.writeBoolean(!!utxo.isCSV);

            if (utxo.witnessScript) {
                writer.writeBoolean(true);
                const witnessScriptBytes =
                    typeof utxo.witnessScript === 'string'
                        ? fromHex(utxo.witnessScript)
                        : utxo.witnessScript;
                writer.writeBytesWithLength(witnessScriptBytes);
            } else {
                writer.writeBoolean(false);
            }

            if (utxo.redeemScript) {
                writer.writeBoolean(true);
                const redeemScriptBytes =
                    typeof utxo.redeemScript === 'string'
                        ? fromHex(utxo.redeemScript)
                        : utxo.redeemScript;
                writer.writeBytesWithLength(redeemScriptBytes);
            } else {
                writer.writeBoolean(false);
            }
        }
    }

    private static readUTXOs(reader: BinaryReader): UTXO[] {
        const count = reader.readU16();
        const utxos: UTXO[] = [];

        for (let i = 0; i < count; i++) {
            const transactionId = reader.readStringWithLength();
            const outputIndex = reader.readU32();
            const value = reader.readU64();

            const hex = reader.readStringWithLength();
            const addressStr = reader.readStringWithLength();

            const isCSV = reader.readBoolean();

            const hasWitnessScript = reader.readBoolean();
            const witnessScript = hasWitnessScript ? reader.readBytesWithLength() : undefined;

            const hasRedeemScript = reader.readBoolean();
            const redeemScript = hasRedeemScript ? reader.readBytesWithLength() : undefined;

            utxos.push({
                transactionId,
                outputIndex,
                value,
                scriptPubKey: {
                    hex,
                    address: addressStr || undefined,
                },
                isCSV,
                witnessScript,
                redeemScript,
            });
        }

        return utxos;
    }
}
