# ABI Data Types

This guide covers the supported data types in OPNet ABIs.

## Overview

ABIDataTypes define how values are encoded and decoded when calling contracts. Each type maps to a specific binary representation.

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
    INT256 = 'INT256',

    // Boolean
    BOOL = 'BOOL',

    // Bytes
    BYTES = 'BYTES',
    BYTES32 = 'BYTES32',

    // String
    STRING = 'STRING',

    // Address
    ADDRESS = 'ADDRESS',

    // Tuple
    TUPLE = 'TUPLE',

    // Arrays
    ARRAY_OF_UINT8 = 'ARRAY_OF_UINT8',
    ARRAY_OF_UINT16 = 'ARRAY_OF_UINT16',
    ARRAY_OF_UINT32 = 'ARRAY_OF_UINT32',
    ARRAY_OF_UINT64 = 'ARRAY_OF_UINT64',
    ARRAY_OF_UINT128 = 'ARRAY_OF_UINT128',
    ARRAY_OF_UINT256 = 'ARRAY_OF_UINT256',
    ARRAY_OF_BYTES = 'ARRAY_OF_BYTES',
    ARRAY_OF_BYTES32 = 'ARRAY_OF_BYTES32',
    ARRAY_OF_STRING = 'ARRAY_OF_STRING',
    ARRAY_OF_ADDRESS = 'ARRAY_OF_ADDRESS',
    ARRAY_OF_BOOL = 'ARRAY_OF_BOOL',
}
```

---

## Type Mapping

### TypeScript to ABI Types

| TypeScript Type | ABI Type | Notes |
|----------------|----------|-------|
| `number` | `UINT8`, `UINT16`, `UINT32`, `INT8`, `INT16`, `INT32` | Small integers |
| `bigint` | `UINT64`, `UINT128`, `UINT256`, `INT64`, `INT128`, `INT256` | Large integers |
| `boolean` | `BOOL` | True/false |
| `string` | `STRING` | UTF-8 text |
| `Uint8Array` | `BYTES`, `BYTES32` | Raw bytes |
| `Address` | `ADDRESS` | OPNet address |
| `Array<T>` | `ARRAY_OF_*` | Arrays of types |

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

### INT8 to INT256

Signed versions of the unsigned integer types.

```typescript
{
    name: 'signedAmount',
    type: ABIDataTypes.INT256,
}
```

**TypeScript**: `bigint` (can be negative)

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

---

## Arrays

### Array Types

Arrays of the basic types:

```typescript
// Array of addresses
{
    name: 'recipients',
    type: ABIDataTypes.ARRAY_OF_ADDRESS,
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
```

**TypeScript**: `Address[]`, `bigint[]`, `string[]`, etc.

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
    type: ABIDataTypes.ARRAY_OF_ADDRESS,
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
        { name: 'recipients', type: ABIDataTypes.ARRAY_OF_ADDRESS },
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

---

## Next Steps

- [ABI Overview](./abi-overview.md) - ABI system overview
- [OP20 ABI](./op20-abi.md) - Token standard
- [Custom ABIs](./custom-abis.md) - Creating custom ABIs

---

[← Previous: ABI Overview](./abi-overview.md) | [Next: OP20 ABI →](./op20-abi.md)
