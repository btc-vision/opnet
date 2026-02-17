# OP20S ABI

This guide covers the OP20S pegged token standard ABI.

## Overview

OP20S extends OP20 with peg rate management capabilities. It allows designated authorities to maintain a peg rate for tokens that track external assets or prices.

---

## Import

```typescript
import {
    OP_20S_ABI,
    IOP20SContract,
    getContract,
} from 'opnet';
```

---

## Interface: IOP20SContract

IOP20SContract extends IOP20Contract with peg rate management methods.

### Peg Rate Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `pegRate()` | - | `bigint` | Get current peg rate |
| `pegAuthority()` | - | `Address` | Get peg authority address |
| `pegUpdatedAt()` | - | `bigint` | Get last update timestamp |
| `maxStaleness()` | - | `bigint` | Get maximum staleness period |
| `isStale()` | - | `boolean` | Check if peg rate is stale |
| `updatePegRate(newRate)` | `bigint` | - | Update peg rate (authority only) |
| `updateMaxStaleness(newStaleness)` | `bigint` | - | Update staleness threshold |
| `transferPegAuthority(newAuthority)` | `Address` | - | Start authority transfer |
| `acceptPegAuthority()` | - | - | Accept pending authority |
| `renouncePegAuthority()` | - | - | Renounce peg authority |

---

## Events

Inherits all OP20 events plus:

### PegRateUpdated

Emitted when the peg rate is updated.

```typescript
interface PegRateUpdatedEvent {
    oldRate: bigint;     // Previous peg rate
    newRate: bigint;     // New peg rate
    updatedAt: bigint;   // Update timestamp
}
```

### MaxStalenessUpdated

Emitted when the staleness threshold is updated.

```typescript
interface MaxStalenessUpdatedEvent {
    oldStaleness: bigint;    // Previous staleness threshold
    newStaleness: bigint;    // New staleness threshold
}
```

### PegAuthorityTransferStarted

Emitted when authority transfer is initiated.

```typescript
interface PegAuthorityTransferStartedEvent {
    currentAuthority: Address;
    pendingAuthority: Address;
}
```

### PegAuthorityTransferred

Emitted when authority transfer is completed.

```typescript
interface PegAuthorityTransferredEvent {
    previousAuthority: Address;
    newAuthority: Address;
}
```

### PegAuthorityRenounced

Emitted when authority is renounced.

```typescript
interface PegAuthorityRenouncedEvent {
    previousAuthority: Address;
}
```

---

## Usage Examples

### Create Contract Instance

```typescript
import { getContract, OP_20S_ABI, IOP20SContract } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const network = networks.regtest;
const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network });

const peggedToken = getContract<IOP20SContract>(
    'bc1p...token-address...',
    OP_20S_ABI,
    provider,
    network
);
```

### Check Peg Rate

```typescript
const rateResult = await peggedToken.pegRate();
console.log('Current peg rate:', rateResult.properties.rate);

const staleResult = await peggedToken.isStale();
console.log('Is stale:', staleResult.properties.stale);

const authorityResult = await peggedToken.pegAuthority();
console.log('Peg authority:', authorityResult.properties.authority.toHex());
```

### Update Peg Rate (Authority Only)

```typescript
const newRate = 100000000n; // New peg rate (e.g., 1:1 with 8 decimals)

const simulation = await peggedToken.updatePegRate(newRate);

if (simulation.revert) {
    throw new Error(`Update would fail: ${simulation.revert}`);
}

const result = await simulation.sendTransaction({
    signer: authorityWallet.keypair,
    mldsaSigner: authorityWallet.mldsaSigner,
    refundTo: authorityWallet.p2tr,
    maximumAllowedSatToSpend: 50000n,
    network: network,
    feeRate: 10,
});

console.log('Peg rate updated:', result.transactionId);
```

### Transfer Authority

```typescript
const newAuthority = Address.fromString('bc1p...new-authority...');

// Step 1: Initiate transfer (current authority)
const transferSimulation = await peggedToken.transferPegAuthority(newAuthority);
const transferResult = await transferSimulation.sendTransaction({
    signer: currentAuthorityWallet.keypair,
    mldsaSigner: currentAuthorityWallet.mldsaSigner,
    refundTo: currentAuthorityWallet.p2tr,
    maximumAllowedSatToSpend: 50000n,
    network: network,
    feeRate: 10,
});

// Step 2: Accept transfer (new authority)
const acceptSimulation = await peggedToken.acceptPegAuthority();
const acceptResult = await acceptSimulation.sendTransaction({
    signer: newAuthorityWallet.keypair,
    mldsaSigner: newAuthorityWallet.mldsaSigner,
    refundTo: newAuthorityWallet.p2tr,
    maximumAllowedSatToSpend: 50000n,
    network: network,
    feeRate: 10,
});

console.log('Authority transferred successfully');
```

### Check Staleness

```typescript
// Get staleness configuration
const stalenessResult = await peggedToken.maxStaleness();
const maxStaleness = stalenessResult.properties.staleness;

// Get last update time
const updatedAtResult = await peggedToken.pegUpdatedAt();
const lastUpdate = updatedAtResult.properties.updatedAt;

// Check if stale
const now = BigInt(Math.floor(Date.now() / 1000));
const isStale = (now - lastUpdate) > maxStaleness;

console.log('Max staleness:', maxStaleness, 'seconds');
console.log('Last updated:', new Date(Number(lastUpdate) * 1000));
console.log('Is stale:', isStale);
```

---

## Full ABI Structure

OP_20S_ABI includes all OP_20_ABI entries plus peg rate functions:

```typescript
export const OP_20S_ABI: BitcoinInterfaceAbi = [
    // All OP_20_ABI entries...
    ...OP_20_ABI,

    // Peg rate query
    {
        name: 'pegRate',
        constant: true,
        inputs: [],
        outputs: [{ name: 'rate', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },

    // Peg authority
    {
        name: 'pegAuthority',
        constant: true,
        inputs: [],
        outputs: [{ name: 'authority', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },

    // Last update time
    {
        name: 'pegUpdatedAt',
        constant: true,
        inputs: [],
        outputs: [{ name: 'updatedAt', type: ABIDataTypes.UINT64 }],
        type: BitcoinAbiTypes.Function,
    },

    // Max staleness
    {
        name: 'maxStaleness',
        constant: true,
        inputs: [],
        outputs: [{ name: 'staleness', type: ABIDataTypes.UINT64 }],
        type: BitcoinAbiTypes.Function,
    },

    // Staleness check
    {
        name: 'isStale',
        constant: true,
        inputs: [],
        outputs: [{ name: 'stale', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },

    // Update peg rate
    {
        name: 'updatePegRate',
        inputs: [{ name: 'newRate', type: ABIDataTypes.UINT256 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    // Update max staleness
    {
        name: 'updateMaxStaleness',
        inputs: [{ name: 'newStaleness', type: ABIDataTypes.UINT64 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    // Authority management
    {
        name: 'transferPegAuthority',
        inputs: [{ name: 'newAuthority', type: ABIDataTypes.ADDRESS }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'acceptPegAuthority',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'renouncePegAuthority',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    // Events
    {
        name: 'PegRateUpdated',
        values: [
            { name: 'oldRate', type: ABIDataTypes.UINT256 },
            { name: 'newRate', type: ABIDataTypes.UINT256 },
            { name: 'updatedAt', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'MaxStalenessUpdated',
        values: [
            { name: 'oldStaleness', type: ABIDataTypes.UINT64 },
            { name: 'newStaleness', type: ABIDataTypes.UINT64 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PegAuthorityTransferStarted',
        values: [
            { name: 'currentAuthority', type: ABIDataTypes.ADDRESS },
            { name: 'pendingAuthority', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PegAuthorityTransferred',
        values: [
            { name: 'previousAuthority', type: ABIDataTypes.ADDRESS },
            { name: 'newAuthority', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'PegAuthorityRenounced',
        values: [
            { name: 'previousAuthority', type: ABIDataTypes.ADDRESS },
        ],
        type: BitcoinAbiTypes.Event,
    },
];
```

---

## Best Practices

1. **Monitor Staleness**: Check `isStale()` before relying on peg rate

2. **Regular Updates**: Keep peg rate updated to avoid staleness

3. **Secure Authority Key**: Protect the peg authority private key

4. **Two-Step Transfer**: Authority transfers require both initiation and acceptance

5. **Audit Updates**: Log all peg rate updates for transparency

---

## Next Steps

- [OP20 ABI](./op20-abi.md) - Base token standard
- [OP721 ABI](./op721-abi.md) - NFT standard
- [Stablecoin ABIs](./stablecoin-abis.md) - Oracle and pegged coins

---

[← Previous: OP20 ABI](./op20-abi.md) | [Next: OP721 ABI →](./op721-abi.md)
