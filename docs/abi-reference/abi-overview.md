# ABI Overview

This guide covers the Application Binary Interface (ABI) system in OPNet.

## Overview

ABIs define how to interact with smart contracts. They specify function signatures, input/output types, and events that contracts emit.

```mermaid
flowchart LR
    A[BitcoinInterfaceAbi] --> B[BitcoinInterface]
    B --> C[Contract Instance]
    C --> D[Type-Safe Calls]
```

---

## BitcoinInterface Class

The `BitcoinInterface` class wraps and validates ABI definitions.

### Creating from ABI

```typescript
import { BitcoinInterface, OP_20_ABI } from 'opnet';

// From existing ABI array
const interface1 = new BitcoinInterface(OP_20_ABI);

// Using static factory (handles both types)
const interface2 = BitcoinInterface.from(OP_20_ABI);
const interface3 = BitcoinInterface.from(interface1); // Returns same instance
```

### Checking for Functions

```typescript
const abi = new BitcoinInterface(OP_20_ABI);

// Check if function exists
if (abi.hasFunction('transfer')) {
    console.log('Transfer function available');
}

if (abi.hasFunction('customMethod')) {
    console.log('Custom method exists');
}
```

### Checking for Events

```typescript
const abi = new BitcoinInterface(OP_20_ABI);

// Check if event exists
if (abi.hasEvent('Transferred')) {
    console.log('Transfer event available');
}

if (abi.hasEvent('Approved')) {
    console.log('Approval event available');
}
```

---

## ABI Structure

### BitcoinInterfaceAbi Type

An ABI is an array of function and event definitions:

```typescript
type BitcoinInterfaceAbi = (FunctionBaseData | EventBaseData)[];
```

### Function Definition

```typescript
interface FunctionBaseData {
    name: string;           // Function name
    type: 'function';       // Type identifier
    constant?: boolean;     // Read-only (no state change)
    payable?: boolean;      // Can receive Bitcoin

    inputs?: BitcoinAbiValue[];   // Input parameters
    outputs?: BitcoinAbiValue[];  // Return values
}
```

### Event Definition

```typescript
interface EventBaseData {
    name: string;           // Event name
    type: 'event';          // Type identifier
    values: BitcoinAbiValue[];  // Event parameters
}
```

### ABI Value

```typescript
interface BitcoinAbiValue {
    name: string;           // Parameter name
    type: ABIDataTypes;     // Data type
}
```

---

## Built-in ABIs

OPNet provides pre-defined ABIs for common contracts:

| ABI | Description |
|-----|-------------|
| `OP_20_ABI` | Fungible token standard |
| `OP_20S_ABI` | Ownable fungible token |
| `OP_721_ABI` | NFT standard |
| `MOTOSWAP_ROUTER_ABI` | DEX router |
| `MotoswapPoolAbi` | Liquidity pool |
| `MotoSwapFactoryAbi` | Pool factory |

### Using Built-in ABIs

```typescript
import {
    OP_20_ABI,
    OP_721_ABI,
    MOTOSWAP_ROUTER_ABI,
    getContract,
} from 'opnet';

// Token contract
const token = getContract<IOP20Contract>(
    tokenAddress,
    OP_20_ABI,
    provider,
    network
);

// NFT contract
const nft = getContract<IOP721Contract>(
    nftAddress,
    OP_721_ABI,
    provider,
    network
);

// Router contract
const router = getContract<IMotoswapRouterContract>(
    routerAddress,
    MOTOSWAP_ROUTER_ABI,
    provider,
    network
);
```

---

## ABI Types Enum

### BitcoinAbiTypes

```typescript
enum BitcoinAbiTypes {
    Function = 'function',
    Event = 'event',
}
```

---

## Creating Custom ABIs

### Define Custom ABI

```typescript
import { ABIDataTypes, BitcoinAbiTypes } from 'opnet';

const MY_CONTRACT_ABI = [
    // Read function
    {
        name: 'getValue',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [
            { name: 'value', type: ABIDataTypes.UINT256 }
        ],
    },

    // Write function
    {
        name: 'setValue',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'newValue', type: ABIDataTypes.UINT256 }
        ],
        outputs: [],
    },

    // Event
    {
        name: 'ValueChanged',
        type: BitcoinAbiTypes.Event,
        values: [
            { name: 'oldValue', type: ABIDataTypes.UINT256 },
            { name: 'newValue', type: ABIDataTypes.UINT256 },
        ],
    },
];
```

### Define TypeScript Interface

```typescript
import { CallResult, OPNetEvent, BaseContractProperties } from 'opnet';

// Event type
interface ValueChangedEvent {
    oldValue: bigint;
    newValue: bigint;
}

// Result types
type GetValue = CallResult<{ value: bigint }, []>;
type SetValue = CallResult<{}, [OPNetEvent<ValueChangedEvent>]>;

// Contract interface
interface IMyContract extends BaseContractProperties {
    getValue(): Promise<GetValue>;
    setValue(newValue: bigint): Promise<SetValue>;
}
```

### Use Custom Contract

```typescript
const myContract = getContract<IMyContract>(
    contractAddress,
    MY_CONTRACT_ABI,
    provider,
    network
);

// Read value
const result = await myContract.getValue();
console.log('Value:', result.properties.value);

// Write value
const setResult = await myContract.setValue(123n, {
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    feeRate: 10,
});
```

---

## ABI Validation

The `BitcoinInterface` constructor validates ABIs:

```typescript
// This will throw an error
try {
    const invalid = new BitcoinInterface([]);
    // Error: "The ABI provided is empty."
} catch (error) {
    console.error(error);
}

// Missing name
try {
    const invalid = new BitcoinInterface([
        { type: 'function', inputs: [], outputs: [] }
    ]);
    // Error: "The ABI provided is missing a name."
} catch (error) {
    console.error(error);
}
```

---

## Best Practices

1. **Use Built-in ABIs**: Use pre-defined ABIs when possible

2. **Define Interfaces**: Create TypeScript interfaces for type safety

3. **Validate Early**: Validate ABIs at startup, not during calls

4. **Keep ABIs Updated**: Ensure ABIs match deployed contracts

5. **Document Custom ABIs**: Add comments explaining custom functions

---

## Next Steps

- [Data Types](./data-types.md) - Supported ABI data types
- [OP20 ABI](./op20-abi.md) - Token standard
- [OP721 ABI](./op721-abi.md) - NFT standard
- [Custom ABIs](./custom-abis.md) - Creating custom ABIs

---

[← Previous: Revert Decoder](../utils/revert-decoder.md) | [Next: Data Types →](./data-types.md)
