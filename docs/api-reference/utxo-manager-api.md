# UTXO Manager API Reference

Complete API reference for UTXO management.

## UTXOsManager Class

Manages UTXO tracking and retrieval for transaction building.

### Constructor

```typescript
new UTXOsManager(provider: AbstractRpcProvider)
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
    address: string;              // Bitcoin address
    optimize?: boolean;           // Optimize UTXO selection
    throwOnError?: boolean;       // Throw on errors
    ensureConfirmed?: boolean;    // Only confirmed UTXOs
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
    amount: bigint;               // Amount to cover
    feeRate?: number;             // Fee rate for estimation
}
```

### spentUTXO

Mark UTXOs as spent (for tracking).

```typescript
spentUTXO(utxos: UTXO | UTXO[]): void
```

### clean

Clear the spent UTXO tracking cache.

```typescript
clean(): void
```

---

## UTXO Interface

```typescript
interface UTXO {
    transactionId: string;        // Transaction ID
    outputIndex: number;          // Output index
    value: bigint;                // Value in satoshis
    scriptPubKey: {
        hex: string;              // Script hex
        address?: string;         // Decoded address
    };
    confirmations?: number;       // Confirmation count
    raw?: string;                 // Raw transaction hex
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

const provider = new JSONRpcProvider(url, network);
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
    feeRate: 10,
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

### Confirmed Only

```typescript
// Only get confirmed UTXOs
const confirmedUtxos = await utxoManager.getUTXOs({
    address: 'bc1p...',
    ensureConfirmed: true,
});
```

### Track Spent UTXOs

```typescript
// After using UTXOs in a transaction
utxoManager.spentUTXO(usedUtxos);

// Later queries won't return these UTXOs
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
    feeRate: 10,
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

// Mark as spent
utxoManager.spentUTXO(utxos);
```

---

## UTXO Service Pattern

```typescript
class UTXOService {
    private manager: UTXOsManager;

    constructor(provider: AbstractRpcProvider) {
        this.manager = new UTXOsManager(provider);
    }

    async getAvailable(address: string): Promise<UTXOs> {
        return this.manager.getUTXOs({
            address,
            ensureConfirmed: true,
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

    markSpent(utxos: UTXOs): void {
        this.manager.spentUTXO(utxos);
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

4. **Handle Errors**: Use `throwOnError: true` for critical operations

5. **Prefer Confirmed**: Use `ensureConfirmed` for important transactions

---

## Next Steps

- [Provider API](./provider-api.md) - Provider methods
- [Contract API](./contract-api.md) - Contract interactions
- [Epoch API](./epoch-api.md) - Epoch operations

---

[← Previous: Contract API](./contract-api.md) | [Next: Epoch API →](./epoch-api.md)
