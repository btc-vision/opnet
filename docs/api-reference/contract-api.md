# Contract API Reference

Complete API reference for contract interactions.

## Table of Contents

- [getContract Factory](#getcontract-factory)
- [BaseContractProperties](#basecontractproperties)
- [CallResult](#callresult)
- [OPNetEvent](#opnetevent)
- [TransactionParameters](#transactionparameters)
- [InteractionTransactionReceipt](#interactiontransactionreceipt)
- [SignedInteractionTransactionReceipt](#signedinteractiontransactionreceipt)

---

## getContract Factory

### Signature

```typescript
function getContract<T extends BaseContractProperties>(
    address: string | Address,
    abi: BitcoinInterface | BitcoinInterfaceAbi,
    provider: AbstractRpcProvider,
    network: Network,
    sender?: Address
): BaseContract<T> & Omit<T, keyof BaseContract<T>>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string \| Address` | Contract address |
| `abi` | `BitcoinInterface \| BitcoinInterfaceAbi` | Contract ABI |
| `provider` | `AbstractRpcProvider` | Provider instance |
| `network` | `Network` | Bitcoin network |
| `sender` | `Address` | Optional sender address |

### Returns

Type-safe contract instance with methods matching the ABI.

---

## BaseContractProperties

Base interface for all contract instances.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `address` | `string \| Address` | Contract address |
| `provider` | `AbstractRpcProvider` | Provider instance |
| `network` | `Network` | Bitcoin network |

### Methods

#### setSender

Set the sender address for simulations.

```typescript
setSender(sender: Address): void
```

#### setSimulatedHeight

Set the block height for simulations.

```typescript
setSimulatedHeight(height: bigint): void
```

#### setAccessList

Set the access list for optimized calls.

```typescript
setAccessList(accessList: IAccessList): void
```

#### setTransactionDetails

Set transaction details for simulations.

```typescript
setTransactionDetails(
    details: ParsedSimulatedTransaction
): void
```

#### decodeEvents

Decode raw events using the contract ABI.

```typescript
decodeEvents(
    events: NetEvent[] | ContractEvents
): OPNetEvent<ContractDecodedObjectResult>[]
```

#### decodeEvent

Decode a single event.

```typescript
decodeEvent(event: NetEvent): OPNetEvent<ContractDecodedObjectResult>
```

#### encodeCalldata

Encode calldata for a contract method.

```typescript
encodeCalldata(method: string, args: unknown[]): Uint8Array
```

---

## CallResult

Result of a contract call.

### Generic Type

```typescript
class CallResult<
    T extends ContractDecodedObjectResult = {},
    U extends OPNetEvent<ContractDecodedObjectResult>[] = OPNetEvent<ContractDecodedObjectResult>[]
>
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `properties` | `T` | Decoded return values |
| `events` | `U` | Emitted events |
| `result` | `BinaryReader` | Raw result data reader |
| `accessList` | `IAccessList` | Access list from call |
| `constant` | `boolean` | Whether function is read-only (from ABI) |
| `payable` | `boolean` | Whether function requires payment (from ABI) |
| `revert` | `string \| undefined` | Decoded revert message if failed |
| `estimatedGas` | `bigint \| undefined` | Estimated gas consumed |
| `refundedGas` | `bigint \| undefined` | Gas that would be refunded |
| `estimatedSatGas` | `bigint` | Estimated gas in satoshis |
| `estimatedRefundedGasInSat` | `bigint` | Refunded gas in satoshis |
| `calldata` | `Uint8Array \| undefined` | Encoded calldata |
| `to` | `string \| undefined` | Target contract address string |
| `address` | `Address \| undefined` | Target contract Address object |
| `fromAddress` | `Address \| undefined` | Sender address |
| `csvAddress` | `IP2WSHAddress \| undefined` | CSV address for sender |
| `rawEvents` | `EventList` | Raw events before decoding |

### Methods

#### setEvents

Set decoded events.

```typescript
setEvents(events: U): void
```

#### signTransaction

Signs a transaction without broadcasting.

```typescript
async signTransaction(
    interactionParams: TransactionParameters,
    amountAddition?: bigint
): Promise<SignedInteractionTransactionReceipt>
```

#### sendPresignedTransaction

Broadcasts a pre-signed transaction.

```typescript
async sendPresignedTransaction(
    signedTx: SignedInteractionTransactionReceipt
): Promise<InteractionTransactionReceipt>
```

#### sendTransaction

Signs and broadcasts a transaction.

```typescript
async sendTransaction(
    interactionParams: TransactionParameters,
    amountAddition?: bigint
): Promise<InteractionTransactionReceipt>
```

---

## OPNetEvent

Represents a contract event.

### Generic Type

```typescript
class OPNetEvent<T extends ContractDecodedObjectResult>
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `eventType` | `string` | Event name |
| `eventData` | `T` | Decoded event data |

---

## TransactionParameters

Parameters for sending transactions.

```typescript
interface TransactionParameters {
    // Signers
    readonly signer: Signer | UniversalSigner | null;
    readonly mldsaSigner: QuantumBIP32Interface | null;

    // Addresses
    readonly refundTo: string;           // Address for change/refund (any type)
    readonly sender?: string;            // Sender address (optional)
    readonly from?: Address;             // From address object

    // Fees
    feeRate?: number;                    // Sat/vB fee rate
    readonly priorityFee?: bigint;       // Priority fee in satoshis

    // Required
    readonly maximumAllowedSatToSpend: bigint;  // Max satoshis to spend
    readonly network: Network;           // Bitcoin network

    // UTXOs
    readonly utxos?: UTXO[];             // Custom UTXOs to use
    readonly extraInputs?: UTXO[];       // Additional inputs
    readonly extraOutputs?: PsbtOutputExtended[];  // Additional outputs

    // Gas
    readonly minGas?: bigint;            // Minimum gas

    // Options
    readonly note?: string | Uint8Array;      // Transaction note
    readonly p2wda?: boolean;            // P2WDA mode
    readonly txVersion?: SupportedTransactionVersion;  // TX version
    readonly anchor?: boolean;           // Anchor transaction

    // CSV/UTXO Options
    readonly dontUseCSVUtxos?: boolean;  // Skip CSV UTXOs
    readonly maxUTXOs?: number;          // Max UTXOs to use
    readonly throwIfUTXOsLimitReached?: boolean;

    // ML-DSA Options
    readonly linkMLDSAPublicKeyToAddress?: boolean;
    readonly revealMLDSAPublicKey?: boolean;

    // Challenge
    readonly challenge?: ChallengeSolution;
}
```

---

## Contract Method Signatures

### Read Method (Simulation)

```typescript
// Method with no parameters
async methodName(): Promise<CallResult<TProperties, TEvents>>

// Method with parameters
async methodName(
    param1: Type1,
    param2: Type2
): Promise<CallResult<TProperties, TEvents>>
```

### Write Method (Transaction)

```typescript
// Method with transaction parameters
async methodName(
    param1: Type1,
    param2: Type2,
    txParams: TransactionParameters
): Promise<InteractionTransactionReceipt>
```

---

## SignedInteractionTransactionReceipt

Result of signing a transaction (before broadcast).

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `fundingTransactionRaw` | `string \| null` | Funding transaction hex |
| `interactionTransactionRaw` | `string` | Interaction transaction hex |
| `nextUTXOs` | `UTXO[]` | UTXOs after transaction |
| `estimatedFees` | `bigint` | Estimated total fees |
| `challengeSolution` | `RawChallenge` | PoW challenge solution |
| `interactionAddress` | `string \| null` | Interaction address |
| `fundingUTXOs` | `UTXO[]` | UTXOs used for funding |
| `fundingInputUtxos` | `UTXO[]` | Input UTXOs for funding |
| `compiledTargetScript` | `string \| null` | Compiled target script |
| `utxoTracking` | `UTXOTrackingInfo` | UTXO tracking information |

---

## InteractionTransactionReceipt

Result of a broadcasted transaction.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `transactionId` | `string` | Transaction ID |
| `newUTXOs` | `UTXO[]` | New UTXOs created |
| `peerAcknowledgements` | `number` | Number of peer confirmations |
| `estimatedFees` | `bigint` | Estimated fees paid |
| `challengeSolution` | `RawChallenge` | PoW challenge solution |
| `rawTransaction` | `string` | Raw transaction hex |
| `interactionAddress` | `string \| null` | Interaction address |
| `fundingUTXOs` | `UTXO[]` | UTXOs used for funding |
| `fundingInputUtxos` | `UTXO[]` | Input UTXOs for funding |
| `compiledTargetScript` | `string \| null` | Compiled target script |

---

## IAccessList

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

## Example Usage

### Read Call

```typescript
const contract = getContract<IOP20Contract>(
    tokenAddress,
    OP_20_ABI,
    provider,
    network
);

// Simple read
const balance = await contract.balanceOf(userAddress);
console.log('Balance:', balance.properties.balance);
console.log('Gas used:', balance.estimatedGas);

// Check for revert
if (balance.revert) {
    console.error('Call reverted:', balance.revert);
}
```

### Write Call

```typescript
// First simulate the call
const simulation = await contract.transfer(recipient, amount, new Uint8Array(0));

// Check for revert before sending
if (simulation.revert) {
    throw new Error(`Transfer would fail: ${simulation.revert}`);
}

// Send the transaction
const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaSigner,
    refundTo: wallet.p2tr,
    maximumAllowedSatToSpend: 100000n,
    network: network,
    feeRate: 10,
});

console.log('TX ID:', result.transactionId);
console.log('Fees:', result.estimatedFees);
```

### With Access List Optimization

```typescript
// First call captures access list
const firstCall = await contract.balanceOf(userAddress);
const accessList = firstCall.accessList;

// Subsequent calls use access list for optimization
contract.setAccessList(accessList);
const optimizedCall = await contract.balanceOf(userAddress);
```

### Offline Signing

```typescript
// Sign transaction without broadcasting
const signedTx = await simulation.signTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaSigner,
    refundTo: wallet.p2tr,
    maximumAllowedSatToSpend: 100000n,
    network: network,
    feeRate: 10,
});

// Later: broadcast the signed transaction
const receipt = await simulation.sendPresignedTransaction(signedTx);
console.log('Broadcasted:', receipt.transactionId);
```

---

## Next Steps

- [Provider API](./provider-api.md) - Provider methods
- [UTXO Manager API](./utxo-manager-api.md) - UTXO management
- [Types & Interfaces](./types-interfaces.md) - Type definitions

---

[← Previous: Provider API](./provider-api.md) | [Next: UTXO Manager API →](./utxo-manager-api.md)
