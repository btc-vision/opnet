# UTXOsManager Class Documentation

The `UTXOsManager` class is a utility for managing Unspent Transaction Outputs (
UTXOs) in a Bitcoin environment. It provides methods to fetch, track, and manage
UTXOs associated with a specific Bitcoin address. This documentation will guide
you through using the `UTXOsManager` class effectively.

---

## Table of Contents

- [Overview](#overview)
- [Accessing UTXOsManager](#accessing-utxosmanager)
- [Constructor](#constructor)
- [Public Methods](#public-methods)
  - [spentUTXO](#spentutxo)
  - [clean](#clean)
  - [getUTXOs](#getutxos)
  - [getUTXOsForAmount](#getutxosforamount)
- [Usage Examples with All Optional Properties](#usage-examples-with-all-optional-properties)
  - [Fetching All UTXOs with Optional Properties](#fetching-all-utxos-with-optional-properties)
  - [Fetching UTXOs for a Specific Amount with Optional Properties](#fetching-utxos-for-a-specific-amount-with-optional-properties)
  - [Marking UTXOs as Spent with Detailed Example](#marking-utxos-as-spent-with-detailed-example)
  - [Resetting UTXOs State](#resetting-utxos-state)
- [Additional Examples](#additional-examples)
  - [Fetching UTXOs with Optimizations Enabled](#fetching-utxos-with-optimizations-enabled)
  - [Fetching UTXOs for Amount with Optimizations Disabled](#fetching-utxos-for-amount-with-optimizations-disabled)
  - [Handling Insufficient UTXOs Error](#handling-insufficient-utxos-error)
  - [Fetching UTXOs Including Spent and Pending UTXOs](#fetching-utxos-including-spent-and-pending-utxos)
  - [Fetching UTXOs Excluding Pending UTXOs](#fetching-utxos-excluding-pending-utxos)
- [Understanding Optional Properties](#understanding-optional-properties)
- [Notes](#notes)

---

## Overview

The `UTXOsManager` class helps you manage UTXOs for Bitcoin transactions. It
interacts with a JSON-RPC provider to fetch UTXO data and maintains an internal
state of spent and pending UTXOs to ensure accurate transaction building.

## Accessing UTXOsManager

The `UTXOsManager` is accessible via an instance of `AbstractProvider` or any
class that extends it, such as `JSONProvider`. You can access it using:

```typescript
const provider = new JSONProvider(/* provider configuration */);
const utxosManager = provider.utxoManager;
```

## Constructor

The `UTXOsManager` is typically instantiated internally by the provider.
However, if you need to create an instance manually, you can do so by passing an
`AbstractRpcProvider`:

```typescript
const utxosManager = new UTXOsManager(provider);
```

- **Parameters:**
  - `provider` (`AbstractRpcProvider`): The RPC provider used to fetch UTXO
    data.

## Public Methods

### spentUTXO

```typescript
spentUTXO(spent: UTXOs, newUTXOs: UTXOs): void
```

Marks specified UTXOs as spent and tracks new UTXOs created by a transaction.

- **Parameters:**
  - `spent` (`UTXOs`): An array of UTXOs that have been spent.
  - `newUTXOs` (`UTXOs`): An array of new UTXOs created by the transaction.

- **Usage:**
  - Call this method after broadcasting a transaction to update the internal
    state of the `UTXOsManager`.

### clean

```typescript
clean(): void
```

Resets the internal state by clearing the spent and pending UTXOs. This is
useful after completing a set of transactions or when you need to refresh the
UTXOs state.

- **Usage:**
  - Use this method to reset the `UTXOsManager`'s state before starting new
    transactions.

### getUTXOs

```typescript
async getUTXOs(options: RequestUTXOsParams): Promise<UTXOs>
```

Fetches UTXOs for a given address with configurable options.

- **Parameters (`RequestUTXOsParams`):**
  - `address` (`string`): The Bitcoin address to fetch UTXOs for.
  - `optimize` (`boolean`, optional): Whether to optimize UTXOs by removing
    dust (small UTXOs). Defaults to `true`.
  - `mergePendingUTXOs` (`boolean`, optional): Whether to include pending UTXOs.
    Defaults to `true`.
  - `filterSpentUTXOs` (`boolean`, optional): Whether to exclude already spent
    UTXOs. Defaults to `true`.

- **Returns:**
  - `Promise<UTXOs>`: A promise that resolves to an array of UTXOs.

- **Usage:**
  - Use this method to retrieve all available UTXOs for an address, considering
    the specified options.

### getUTXOsForAmount

```typescript
async getUTXOsForAmount(options: RequestUTXOsParamsWithAmount): Promise<UTXOs>
```

Fetches UTXOs sufficient to cover a specific amount.

- **Parameters (`RequestUTXOsParamsWithAmount`):**
  - `address` (`string`): The Bitcoin address to fetch UTXOs for.
  - `amount` (`bigint`): The minimum total value of UTXOs required.
  - `optimize` (`boolean`, optional): Whether to optimize UTXOs by removing
    dust. Defaults to `true`.
  - `mergePendingUTXOs` (`boolean`, optional): Whether to include pending UTXOs.
    Defaults to `true`.
  - `filterSpentUTXOs` (`boolean`, optional): Whether to exclude already spent
    UTXOs. Defaults to `true`.

- **Returns:**
  - `Promise<UTXOs>`: A promise that resolves to an array of UTXOs sufficient to
    cover the specified amount.

- **Throws:**
  - `Error`: If there are insufficient UTXOs to cover the amount.

- **Usage:**
  - Use this method when you need UTXOs that collectively meet or exceed a
    specific amount for a transaction.

---

## Usage Examples with All Optional Properties

Make sure to clean the utxo manager everytime you are done with building
transactions! Otherwise, you might end up with unexpected results like utxo
conflicts.

### Fetching All UTXOs with Optional Properties

```typescript
const address = 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes';

// Fetch UTXOs with all optional properties specified
const utxos = await provider.utxoManager.getUTXOs({
  address,
  optimize: false,            // Do not optimize UTXOs (include small UTXOs)
  mergePendingUTXOs: false,   // Do not include pending UTXOs
  filterSpentUTXOs: false,    // Do not filter out spent UTXOs
});

console.log('Available UTXOs with all options specified:', utxos);
```

- **Explanation:**
  - **`optimize: false`**: Includes all UTXOs, even small ones (dust), without
    optimization.
  - **`mergePendingUTXOs: false`**: Excludes pending UTXOs from the result.
  - **`filterSpentUTXOs: false`**: Includes UTXOs that have been marked as
    spent.

---

### Fetching UTXOs for a Specific Amount with Optional Properties

```typescript
const address = 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes';
const amountNeeded = 100_000n; // Amount in satoshis (e.g., 0.001 BTC)

try {
  // Fetch UTXOs covering the amount with all optional properties specified
  const utxos = await provider.utxoManager.getUTXOsForAmount({
    address,
    amount: amountNeeded,
    optimize: false,            // Do not optimize UTXOs
    mergePendingUTXOs: false,   // Exclude pending UTXOs
    filterSpentUTXOs: false,    // Include spent UTXOs
  });

  console.log('UTXOs covering the amount with all options specified:', utxos);
} catch (error) {
  console.error('Error fetching UTXOs for amount:', error.message);
}
```

- **Explanation:**
  - **`optimize: false`**: Fetches UTXOs without optimization.
  - **`mergePendingUTXOs: false`**: Does not include pending UTXOs.
  - **`filterSpentUTXOs: false`**: Does not filter out UTXOs that are marked as
    spent.

---

### Marking UTXOs as Spent with Detailed Example

```typescript
// Example UTXOs that have been spent
const spentUtxos = [
  new UTXO({
    transactionId: 'abcd1234...',
    outputIndex: 0,
    value: 50_000n, // Amount in satoshis
    address: 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes',
    ...
  }),
];

// Example new UTXOs created by the transaction
const newUtxos = [
  new UTXO({
    transactionId: 'efgh5678...',
    outputIndex: 1,
    value: 45_000n,
    address: 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes',
    ...
  }),
];

provider.utxoManager.spentUTXO(spentUtxos, newUtxos);

console.log('UTXOs updated after spending. Spent UTXOs and new UTXOs have been recorded.');
```

- **Explanation:**
  - Provides specific UTXO instances for both spent and new UTXOs.
  - Updates the `UTXOsManager` internal state to reflect these changes.

---

### Resetting UTXOs State

```typescript
// Before resetting, you might want to log the current state
console.log('Current spent UTXOs:', provider.utxoManager.spentUTXOs);
console.log('Current pending UTXOs:', provider.utxoManager.pendingUTXOs);

// Reset the UTXOsManager state
provider.utxoManager.clean();

console.log('UTXOsManager state has been reset.');
console.log('Spent UTXOs after reset:', provider.utxoManager.spentUTXOs);
console.log('Pending UTXOs after reset:', provider.utxoManager.pendingUTXOs);
```

- **Explanation:**
  - Logs the internal state before and after calling `clean()` to demonstrate
    the effect.
  - Useful for ensuring that the internal state is cleared as expected.

---

## Additional Examples

### Fetching UTXOs with Optimizations Enabled

```typescript
const address = 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes';

// Fetch UTXOs with optimizations enabled
const utxos = await provider.utxoManager.getUTXOs({
  address,
  optimize: true,             // Optimize UTXOs (exclude small UTXOs)
  mergePendingUTXOs: true,    // Include pending UTXOs
  filterSpentUTXOs: true,     // Filter out spent UTXOs
});

console.log('Optimized UTXOs:', utxos);
```

- **Explanation:**
  - All optional properties are set to `true`, which are also the default
    values.
  - Fetches UTXOs that are optimized, include pending UTXOs, and exclude spent
    UTXOs.

---

### Fetching UTXOs for Amount with Optimizations Disabled

```typescript
const address = 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes';
const amountNeeded = 50_000n; // Amount in satoshis

try {
  // Fetch UTXOs covering the amount without optimizations
  const utxos = await provider.utxoManager.getUTXOsForAmount({
    address,
    amount: amountNeeded,
    optimize: false,            // Do not optimize UTXOs
    mergePendingUTXOs: true,    // Include pending UTXOs
    filterSpentUTXOs: true,     // Filter out spent UTXOs
  });

  console.log('UTXOs covering the amount without optimizations:', utxos);
} catch (error) {
  console.error('Error fetching UTXOs for amount:', error.message);
}
```

- **Explanation:**
  - Disables optimization to include all UTXOs regardless of size.
  - Includes pending UTXOs and filters out spent UTXOs.

---

### Handling Insufficient UTXOs Error

```typescript
const address = 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes';
const amountNeeded = 100_000_000_000n; // An amount larger than what is available

try {
  // Attempt to fetch UTXOs for an amount that exceeds available UTXOs
  const utxos = await provider.utxoManager.getUTXOsForAmount({
    address,
    amount: amountNeeded,
    optimize: true,
    mergePendingUTXOs: true,
    filterSpentUTXOs: true,
  });

  console.log('UTXOs covering the amount:', utxos);
} catch (error) {
  console.error('Error:', error.message);
}
```

- **Expected Output:**
  -
  `Error: Insufficient UTXOs to cover amount. Available: X, Needed: 100000000000`
- **Explanation:**
  - Demonstrates how to handle the error when there are not enough UTXOs to
    cover the specified amount.

---

### Fetching UTXOs Including Spent and Pending UTXOs

```typescript
const address = 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes';

// Fetch UTXOs including spent and pending UTXOs
const utxos = await provider.utxoManager.getUTXOs({
  address,
  optimize: true,
  mergePendingUTXOs: true,
  filterSpentUTXOs: false,    // Include spent UTXOs
});

console.log('UTXOs including spent UTXOs:', utxos);
```

- **Explanation:**
  - By setting `filterSpentUTXOs: false`, the result includes UTXOs that have
    been marked as spent in the internal state.
  - Useful for debugging or when you need to see all UTXOs regardless of their
    status.

---

### Fetching UTXOs Excluding Pending UTXOs

```typescript
const address = 'bcrt1qfqsr3m7vjxheghcvw4ks0fryqxfq8qzjf8fxes';

// Fetch UTXOs excluding pending UTXOs
const utxos = await provider.utxoManager.getUTXOs({
  address,
  optimize: true,
  mergePendingUTXOs: false,   // Exclude pending UTXOs
  filterSpentUTXOs: true,
});

console.log('UTXOs excluding pending UTXOs:', utxos);
```

- **Explanation:**
  - By setting `mergePendingUTXOs: false`, the result excludes any UTXOs that
    are pending (e.g., in unconfirmed transactions).
  - Useful when you need to ensure that only confirmed UTXOs are used.

---

## Understanding Optional Properties

- **`optimize` (`boolean`):**
  - **`true`**: Excludes small UTXOs (dust) to optimize transaction building.
  - **`false`**: Includes all UTXOs regardless of size.

- **`mergePendingUTXOs` (`boolean`):**
  - **`true`**: Includes UTXOs that are pending confirmation (e.g., from
    unconfirmed transactions).
  - **`false`**: Excludes pending UTXOs, using only confirmed ones.

- **`filterSpentUTXOs` (`boolean`):**
  - **`true`**: Excludes UTXOs that have been marked as spent in the
    `UTXOsManager`'s internal state.
  - **`false`**: Includes UTXOs regardless of whether they are marked as spent.
