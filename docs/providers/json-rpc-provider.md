# JSON-RPC Provider

The `JSONRpcProvider` is the primary way to communicate with OPNet nodes using HTTP-based JSON-RPC protocol.

## Table of Contents

- [Overview](#overview)
- [Setting Up HTTP Connections](#setting-up-http-connections)
- [Constructor Parameters](#constructor-parameters)
- [Network Configuration](#network-configuration)
- [REST API vs JSON-RPC Mode](#rest-api-vs-json-rpc-mode)
- [Threaded Parsing](#threaded-parsing)
- [Threaded HTTP](#threaded-http)
- [Complete Configuration Example](#complete-configuration-example)
- [Provider Methods](#provider-methods)
  - [Block Methods](#block-methods)
  - [Transaction Methods](#transaction-methods)
  - [Contract Methods](#contract-methods)
  - [Balance Methods](#balance-methods)
  - [Public Key Methods](#public-key-methods)
  - [Epoch Methods](#epoch-methods)
- [UTXO Manager](#utxo-manager)
- [Error Handling](#error-handling)
- [Resource Cleanup](#resource-cleanup)
- [Best Practices](#best-practices)

---

## Overview

```mermaid
sequenceDiagram
    participant App as Your App
    participant Provider as JSONRpcProvider
    participant Node as OPNet Node

    App->>Provider: method call
    Provider->>Provider: Build JSON-RPC payload
    Provider->>Node: HTTP POST
    Node->>Node: Process request
    Node-->>Provider: JSON response
    Provider->>Provider: Parse response
    Provider-->>App: Typed result
```

---

## Setting Up HTTP Connections

### Basic Setup

```typescript
import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider(
    'https://regtest.opnet.org',
    networks.regtest
);
```

### With Custom Timeout

```typescript
const provider = new JSONRpcProvider(
    'https://regtest.opnet.org',
    networks.regtest,
    30_000  // 30 second timeout
);
```

---

## Constructor Parameters

```typescript
constructor(
    url: string,
    network: Network,
    timeout?: number,
    fetcherConfigurations?: Agent.Options,
    useRESTAPI?: boolean,
    useThreadedParsing?: boolean,
    useThreadedHttp?: boolean
)
```

### Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | `string` | *required* | RPC endpoint URL |
| `network` | `Network` | *required* | Bitcoin network (mainnet/testnet/regtest) |
| `timeout` | `number` | `20000` | Request timeout in milliseconds |
| `fetcherConfigurations` | `Agent.Options` | *see below* | HTTP agent configuration |
| `useRESTAPI` | `boolean` | `true` | Use REST API format for requests |
| `useThreadedParsing` | `boolean` | `true` | Parse responses in worker thread |
| `useThreadedHttp` | `boolean` | `true` | Perform entire HTTP request in worker thread |

### Default Fetcher Configuration

```typescript
{
    keepAliveTimeout: 30_000,        // Socket keep-alive duration
    keepAliveTimeoutThreshold: 30_000, // Keep-alive threshold
    connections: 128,                 // Max connections per server
    pipelining: 2,                   // Max pipelined requests
}
```

---

## Network Configuration

### Available Networks

```typescript
import { networks } from '@btc-vision/bitcoin';

// Production
const mainnetProvider = new JSONRpcProvider(
    'https://mainnet.opnet.org',
    networks.bitcoin
);

// Development
const regtestProvider = new JSONRpcProvider(
    'https://regtest.opnet.org',
    networks.regtest
);
```

### Network URLs

| Network | URL | Description |
|---------|-----|-------------|
| Mainnet | `https://mainnet.opnet.org` | Production network |
| Regtest | `https://regtest.opnet.org` | Development/regression testing |

---

## REST API vs JSON-RPC Mode

The provider can operate in two modes:

### REST API Mode (Default)

Automatically formats the URL to use the REST API endpoint:

```typescript
const provider = new JSONRpcProvider(
    'https://regtest.opnet.org',
    networks.regtest,
    20_000,
    undefined,
    true  // useRESTAPI = true (default)
);

// URL becomes: https://regtest.opnet.org/api/v1/json-rpc
```

### Pure JSON-RPC Mode

```typescript
// Explicitly disable REST API mode (default is true)
const provider: JSONRpcProvider = new JSONRpcProvider(
    'https://regtest.opnet.org',
    networks.regtest,
    20_000,
    undefined,
    false  // useRESTAPI = false (disabling default)
);
```

### Switching Modes at Runtime

```typescript
// Start in REST mode
const provider = new JSONRpcProvider(url, network);

// Switch to pure JSON-RPC
provider.setFetchMode(false);

// Switch back to REST
provider.setFetchMode(true);
```

---

## Threaded Parsing

For large responses, the provider can parse JSON in a worker thread to avoid blocking the main thread:

```typescript
// Enable threaded parsing (default)
const provider = new JSONRpcProvider(
    url,
    network,
    20_000,
    undefined,
    true,
    true  // useThreadedParsing = true
);

// Disable for small responses or debugging
const provider = new JSONRpcProvider(
    url,
    network,
    20_000,
    undefined,
    true,
    false  // useThreadedParsing = false
);
```

**When to use threaded parsing:**
- Processing large block data
- Fetching many transactions at once
- Production environments

**When to disable:**
- Debugging
- Small responses
- Environments without worker support

---

## Threaded HTTP

Beyond threaded parsing, the provider can offload the **entire HTTP request** (network I/O + JSON parsing) to a worker thread, completely freeing the main thread:

```typescript
// Enable threaded HTTP (default)
const provider = new JSONRpcProvider(
    url,
    network,
    20_000,
    undefined,
    true,
    true,
    true  // useThreadedHttp = true
);

// Disable threaded HTTP (uses main thread for HTTP, optional threaded parsing)
const provider = new JSONRpcProvider(
    url,
    network,
    20_000,
    undefined,
    true,
    true,
    false  // useThreadedHttp = false
);
```

**How it works:**

```mermaid
sequenceDiagram
    participant Main as Main Thread
    participant Worker as Worker Thread
    participant Node as OPNet Node

    Main->>Worker: fetch request
    Worker->>Node: HTTP POST
    Node-->>Worker: JSON response
    Worker->>Worker: JSON.parse()
    Worker-->>Main: Parsed result
```

**When to use threaded HTTP:**
- High-frequency RPC calls
- Real-time applications where main thread responsiveness is critical
- Browser environments to prevent UI blocking
- Production environments

**When to disable:**
- Debugging network issues
- Service worker contexts (automatic fallback provided)
- When you need fine-grained control over HTTP requests

For detailed documentation on the threading system, see [Threaded HTTP](./threaded-http.md).

---

## Complete Configuration Example

```typescript
import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider(
    'https://regtest.opnet.org',     // RPC URL
    networks.regtest,                 // Network
    30_000,                          // 30s timeout
    {
        keepAliveTimeout: 60_000,    // 60s keep-alive
        connections: 256,            // More connections
        pipelining: 4,               // More pipelining
    },
    true,                            // Use REST API
    true,                            // Use threaded parsing
    true                             // Use threaded HTTP
);

async function main() {
    // Use the provider
    const block = await provider.getBlockNumber();
    console.log('Current block:', block);

    // Always close when done
    await provider.close();
}

main();
```

---

## Provider Methods

### Block Methods

```typescript
// Get latest block number
const height = await provider.getBlockNumber();

// Get block by number
const block = await provider.getBlock(12345, true);  // prefetch txs

// Get block by hash
const blockByHash = await provider.getBlockByHash('0x...');

// Get block by checksum
const blockByChecksum = await provider.getBlockByChecksum('0x...');

// Get multiple blocks
const blocks = await provider.getBlocks([1, 2, 3, 4, 5]);

// Get gas parameters
const gasParams = await provider.gasParameters();
```

### Transaction Methods

```typescript
// Get transaction by hash
const tx = await provider.getTransaction('txHash');

// Get transaction receipt
const receipt = await provider.getTransactionReceipt('txHash');

// Broadcast transaction
const result = await provider.sendRawTransaction(rawTx, psbt);

// Broadcast multiple transactions
const results = await provider.sendRawTransactions([
    { tx: rawTx1, psbt: psbt1 },
    { tx: rawTx2, psbt: psbt2 },
]);
```

### Contract Methods

```typescript
// Call contract (simulation)
const result = await provider.call(
    contractAddress,    // Contract to call
    calldata,          // Encoded function call
    senderAddress,     // Optional sender
    blockHeight,       // Optional block height
    simulatedTx,       // Optional simulated transaction
    accessList         // Optional access list
);

// Get contract code
const code = await provider.getCode(contractAddress, false);

// Get storage value
const storage = await provider.getStorageAt(
    contractAddress,
    storagePointer,
    true,              // Include proofs
    blockHeight        // Optional block height
);
```

### Balance Methods

```typescript
// Get single balance
const balance = await provider.getBalance(
    'bc1q...',
    true  // Filter out ordinals
);

// Get multiple balances
const balances = await provider.getBalances(
    ['bc1q...', 'bc1p...'],
    true  // Filter ordinals
);
```

### Public Key Methods

```typescript
// Get public key info
const address = await provider.getPublicKeyInfo(
    'bc1q...',
    false  // Not a contract
);

// Get multiple public keys
const keys = await provider.getPublicKeysInfo(
    ['bc1q...', 'bc1p...'],
    false
);

// Validate address
const type = provider.validateAddress('bc1q...', network);
```

### Epoch Methods

```typescript
// Get latest epoch
const epoch = await provider.getLatestEpoch(true);  // Include submissions

// Get epoch by number
const epochByNum = await provider.getEpochByNumber(42n);

// Get epoch by hash
const epochByHash = await provider.getEpochByHash('0x...');

// Get mining template
const template = await provider.getEpochTemplate();

// Submit epoch solution
const submitted = await provider.submitEpoch({
    solution: solutionBuffer,
    salt: saltBuffer,
    graffiti: graffitiBuffer,
});
```

---

## UTXO Manager

Access the UTXO manager through the provider:

```typescript
// Get UTXOs for address
const utxos = await provider.utxoManager.getUTXOs({
    address: 'bc1q...',
    optimize: true,
    mergePendingUTXOs: true,
    filterSpentUTXOs: true,
});

// Get UTXOs for a specific amount
const utxosForAmount = await provider.utxoManager.getUTXOsForAmount({
    address: 'bc1q...',
    amount: 100000n,
});
```

---

## Error Handling

```typescript
import { JSONRpcProvider, OPNetError } from 'opnet';

const provider = new JSONRpcProvider(url, network);

try {
    const block = await provider.getBlock(999999999);
} catch (error) {
    if (error instanceof OPNetError) {
        console.error('OPNet error:', error.message);
        console.error('Error code:', error.code);
    } else {
        console.error('Network error:', error);
    }
}
```

---

## Resource Cleanup

Always close the provider when done:

```typescript
const provider = new JSONRpcProvider(url, network);

try {
    // Use provider...
} finally {
    await provider.close();
}
```

---

## Best Practices

1. **Reuse Providers**: Create one provider instance and reuse it

2. **Set Appropriate Timeouts**: Increase timeout for slow networks or complex operations

3. **Enable Threaded Parsing**: For production with large responses

4. **Close Connections**: Always call `close()` when done

5. **Handle Errors**: Wrap calls in try/catch for proper error handling

```typescript
// Production configuration
const provider = new JSONRpcProvider(
    'https://mainnet.opnet.org',
    networks.bitcoin,
    60_000,  // Longer timeout for mainnet
    {
        connections: 256,
        pipelining: 4,
    },
    true,   // REST API
    true,   // Threaded parsing
    true    // Threaded HTTP
);
```

---

## Next Steps

- [WebSocket Provider](./websocket-provider.md) - Real-time subscriptions
- [Threaded HTTP](./threaded-http.md) - Deep dive into worker thread HTTP
- [Internal Caching](./internal-caching.md) - Provider caching behavior
- [Advanced Configuration](./advanced-configuration.md) - Error handling and retry logic

---

[← Previous: Understanding Providers](./understanding-providers.md) | [Next: WebSocket Provider →](./websocket-provider.md)
