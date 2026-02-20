# WebSocket Provider

The `WebSocketRpcProvider` enables real-time communication with OPNet nodes through persistent WebSocket connections, supporting subscriptions for new blocks and epochs.

## Overview

```mermaid
sequenceDiagram
    participant App as Your App
    participant Provider as WebSocketRpcProvider
    participant Node as OPNet Node

    App->>Provider: connect()
    Provider->>Node: WebSocket handshake
    Node-->>Provider: Connected

    App->>Provider: subscribeBlocks()
    Provider->>Node: Subscribe request
    Node-->>Provider: Subscription confirmed

    loop On New Block
        Node->>Provider: Block notification
        Provider->>App: Callback with block data
    end

    App->>Provider: disconnect()
    Provider->>Node: Close connection
```

---

## Basic Setup

```typescript
import { WebSocketRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new WebSocketRpcProvider({
    url: 'wss://regtest.opnet.org/ws',
    network: networks.regtest,
});

// Wait for connection
await provider.connect();

console.log('Connected to OPNet!');
```

---

## Real-Time Subscriptions

### Block Notifications

Subscribe to receive notifications when new blocks are mined. The `subscribeBlocks` method returns `Promise<void>` (not an unsubscribe function). To unsubscribe, use `provider.unsubscribe(SubscriptionType.BLOCKS)`.

```typescript
import { SubscriptionType } from 'opnet';

// Subscribe to new blocks
await provider.subscribeBlocks((block) => {
    console.log('New block!');
    console.log('  Block number:', block.blockNumber);
    console.log('  Hash:', block.blockHash);
    console.log('  Timestamp:', block.timestamp);
    console.log('  TX count:', block.txCount);
});

// Later, unsubscribe
await provider.unsubscribe(SubscriptionType.BLOCKS);
```

### Epoch Notifications

Subscribe to epoch updates for mining. Like block subscriptions, `subscribeEpochs` returns `Promise<void>`.

```typescript
import { SubscriptionType } from 'opnet';

// Subscribe to epoch updates
await provider.subscribeEpochs((epoch) => {
    console.log('Epoch update!');
    console.log('  Epoch number:', epoch.epochNumber);
    console.log('  Epoch hash:', epoch.epochHash);
});

// Unsubscribe when done
await provider.unsubscribe(SubscriptionType.EPOCHS);
```

---

## Event Handlers

The WebSocket provider emits various events you can listen to:

```typescript
import { WebSocketClientEvent } from 'opnet';

// Connection opened
provider.on(WebSocketClientEvent.CONNECTED, () => {
    console.log('WebSocket connected');
});

// Connection closed
provider.on(WebSocketClientEvent.DISCONNECTED, () => {
    console.log('WebSocket disconnected');
});

// Error occurred
provider.on(WebSocketClientEvent.ERROR, (error) => {
    console.error('WebSocket error:', error);
});

// Block received
provider.on(WebSocketClientEvent.BLOCK, (block) => {
    console.log('Block via event:', block.blockNumber);
});

// Epoch received
provider.on(WebSocketClientEvent.EPOCH, (epoch) => {
    console.log('Epoch via event:', epoch.epochNumber);
});
```

---

## Connection Management

### Connection States

```typescript
import { ConnectionState } from 'opnet';

// Check connection state
const state = provider.getState();

switch (state) {
    case ConnectionState.DISCONNECTED:
        console.log('Not connected');
        break;
    case ConnectionState.CONNECTING:
        console.log('Connecting...');
        break;
    case ConnectionState.CONNECTED:
        console.log('Connected');
        break;
    case ConnectionState.HANDSHAKING:
        console.log('Handshaking...');
        break;
    case ConnectionState.READY:
        console.log('Ready');
        break;
    case ConnectionState.RECONNECTING:
        console.log('Reconnecting...');
        break;
    case ConnectionState.CLOSING:
        console.log('Closing...');
        break;
}
```

### Manual Connection Control

```typescript
// Connect
await provider.connect();

// Disconnect
provider.disconnect();
```

### Automatic Reconnection

The provider automatically attempts to reconnect on connection loss:

```typescript
const provider = new WebSocketRpcProvider({
    url,
    network,
    websocketConfig: {
        maxReconnectAttempts: 10,    // Max reconnection attempts (default: 10)
        reconnectBaseDelay: 1000,    // Base delay between attempts in ms (default: 1000)
        autoReconnect: true,         // Enable auto-reconnect
    },
});
```

---

## Configuration Options

### WebSocketClientConfig

```typescript
interface WebSocketClientConfig {
    // Connection settings
    url?: string;                       // WebSocket URL
    connectTimeout?: number;            // Connection timeout (default: 10000ms)
    handshakeTimeout?: number;          // Handshake timeout

    // Reconnection settings
    maxReconnectAttempts?: number;       // Default: 10
    reconnectBaseDelay?: number;         // Default: 1000ms
    reconnectMaxDelay?: number;          // Max delay between reconnect attempts
    autoReconnect?: boolean;             // Default: true

    // Request settings
    requestTimeout?: number;             // Default: 30000ms
    maxPendingRequests?: number;         // Max pending requests

    // Heartbeat
    pingInterval?: number;               // Default: 30000ms
}
```

### Complete Configuration Example

```typescript
import { WebSocketRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new WebSocketRpcProvider({
    url: 'wss://regtest.opnet.org/ws',
    network: networks.regtest,
    websocketConfig: {
        maxReconnectAttempts: 10,
        reconnectBaseDelay: 1000,
        autoReconnect: true,
        connectTimeout: 15000,
        requestTimeout: 60000,
        pingInterval: 20000,
    },
});

await provider.connect();
```

---

## Making RPC Calls

The WebSocket provider supports all the same RPC methods as the JSON-RPC provider:

```typescript
// Block operations
const height = await provider.getBlockNumber();
const block = await provider.getBlock(height);

// Transaction operations
const tx = await provider.getTransaction('txHash');
const receipt = await provider.getTransactionReceipt('txHash');

// Contract operations
const result = await provider.call(contractAddress, calldata);

// Balance operations
const balance = await provider.getBalance('bc1q...');
```

---

## Complete Example

```typescript
import {
    WebSocketRpcProvider,
    WebSocketClientEvent,
    SubscriptionType,
} from 'opnet';
import { networks } from '@btc-vision/bitcoin';

async function main() {
    const provider = new WebSocketRpcProvider({
        url: 'wss://regtest.opnet.org/ws',
        network: networks.regtest,
        websocketConfig: {
            autoReconnect: true,
            maxReconnectAttempts: 10,
        },
    });

    // Set up event handlers
    provider.on(WebSocketClientEvent.CONNECTED, () => {
        console.log('Connected!');
    });

    provider.on(WebSocketClientEvent.DISCONNECTED, () => {
        console.log('Disconnected');
    });

    provider.on(WebSocketClientEvent.ERROR, (error) => {
        console.error('Error:', error);
    });

    // Connect
    await provider.connect();

    // Get current state
    const height = await provider.getBlockNumber();
    console.log('Current block:', height);

    // Subscribe to new blocks
    await provider.subscribeBlocks((block) => {
        console.log('New block:', block.blockNumber);
    });

    // Subscribe to epochs
    await provider.subscribeEpochs((epoch) => {
        console.log('Epoch:', epoch.epochNumber);
    });

    // Keep running for a while
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Cleanup
    await provider.unsubscribe(SubscriptionType.BLOCKS);
    await provider.unsubscribe(SubscriptionType.EPOCHS);
    provider.disconnect();
}

main().catch(console.error);
```

---

## Error Handling

```typescript
import { OPNetError, WebSocketErrorCode } from 'opnet';

try {
    await provider.connect();
} catch (error) {
    if (error instanceof OPNetError) {
        switch (error.code) {
            case WebSocketErrorCode.ConnectionFailed:
                console.error('Could not connect to server');
                break;
            case WebSocketErrorCode.Timeout:
                console.error('Connection timed out');
                break;
            case WebSocketErrorCode.ServerError:
                console.error('Server error:', error.message);
                break;
            default:
                console.error('Unknown error:', error.message);
        }
    }
}
```

---

## Best Practices

1. **Handle Disconnections**: Set up reconnection handlers

2. **Unsubscribe When Done**: Always call `provider.unsubscribe()` with the appropriate `SubscriptionType`

3. **Configure Timeouts**: Adjust based on network conditions

4. **Monitor Connection State**: React to state changes

5. **Clean Disconnect**: Call `disconnect()` before exiting

```typescript
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down...');
    provider.disconnect();
    process.exit(0);
});
```

---

## Next Steps

- [Internal Caching](./internal-caching.md) - Provider caching behavior
- [Advanced Configuration](./advanced-configuration.md) - Error handling and retry logic
- [Epoch Operations](../epochs/overview.md) - Working with epochs

---

[← Previous: JSON-RPC Provider](./json-rpc-provider.md) | [Next: Internal Caching →](./internal-caching.md)
