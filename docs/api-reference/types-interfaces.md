# Types & Interfaces Reference

Complete reference for TypeScript types and interfaces.

## Table of Contents

- [Common Types](#common-types)
- [Network](#network)
- [Address](#address)
- [Transaction Types](#transaction-types)
- [Block Types](#block-types)
- [Contract Types](#contract-types)
- [Storage Types](#storage-types)
- [Public Key Types](#public-key-types)
- [UTXO Types](#utxo-types)
- [Epoch Types](#epoch-types)
- [Challenge Types](#challenge-types)
- [ABI Types](#abi-types)
- [ML-DSA Types](#ml-dsa-types)

---

## Common Types

### BigNumberish

Accepts various numeric formats.

```typescript
type BigNumberish = bigint | number | string;
```

### BlockTag

Block identifier options.

```typescript
type BlockTag = BigNumberish | string;
```

### PointerLike

Storage pointer formats.

```typescript
type PointerLike = bigint | string;
```

---

## Network

Bitcoin network configuration from `@btc-vision/bitcoin`.

```typescript
import { networks } from '@btc-vision/bitcoin';

// Available networks
networks.bitcoin    // Mainnet
networks.testnet    // Testnet
networks.regtest    // Regtest
```

---

## Address

OPNet address class from `@btc-vision/transaction`.

```typescript
import { Address } from '@btc-vision/transaction';

// Create from string
const addr = Address.fromString('bc1p...');

// Create from buffer
const addr = new Address(publicKeyBuffer);

// Methods
addr.toHex();           // Hex string
addr.p2tr(network);     // P2TR address
addr.p2op(network);     // P2OP address
addr.toString();        // String representation
```

---

## Transaction Types

### OPNetTransactionTypes

Transaction type identifiers (string values, not numbers).

```typescript
enum OPNetTransactionTypes {
    Generic = 'Generic',         // Basic Bitcoin transaction
    Deployment = 'Deployment',   // Contract deployment
    Interaction = 'Interaction', // Contract interaction
}
```

### TransactionInputFlags

Flags for transaction inputs (bitmask values).

```typescript
enum TransactionInputFlags {
    hasCoinbase = 0b00000001,  // Input is from coinbase transaction
    hasWitness = 0b00000010,   // Input has witness data (P2WPKH/P2WSH)
}
```

### TransactionOutputFlags

Flags for transaction outputs (bitmask values).

```typescript
enum TransactionOutputFlags {
    hasTo = 0b00000001,         // Output has recipient address
    hasScriptPubKey = 0b00000010, // Output has scriptPubKey
    OP_RETURN = 0b00000100,     // Output is OP_RETURN type
}
```

---

## Block Types

### Block

```typescript
interface Block {
    height: bigint;
    hash: string;
    previousBlockHash: string;
    previousBlockChecksum: string;
    bits: string;
    nonce: number;
    version: number;
    size: number;
    weight: number;
    strippedSize: number;
    txCount: number;
    time: number;
    medianTime: number;
    checksumRoot: string;
    merkleRoot: string;
    storageRoot: string;
    receiptRoot: string;
    ema: bigint;
    baseGas: bigint;
    gasUsed: bigint;
    checksumProofs: BlockHeaderChecksumProof;
    transactions: TransactionBase[];
    deployments: Address[];
    rawTransactions: ITransaction[];
}
```

### BlockGasParameters

```typescript
interface BlockGasParameters {
    blockNumber: bigint;
    gasUsed: bigint;
    targetGasLimit: bigint;
    ema: bigint;
    baseGas: bigint;
    gasPerSat: bigint;
    bitcoin: BitcoinFees;
}
```

### BitcoinFees

```typescript
interface BitcoinFees {
    conservative: number;
    recommended: {
        low: number;
        medium: number;
        high: number;
    };
}
```

### BlockWitnesses

Type alias for an array of block witnesses.

```typescript
type BlockWitnesses = readonly IBlockWitness[];
```

### IBlockWitness

```typescript
interface IBlockWitness {
    trusted: boolean;
    signature: Buffer;
    timestamp: number;
    proofs: readonly Buffer[];
    identity?: Buffer;
    publicKey?: Address;
}
```

### ReorgInformation

```typescript
interface ReorgInformation {
    fromBlock: bigint;
    toBlock: bigint;
    timestamp: number;
}
```

---

## Transaction Types

### ITransactionInput

Interface for transaction inputs.

```typescript
interface ITransactionInput {
    readonly originalTransactionId: string | undefined;
    readonly outputTransactionIndex: number | undefined;
    readonly scriptSignature: ScriptSig | undefined;
    readonly sequenceId: number;
    readonly transactionInWitness?: string[];
}
```

### ITransactionOutput

Interface for transaction outputs.

```typescript
interface ITransactionOutput {
    readonly index: number;
    readonly scriptPubKey: {
        hex: string;
        addresses?: string[];
        address?: string;
    };
    readonly value: string;  // Converted to bigint in TransactionOutput class
}
```

### ITransactionReceipt

```typescript
interface ITransactionReceipt {
    readonly receipt?: string | Buffer;
    readonly receiptProofs?: string[];
    readonly events?: RawContractEvents | ContractEvents;
    readonly revert?: string | Buffer;
    readonly gasUsed: string | bigint;
    readonly specialGasUsed: string | bigint;
}
```

### BroadcastedTransaction

```typescript
interface BroadcastedTransaction {
    success: boolean;
    result?: string;
    error?: string;
    peers?: number;
}
```

---

## Contract Types

### ContractData

```typescript
interface ContractData {
    bytecode: Buffer;
    wasCompressed: boolean;
    contractAddress: Address;
    contractPublicKey?: Buffer;
    deployedTransactionId?: string;
    deployedTransactionHash?: string;
    deployerPubKey?: Buffer;
    deployerAddress?: Address;
}
```

### ContractEvents

```typescript
interface ContractEvents {
    [address: string]: NetEvent[];
}
```

### IAccessList

Access list for optimized contract calls. Maps contract addresses to storage slots.

```typescript
interface IAccessListItem {
    [key: string]: string;
}

interface IAccessList {
    [key: string]: IAccessListItem;
}
```

---

## Storage Types

### IStorageValue

```typescript
interface IStorageValue {
    readonly pointer: PointerLike;      // bigint | string
    readonly value: string | Buffer;
    readonly height: BigNumberish;      // bigint | number | string
    readonly proofs?: string[];         // Optional
}
```

---

## Public Key Types

### PublicKeyInfo

```typescript
interface PublicKeyInfo {
    originalPubKey?: string;
    tweakedPubkey?: string;
    p2tr?: string;
    p2op?: string;
    lowByte?: number;
    p2pkh?: string;
    p2pkhUncompressed?: string;
    p2pkhHybrid?: string;
    p2shp2wpkh?: string;
    p2wpkh?: string;
    mldsaHashedPublicKey?: string;
    mldsaLevel?: MLDSASecurityLevel;
    mldsaPublicKey?: string | null;
}
```

### AddressTypes

Exported from `@btc-vision/transaction`.

```typescript
enum AddressTypes {
    P2PKH = 'P2PKH',                            // Legacy (1...)
    P2OP = 'P2OP',                              // OPNet contract address
    P2SH_OR_P2SH_P2WPKH = 'P2SH_OR_P2SH-P2WPKH', // Script hash (3...)
    P2PK = 'P2PK',                              // Public key
    P2TR = 'P2TR',                              // Taproot (bc1p...)
    P2WPKH = 'P2WPKH',                          // SegWit (bc1q...)
    P2WSH = 'P2WSH',                            // SegWit script
    // P2WDA = 'P2WDA',                         // UNUSED - internal only
}
```

### AddressesInfo

```typescript
interface AddressesInfo {
    [key: string]: Address;
}
```

---

## UTXO Types

### UTXO

```typescript
interface IUTXO {
    readonly transactionId: string;
    readonly outputIndex: number;
    readonly value: bigint | string;
    readonly scriptPubKey: ScriptPubKey;
    readonly raw: string;
}
```

### RequestUTXOsParams

```typescript
interface RequestUTXOsParams {
    readonly address: string;
    readonly optimize?: boolean;
    readonly mergePendingUTXOs?: boolean;
    readonly filterSpentUTXOs?: boolean;
    readonly olderThan?: bigint;
    readonly isCSV?: boolean;
}
```

### RequestUTXOsParamsWithAmount

```typescript
interface RequestUTXOsParamsWithAmount extends RequestUTXOsParams {
    readonly amount: bigint;
    readonly throwErrors?: boolean;
    readonly csvAddress?: string;
    readonly maxUTXOs?: number;
    readonly throwIfUTXOsLimitReached?: boolean;
}
```

---

## Epoch Types

### IEpoch

```typescript
interface IEpoch {
    readonly epochNumber: bigint;
    readonly epochHash: Buffer;
    readonly epochRoot: Buffer;
    readonly startBlock: bigint;
    readonly endBlock: bigint;
    readonly difficultyScaled: bigint;
    readonly minDifficulty?: string;
    readonly targetHash: Buffer;
    readonly proposer: IEpochMiner;
    readonly proofs: readonly Buffer[];
}
```

### IEpochMiner

```typescript
interface IEpochMiner {
    readonly solution: Buffer;
    readonly publicKey: Address;
    readonly salt: Buffer;
    readonly graffiti?: Buffer;
}
```

### IEpochTemplate

```typescript
interface IEpochTemplate {
    readonly epochNumber: bigint;
    readonly epochTarget: Buffer;
}
```

### EpochSubmissionParams

Parameters for submitting an epoch solution.

```typescript
interface EpochSubmissionParams {
    readonly epochNumber: bigint;
    readonly targetHash: Buffer;
    readonly salt: Buffer;
    readonly mldsaPublicKey: Buffer;
    readonly signature: Buffer;
    readonly graffiti?: Buffer;
}
```

### IEpochSubmission

```typescript
interface IEpochSubmission {
    readonly submissionTxId: Buffer;
    readonly submissionTxHash: Buffer;
    readonly submissionHash: Buffer;
    readonly confirmedAt: string;
    readonly epochProposed: IEpochMiner;
}
```

### ISubmittedEpoch

```typescript
interface ISubmittedEpoch {
    readonly epochNumber: bigint;
    readonly submissionHash: Buffer;
    readonly difficulty: number;
    readonly timestamp: Date;
    readonly status: SubmissionStatus;
    readonly message?: string;
}
```

### SubmissionStatus

```typescript
enum SubmissionStatus {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}
```

---

## Challenge Types

### ChallengeSolution

Exported from `@btc-vision/transaction`.

```typescript
interface ChallengeSolution {
    preimage: Buffer;
    reward: bigint;
    difficulty?: bigint;
    version?: number;
}
```

---

## ABI Types

### ABIDataTypes

Exported from `@btc-vision/transaction`.

```typescript
enum ABIDataTypes {
    UINT8, UINT16, UINT32, UINT64, UINT128, UINT256,
    INT8, INT16, INT32, INT64, INT128, INT256,
    BOOL, BYTES, BYTES32, STRING, ADDRESS, TUPLE,
    ARRAY_OF_UINT8, ARRAY_OF_UINT16, ARRAY_OF_UINT32,
    ARRAY_OF_UINT64, ARRAY_OF_UINT128, ARRAY_OF_UINT256,
    ARRAY_OF_BYTES, ARRAY_OF_BYTES32, ARRAY_OF_STRING,
    ARRAY_OF_ADDRESS, ARRAY_OF_BOOL,
}
```

### BitcoinAbiTypes

```typescript
enum BitcoinAbiTypes {
    Function = 'function',
    Event = 'event',
}
```

### BitcoinAbiValue

```typescript
interface BitcoinAbiValue {
    name: string;
    type: ABIDataTypes;
}
```

### BitcoinInterfaceAbi

```typescript
type BitcoinInterfaceAbi = (FunctionBaseData | EventBaseData)[];
```

---

## ML-DSA Types

### MLDSASecurityLevel

Exported from `@btc-vision/transaction`.

```typescript
enum MLDSASecurityLevel {
    ML_DSA_44 = 44,
    ML_DSA_65 = 65,
    ML_DSA_87 = 87,
}
```

---

## Next Steps

- [Provider API](./provider-api.md) - Provider methods
- [Contract API](./contract-api.md) - Contract class
- [ABI Overview](../abi-reference/abi-overview.md) - ABI system

---

[← Previous: Epoch API](./epoch-api.md) | [Home: Documentation →](../README.md)
