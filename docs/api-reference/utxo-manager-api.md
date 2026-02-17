# UTXO Manager API Reference

Complete API reference for UTXO management.

## UTXOsManager Class

Manages UTXO tracking and retrieval for transaction building.

### Constructor

```typescript
new UTXOsManager(provider: IProviderForUTXO)
```

---

## Methods

### getUTXOs

Get UTXOs for an address with optional filters.

```typescript
async getUTXOs(params: RequestUTXOsParams): Promise<UTXOs>
```

#### RequestUTXOsParams

```typescript
interface RequestUTXOsParams {
    readonly address: string;              // Bitcoin address
    readonly optimize?: boolean;           // Optimize UTXO selection
    readonly mergePendingUTXOs?: boolean;  // Include unconfirmed UTXOs
    readonly filterSpentUTXOs?: boolean;   // Exclude known spent UTXOs
    readonly olderThan?: bigint;           // Only UTXOs older than this block
    readonly isCSV?: boolean;              // CSV (timelock) UTXOs
}
```

### getUTXOsForAmount

Get UTXOs that cover a specific amount.

```typescript
async getUTXOsForAmount(
    params: RequestUTXOsParamsWithAmount
): Promise<UTXOs>
```

#### RequestUTXOsParamsWithAmount

```typescript
interface RequestUTXOsParamsWithAmount extends RequestUTXOsParams {
    readonly amount: bigint;                    // Amount to cover
    readonly throwErrors?: boolean;             // Throw if insufficient
    readonly csvAddress?: string;               // CSV address for priority
    readonly maxUTXOs?: number;                 // Max UTXOs to select
    readonly throwIfUTXOsLimitReached?: boolean; // Throw if limit reached
}
```

### spentUTXO

Mark UTXOs as spent and register new UTXOs (for tracking).

```typescript
spentUTXO(address: string, spent: UTXOs, newUTXOs: UTXOs): void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | The address whose UTXOs to update |
| `spent` | `UTXOs` | UTXOs that were spent |
| `newUTXOs` | `UTXOs` | New UTXOs created (e.g., change outputs) |

### getPendingUTXOs

Get pending (unconfirmed) UTXOs for an address.

```typescript
getPendingUTXOs(address: string): UTXOs
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | The address to get pending UTXOs for |

### getMultipleUTXOs

Get UTXOs for multiple addresses in a single call.

```typescript
async getMultipleUTXOs(
    params: RequestMultipleUTXOsParams
): Promise<Record<string, UTXOs>>
```

#### RequestMultipleUTXOsParams

```typescript
interface RequestMultipleUTXOsParams {
    readonly requests: RequestUTXOsParams[];
    readonly mergePendingUTXOs?: boolean;
    readonly filterSpentUTXOs?: boolean;
}
```

### clean

Clear the spent UTXO tracking cache. Optionally pass an address to clear only that address.

```typescript
clean(address?: string): void
```

---

## UTXO Class

```typescript
class UTXO {
    readonly transactionId: string;             // Transaction ID
    readonly outputIndex: number;               // Output index
    readonly value: bigint;                     // Value in satoshis
    readonly scriptPubKey: ScriptPubKey;        // Locking script
    readonly nonWitnessUtxo?: Uint8Array | string; // Full previous transaction
    witnessScript?: Uint8Array | string;        // Witness script
    redeemScript?: Uint8Array | string;         // Redeem script
    isCSV?: boolean;                            // CheckSequenceVerify timelock
}
```

---

## UTXOs Type

```typescript
type UTXOs = UTXO[];
```

---

## Usage Examples

### Basic UTXO Retrieval

```typescript
import { UTXOsManager, JSONRpcProvider } from 'opnet';

const provider = new JSONRpcProvider({ url, network });
const utxoManager = new UTXOsManager(provider);

// Get all UTXOs
const utxos = await utxoManager.getUTXOs({
    address: 'bc1p...',
});

console.log('Found', utxos.length, 'UTXOs');
for (const utxo of utxos) {
    console.log(`${utxo.transactionId}:${utxo.outputIndex} = ${utxo.value} sats`);
}
```

### Get UTXOs for Amount

```typescript
// Get UTXOs covering at least 1 BTC
const utxos = await utxoManager.getUTXOsForAmount({
    address: 'bc1p...',
    amount: 100000000n, // 1 BTC
    throwErrors: true,
});

const totalValue = utxos.reduce((sum, u) => sum + u.value, 0n);
console.log('Total value:', totalValue, 'sats');
```

### With Optimization

```typescript
// Optimize UTXO selection (consolidate small UTXOs)
const utxos = await utxoManager.getUTXOs({
    address: 'bc1p...',
    optimize: true,
});
```

### Without Pending UTXOs

```typescript
// Only get confirmed UTXOs (exclude pending)
const confirmedUtxos = await utxoManager.getUTXOs({
    address: 'bc1p...',
    mergePendingUTXOs: false,
});
```

### Track Spent UTXOs

```typescript
// After using UTXOs in a transaction, mark them spent and register new ones
utxoManager.spentUTXO('bc1p...', usedUtxos, newChangeUtxos);

// Later queries won't return spent UTXOs
const availableUtxos = await utxoManager.getUTXOs({
    address: 'bc1p...',
});

// Clear spent tracking when needed
utxoManager.clean();
```

---

## Integration with Contracts

### Use with Transaction Parameters

```typescript
// Get UTXOs for transaction
const utxos = await utxoManager.getUTXOsForAmount({
    address: wallet.p2tr,
    amount: estimatedCost,
    throwErrors: true,
});

// Simulate first
const simulation = await contract.transfer(recipient, amount, new Uint8Array(0));

if (simulation.revert) {
    throw new Error(`Transfer would fail: ${simulation.revert}`);
}

// Send with specific UTXOs
const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    feeRate: 10,
    network: network,
    maximumAllowedSatToSpend: 10000n,
    utxos: utxos, // Provide specific UTXOs
});

// Mark as spent and register new UTXOs
utxoManager.spentUTXO(wallet.p2tr, utxos, result.newUTXOs);
```

---

## UTXO Service Pattern

```typescript
class UTXOService {
    private manager: UTXOsManager;

    constructor(provider: AbstractRpcProvider) {
        this.manager = provider.utxoManager;
    }

    async getAvailable(address: string): Promise<UTXOs> {
        return this.manager.getUTXOs({
            address,
            mergePendingUTXOs: false,
        });
    }

    async getForAmount(
        address: string,
        amount: bigint
    ): Promise<UTXOs> {
        return this.manager.getUTXOsForAmount({
            address,
            amount,
            optimize: true,
        });
    }

    async getTotalBalance(address: string): Promise<bigint> {
        const utxos = await this.getAvailable(address);
        return utxos.reduce((sum, u) => sum + u.value, 0n);
    }

    markSpent(address: string, spent: UTXOs, newUTXOs: UTXOs): void {
        this.manager.spentUTXO(address, spent, newUTXOs);
    }

    clearCache(): void {
        this.manager.clean();
    }
}
```

---

## Best Practices

1. **Track Spent UTXOs**: Use `spentUTXO` to prevent double-spending attempts

2. **Use Optimization**: Enable `optimize` for better UTXO selection

3. **Clear Cache Periodically**: Call `clean()` when UTXOs are confirmed

4. **Handle Errors**: Use `throwErrors: true` for critical operations

5. **Exclude Pending**: Use `mergePendingUTXOs: false` for confirmed-only queries

---

## Next Steps

- [Provider API](./provider-api.md) - Provider methods
- [Contract API](./contract-api.md) - Contract interactions
- [Epoch API](./epoch-api.md) - Epoch operations

---

[← Previous: Contract API](./contract-api.md) | [Next: Epoch API →](./epoch-api.md)
