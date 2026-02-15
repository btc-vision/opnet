# ABI Data Types

This guide covers the supported data types in OPNet ABIs.

## Overview

ABIDataTypes define how values are encoded and decoded when calling contracts. Each type maps to a specific binary representation.

The `type` field of a `BitcoinAbiValue` accepts three forms:

- **Simple**: An `ABIDataTypes` enum value (e.g., `ABIDataTypes.UINT256`)
- **Tuple**: An array of `AbiType` (e.g., `[ABIDataTypes.ADDRESS, ABIDataTypes.UINT256]`)
- **Struct**: An object with named fields (e.g., `{ minted: ABIDataTypes.UINT256, active: ABIDataTypes.BOOL }`)

---

## ABIDataTypes Enum

```typescript
enum ABIDataTypes {
    // Unsigned integers
    UINT8 = 'UINT8',
    UINT16 = 'UINT16',
    UINT32 = 'UINT32',
    UINT64 = 'UINT64',
    UINT128 = 'UINT128',
    UINT256 = 'UINT256',

    // Signed integers
    INT8 = 'INT8',
    INT16 = 'INT16',
    INT32 = 'INT32',
    INT64 = 'INT64',
    INT128 = 'INT128',

    // Basic types
    BOOL = 'BOOL',
    ADDRESS = 'ADDRESS',
    EXTENDED_ADDRESS = 'EXTENDED_ADDRESS',
    STRING = 'STRING',
    BYTES4 = 'BYTES4',
    BYTES32 = 'BYTES32',
    BYTES = 'BYTES',

    // Tuples/Maps
    ADDRESS_UINT256_TUPLE = 'ADDRESS_UINT256_TUPLE',
    EXTENDED_ADDRESS_UINT256_TUPLE = 'EXTENDED_ADDRESS_UINT256_TUPLE',

    // Signatures
    SCHNORR_SIGNATURE = 'SCHNORR_SIGNATURE',

    // Arrays
    ARRAY_OF_ADDRESSES = 'ARRAY_OF_ADDRESSES',
    ARRAY_OF_EXTENDED_ADDRESSES = 'ARRAY_OF_EXTENDED_ADDRESSES',
    ARRAY_OF_UINT256 = 'ARRAY_OF_UINT256',
    ARRAY_OF_UINT128 = 'ARRAY_OF_UINT128',
    ARRAY_OF_UINT64 = 'ARRAY_OF_UINT64',
    ARRAY_OF_UINT32 = 'ARRAY_OF_UINT32',
    ARRAY_OF_UINT16 = 'ARRAY_OF_UINT16',
    ARRAY_OF_UINT8 = 'ARRAY_OF_UINT8',
    ARRAY_OF_STRING = 'ARRAY_OF_STRING',
    ARRAY_OF_BYTES = 'ARRAY_OF_BYTES',
    ARRAY_OF_BUFFERS = 'ARRAY_OF_BUFFERS',
}
```

---

## Type Mapping

### TypeScript to ABI Types

| TypeScript Type | ABI Type | Notes |
|----------------|----------|-------|
| `number` | `UINT8`, `UINT16`, `UINT32`, `INT8`, `INT16`, `INT32` | Small integers |
| `bigint` | `UINT64`, `UINT128`, `UINT256`, `INT64`, `INT128` | Large integers |
| `boolean` | `BOOL` | True/false |
| `string` | `STRING` | UTF-8 text |
| `Uint8Array` | `BYTES`, `BYTES4`, `BYTES32` | Raw bytes |
| `Address` | `ADDRESS` | OPNet address |
| `Address` | `EXTENDED_ADDRESS` | Extended address type |
| `SchnorrSignature` | `SCHNORR_SIGNATURE` | Schnorr signature |
| `AddressMap<bigint>` | `ADDRESS_UINT256_TUPLE` | Address-to-uint256 map |
| `ExtendedAddressMap<bigint>` | `EXTENDED_ADDRESS_UINT256_TUPLE` | Extended-address-to-uint256 map |
| `Address[]` | `ARRAY_OF_ADDRESSES`, `ARRAY_OF_EXTENDED_ADDRESSES` | Arrays of addresses |
| `bigint[]` | `ARRAY_OF_UINT256`, `ARRAY_OF_UINT128`, `ARRAY_OF_UINT64` | Arrays of large integers |
| `number[]` | `ARRAY_OF_UINT32`, `ARRAY_OF_UINT16`, `ARRAY_OF_UINT8` | Arrays of small integers |
| `string[]` | `ARRAY_OF_STRING` | Array of strings |
| `Uint8Array[]` | `ARRAY_OF_BYTES`, `ARRAY_OF_BUFFERS` | Arrays of byte arrays |

---

## Unsigned Integers

### UINT8

8-bit unsigned integer (0 to 255).

```typescript
{
    name: 'decimals',
    type: ABIDataTypes.UINT8,
}
```

**TypeScript**: `number`

### UINT16

16-bit unsigned integer (0 to 65,535).

```typescript
{
    name: 'smallValue',
    type: ABIDataTypes.UINT16,
}
```

**TypeScript**: `number`

### UINT32

32-bit unsigned integer (0 to 4,294,967,295).

```typescript
{
    name: 'mediumValue',
    type: ABIDataTypes.UINT32,
}
```

**TypeScript**: `number`

### UINT64

64-bit unsigned integer.

```typescript
{
    name: 'timestamp',
    type: ABIDataTypes.UINT64,
}
```

**TypeScript**: `bigint`

### UINT128

128-bit unsigned integer.

```typescript
{
    name: 'largeValue',
    type: ABIDataTypes.UINT128,
}
```

**TypeScript**: `bigint`

### UINT256

256-bit unsigned integer (most common for token amounts).

```typescript
{
    name: 'amount',
    type: ABIDataTypes.UINT256,
}
```

**TypeScript**: `bigint`

---

## Signed Integers

### INT8 to INT128

Signed versions of the unsigned integer types (INT8, INT16, INT32, INT64, INT128).

```typescript
{
    name: 'signedAmount',
    type: ABIDataTypes.INT128,
}
```

**TypeScript**: `number` (INT8, INT16, INT32) or `bigint` (INT64, INT128)

---

## Boolean

### BOOL

Boolean true or false value.

```typescript
{
    name: 'isActive',
    type: ABIDataTypes.BOOL,
}
```

**TypeScript**: `boolean`

---

## Bytes

### BYTES

Variable-length byte array.

```typescript
{
    name: 'data',
    type: ABIDataTypes.BYTES,
}
```

**TypeScript**: `Uint8Array`

### BYTES4

Fixed 4-byte array (common for function selectors).

```typescript
{
    name: 'selector',
    type: ABIDataTypes.BYTES4,
}
```

**TypeScript**: `Uint8Array` (4 bytes)

### BYTES32

Fixed 32-byte array (common for hashes).

```typescript
{
    name: 'hash',
    type: ABIDataTypes.BYTES32,
}
```

**TypeScript**: `Uint8Array` (32 bytes)

---

## String

### STRING

UTF-8 encoded string.

```typescript
{
    name: 'tokenName',
    type: ABIDataTypes.STRING,
}
```

**TypeScript**: `string`

---

## Address

### ADDRESS

OPNet address type.

```typescript
{
    name: 'recipient',
    type: ABIDataTypes.ADDRESS,
}
```

**TypeScript**: `Address` (from `@btc-vision/transaction`)

### EXTENDED_ADDRESS

Extended address type with additional metadata.

```typescript
{
    name: 'extRecipient',
    type: ABIDataTypes.EXTENDED_ADDRESS,
}
```

**TypeScript**: `Address` (from `@btc-vision/transaction`)

---

## Tuples/Maps

### ADDRESS_UINT256_TUPLE

Built-in tuple mapping addresses to uint256 values. Used for address-keyed maps (e.g., balance snapshots).

```typescript
{
    name: 'balances',
    type: ABIDataTypes.ADDRESS_UINT256_TUPLE,
}
```

**TypeScript**: `AddressMap<bigint>` (from `@btc-vision/transaction`)

### EXTENDED_ADDRESS_UINT256_TUPLE

Same as `ADDRESS_UINT256_TUPLE` but uses extended addresses.

```typescript
{
    name: 'extBalances',
    type: ABIDataTypes.EXTENDED_ADDRESS_UINT256_TUPLE,
}
```

**TypeScript**: `ExtendedAddressMap<bigint>` (from `@btc-vision/transaction`)

---

## Signatures

### SCHNORR_SIGNATURE

Schnorr signature type for on-chain signature verification.

```typescript
{
    name: 'signature',
    type: ABIDataTypes.SCHNORR_SIGNATURE,
}
```

**TypeScript**: `SchnorrSignature` (from `@btc-vision/transaction`)

---

## Arrays

### Array Types

Built-in arrays of basic types:

```typescript
// Array of addresses
{
    name: 'recipients',
    type: ABIDataTypes.ARRAY_OF_ADDRESSES,
}

// Array of extended addresses
{
    name: 'extRecipients',
    type: ABIDataTypes.ARRAY_OF_EXTENDED_ADDRESSES,
}

// Array of amounts
{
    name: 'amounts',
    type: ABIDataTypes.ARRAY_OF_UINT256,
}

// Array of strings
{
    name: 'names',
    type: ABIDataTypes.ARRAY_OF_STRING,
}

// Array of byte arrays
{
    name: 'buffers',
    type: ABIDataTypes.ARRAY_OF_BUFFERS,
}
```

**TypeScript**: `Address[]`, `bigint[]`, `number[]`, `string[]`, `Uint8Array[]`, etc.

---

## Tuples (Custom Composite Types)

Beyond the built-in `ABIDataTypes` enum, the `type` field of a `BitcoinAbiValue` can be an **array of types** to define a tuple. Tuples represent ordered, multi-field composite values.

### Single-Element Tuple (Typed Array)

A single-element tuple `[T]` encodes as a **flat array** of that type:

```typescript
{
    name: 'scores',
    type: [ABIDataTypes.UINT256],
}
```

**TypeScript**: `bigint[]`

This is equivalent to using a built-in `ARRAY_OF_*` type, but works for any type including nested tuples and structs.

**Encoding**: writes count (u16), then each element in sequence.

**Passing values**:

```typescript
const result = await contract.getScores();
// result.properties.scores → bigint[]

await contract.setScores([100n, 200n, 300n], txParams);
```

### Multi-Element Tuple (Array of Ordered Entries)

A multi-element tuple `[T1, T2, ...]` encodes as an **array of ordered entries**, where each entry contains one value per tuple element:

```typescript
{
    name: 'transfers',
    type: [ABIDataTypes.ADDRESS, ABIDataTypes.UINT256],
}
```

**TypeScript**: `[Address, bigint][]`

**Encoding**: writes count (u16), then for each entry writes the fields in order.

**Passing values**:

```typescript
// Each entry is an array matching the tuple shape
await contract.batchTransfer(
    [
        [recipientA, 100n],
        [recipientB, 200n],
    ],
    txParams
);

// Reading results
const result = await contract.getTransfers();
// result.properties.transfers → [Address, bigint][]
for (const [addr, amount] of result.properties.transfers) {
    console.log(`${addr}: ${amount}`);
}
```

---

## Structs (Named Field Objects)

A **struct** is an object mapping field names to types. Unlike tuples, structs encode a **single inline value** with named fields (no count prefix, no array wrapping).

```typescript
{
    name: 'status',
    type: {
        minted: ABIDataTypes.UINT256,
        active: ABIDataTypes.BOOL,
    },
}
```

**TypeScript**: `{ minted: bigint; active: boolean }`

**Encoding**: writes each field in declaration order (no count prefix).

**Passing values**:

```typescript
// Reading a struct output
const result = await contract.getStatus();
// result.properties.status → { minted: bigint, active: boolean }
console.log(result.properties.status.minted);
console.log(result.properties.status.active);

// Passing a struct input
await contract.setStatus(
    { minted: 1000n, active: true },
    txParams
);
```

### Nested Structs and Tuples

Structs and tuples can be nested arbitrarily:

```typescript
// Struct with a nested tuple field
{
    name: 'pool',
    type: {
        token: ABIDataTypes.ADDRESS,
        reserves: [ABIDataTypes.UINT256],  // array of uint256
    },
}
// TypeScript: { token: Address; reserves: bigint[] }

// Tuple with a struct element
{
    name: 'entries',
    type: [ABIDataTypes.ADDRESS, { amount: ABIDataTypes.UINT256, active: ABIDataTypes.BOOL }],
}
// TypeScript: [Address, { amount: bigint; active: boolean }][]
```

---

## Common Type Patterns

### Token Amount

```typescript
{
    name: 'amount',
    type: ABIDataTypes.UINT256,
}
```

### Address Parameters

```typescript
{
    name: 'from',
    type: ABIDataTypes.ADDRESS,
},
{
    name: 'to',
    type: ABIDataTypes.ADDRESS,
}
```

### Metadata Strings

```typescript
{
    name: 'name',
    type: ABIDataTypes.STRING,
},
{
    name: 'symbol',
    type: ABIDataTypes.STRING,
}
```

### Hash Values

```typescript
{
    name: 'txHash',
    type: ABIDataTypes.BYTES32,
}
```

### Batch Operations

```typescript
{
    name: 'recipients',
    type: ABIDataTypes.ARRAY_OF_ADDRESSES,
},
{
    name: 'amounts',
    type: ABIDataTypes.ARRAY_OF_UINT256,
}
```

---

## Example ABI Definitions

### Transfer Function

```typescript
{
    name: 'transfer',
    type: BitcoinAbiTypes.Function,
    inputs: [
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    ],
    outputs: [],
}
```

### Balance Query

```typescript
{
    name: 'balanceOf',
    type: BitcoinAbiTypes.Function,
    constant: true,
    inputs: [
        { name: 'owner', type: ABIDataTypes.ADDRESS },
    ],
    outputs: [
        { name: 'balance', type: ABIDataTypes.UINT256 },
    ],
}
```

### Transfer Event

```typescript
{
    name: 'Transferred',
    type: BitcoinAbiTypes.Event,
    values: [
        { name: 'from', type: ABIDataTypes.ADDRESS },
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    ],
}
```

### Batch Transfer

```typescript
{
    name: 'batchTransfer',
    type: BitcoinAbiTypes.Function,
    inputs: [
        { name: 'recipients', type: ABIDataTypes.ARRAY_OF_ADDRESSES },
        { name: 'amounts', type: ABIDataTypes.ARRAY_OF_UINT256 },
    ],
    outputs: [],
}
```

---

## Best Practices

1. **Use Appropriate Sizes**: Choose the smallest type that fits your data

2. **UINT256 for Tokens**: Always use UINT256 for token amounts

3. **ADDRESS for Addresses**: Use ADDRESS type, not BYTES32

4. **Arrays for Batches**: Use array types for batch operations

5. **BYTES32 for Hashes**: Use BYTES32 for fixed-size hashes

6. **Structs for Named Data**: Use structs when fields have distinct meanings

7. **Tuples for Tabular Data**: Use multi-element tuples for arrays of grouped values (e.g., address+amount pairs)

---

## Next Steps

- [ABI Overview](./abi-overview.md) - ABI system overview
- [OP20 ABI](./op20-abi.md) - Token standard
- [Custom ABIs](./custom-abis.md) - Creating custom ABIs

---

[← Previous: ABI Overview](./abi-overview.md) | [Next: OP20 ABI →](./op20-abi.md)
