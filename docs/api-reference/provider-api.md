# Provider API Reference

Complete API reference for OPNet providers.

## Table of Contents

- [AbstractRpcProvider](#abstractrpcprovider)
- [Constructor](#constructor)
  - [JSONRpcProvider](#jsonrpcprovider)
  - [WebSocketRpcProvider](#websocketrpcprovider)
- [JSONRpcProvider Methods](#jsonrpcprovider-methods)
- [Block Methods](#block-methods)
- [Transaction Methods](#transaction-methods)
- [Epoch Methods](#epoch-methods)
- [Contract Methods](#contract-methods)
- [Balance Methods](#balance-methods)
- [UTXO Methods](#utxo-methods)
- [Public Key Methods](#public-key-methods)
- [WebSocket Methods](#websocket-methods-websocketrpcprovider-only)
- [Properties](#properties)

---

## AbstractRpcProvider

Base class for all providers. Both JSONRpcProvider and WebSocketRpcProvider extend this class.

---

## Constructor

### JSONRpcProvider

```typescript
new JSONRpcProvider(
    url: string,
    network: Network,
    options?: {
        timeout?: number;
        useRESTAPI?: boolean;
        useThreadedParsing?: boolean;
    }
)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | `string` | Required | RPC endpoint URL |
| `network` | `Network` | Required | Bitcoin network |
| `timeout` | `number` | `20000` | Request timeout in milliseconds (20 seconds) |
| `useRESTAPI` | `boolean` | `true` | Use REST API mode for requests |
| `useThreadedParsing` | `boolean` | `true` | Use threaded parsing for responses |

### WebSocketRpcProvider

```typescript
new WebSocketRpcProvider(
    url: string,
    network: Network,
    config?: WebSocketClientConfig
)
```

---

## JSONRpcProvider Methods

### close

Clean up provider resources (close HTTP connections).

```typescript
close(): Promise<void>
```

### setFetchMode

Dynamically switch between REST API and pure JSON-RPC mode.

```typescript
setFetchMode(useRESTAPI: boolean): void
```

---

## Block Methods

### getBlockNumber

Get the current block height.

```typescript
getBlockNumber(): Promise<bigint>
```

### getBlock

Get a block by number or hash.

```typescript
getBlock(
    blockNumberOrHash: BigNumberish | string,
    prefetchTxs?: boolean
): Promise<Block>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `blockNumberOrHash` | `BigNumberish \| string` | Block number or hash |
| `prefetchTxs` | `boolean` | Prefetch transactions |

### getBlockByHash

Get a block by its hash.

```typescript
getBlockByHash(hash: string): Promise<Block>
```

### getBlockByChecksum

Get a block by its checksum.

```typescript
getBlockByChecksum(checksum: string): Promise<Block>
```

### getBlocks

Get multiple blocks at once.

```typescript
getBlocks(
    blockNumbers: BlockTag[],
    prefetchTxs?: boolean  // Default: false
): Promise<Block[]>
```

### getBlockWitness

Get block witness data.

```typescript
getBlockWitness(
    height?: BigNumberish,
    trusted?: boolean,
    limit?: number,
    page?: number
): Promise<BlockWitnesses>
```

### gasParameters

Get current gas parameters.

```typescript
gasParameters(): Promise<BlockGasParameters>
```

### getReorg

Check for chain reorganizations.

```typescript
getReorg(
    fromBlock?: BigNumberish,
    toBlock?: BigNumberish
): Promise<ReorgInformation[]>
```

---

## Transaction Methods

### getTransaction

Get a transaction by hash.

```typescript
getTransaction(
    txHash: string
): Promise<TransactionBase<OPNetTransactionTypes>>
```

### getTransactionReceipt

Get a transaction receipt.

```typescript
getTransactionReceipt(txHash: string): Promise<TransactionReceipt>
```

### sendRawTransaction

Broadcast a raw transaction.

```typescript
sendRawTransaction(
    tx: string,
    psbt: boolean
): Promise<BroadcastedTransaction>
```

### sendRawTransactions

Broadcast multiple transactions.

```typescript
sendRawTransactions(txs: string[]): Promise<BroadcastedTransaction[]>
```

### getChallenge

Get the current PoW challenge.

```typescript
getChallenge(): Promise<ChallengeSolution>
```

---

## Epoch Methods

### getLatestEpoch

Get the most recent epoch.

```typescript
getLatestEpoch(
    includeSubmissions: boolean
): Promise<Epoch | EpochWithSubmissions>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `includeSubmissions` | `boolean` | Include all miner submissions |

### getEpochByNumber

Get an epoch by its number.

```typescript
getEpochByNumber(
    epochNumber: BigNumberish,
    includeSubmissions: boolean = false
): Promise<Epoch | EpochWithSubmissions>
```

### getEpochByHash

Get an epoch by its hash.

```typescript
getEpochByHash(
    epochHash: string,
    includeSubmissions: boolean = false
): Promise<Epoch | EpochWithSubmissions>
```

### getEpochTemplate

Get the current mining template.

```typescript
getEpochTemplate(): Promise<EpochTemplate>
```

### submitEpoch

Submit an epoch solution.

```typescript
submitEpoch(params: EpochSubmissionParams): Promise<SubmittedEpoch>
```

---

## Contract Methods

### call

Call a contract function (read-only).

```typescript
call(
    to: string | Address,
    data: Uint8Array | string,
    from?: Address,
    height?: BigNumberish,
    simulatedTransaction?: ParsedSimulatedTransaction,
    accessList?: IAccessList
): Promise<CallResult | ICallRequestError>
```

### getCode

Get contract code/data. Returns `Uint8Array` when `onlyBytecode=true`, otherwise `ContractData`.

```typescript
getCode(
    address: string | Address,
    onlyBytecode: boolean = false
): Promise<ContractData | Uint8Array>
```

### getStorageAt

Read contract storage directly.

```typescript
getStorageAt(
    address: string | Address,
    rawPointer: bigint | string,
    proofs?: boolean,
    height?: BigNumberish
): Promise<StoredValue>
```

---

## Balance Methods

### getBalance

Get balance for a single address.

```typescript
getBalance(
    address: string | Address,
    filterOrdinals?: boolean
): Promise<bigint>
```

### getBalances

Get balances for multiple addresses.

```typescript
getBalances(
    addressesLike: string[],
    filterOrdinals: boolean = true
): Promise<Record<string, bigint>>
```

---

## UTXO Methods

UTXOs are accessed via the `utxoManager` property:

```typescript
// Get UTXOs for an address
provider.utxoManager.getUTXOs(params: RequestUTXOsParams): Promise<UTXOs>

// Get UTXOs to cover a specific amount
provider.utxoManager.getUTXOsForAmount(
    params: RequestUTXOsParamsWithAmount
): Promise<UTXOs>
```

---

## Public Key Methods

### getPublicKeyInfo

Get public key info for an address.

```typescript
getPublicKeyInfo(
    addressRaw: string | Address,
    isContract: boolean
): Promise<Address>
```

### getPublicKeysInfo

Get public key info for multiple addresses.

```typescript
getPublicKeysInfo(
    addresses: string | string[] | Address | Address[],
    isContract?: boolean,
    logErrors?: boolean
): Promise<AddressesInfo>
```

### getPublicKeysInfoRaw

Get raw public key info.

```typescript
getPublicKeysInfoRaw(
    addresses: string | string[] | Address | Address[]
): Promise<IPublicKeyInfoResult>
```

### validateAddress

Validate an address format.

```typescript
validateAddress(
    addr: string | Address,
    network: Network
): AddressTypes | null
```

### getCSV1ForAddress

Get CSV1 address for an address.

```typescript
getCSV1ForAddress(address: Address): IP2WSHAddress
```

### getNetwork

Get the network configuration.

```typescript
getNetwork(): Network
```

### getChainId

Get the chain ID.

```typescript
getChainId(): Promise<bigint>
```

---

## WebSocket Methods (WebSocketRpcProvider only)

### subscribeBlocks

Subscribe to new block notifications.

```typescript
async subscribeBlocks(
    handler: SubscriptionHandler<BlockNotification>
): Promise<void>
```

### subscribeEpochs

Subscribe to new epoch notifications.

```typescript
async subscribeEpochs(
    handler: SubscriptionHandler<EpochNotification>
): Promise<void>
```

### unsubscribe

Unsubscribe from a subscription.

```typescript
async unsubscribe(subscriptionType: SubscriptionType): Promise<void>
```

### SubscriptionType

```typescript
enum SubscriptionType {
    BLOCKS = 1,
    EPOCHS = 2,
}
```

### Usage Example

```typescript
import { WebSocketRpcProvider, SubscriptionType } from 'opnet';

const wsProvider = new WebSocketRpcProvider(
    'wss://regtest.opnet.org/ws',
    network
);

// Subscribe to blocks
await wsProvider.subscribeBlocks((block) => {
    console.log('New block:', block.height);
});

// Subscribe to epochs
await wsProvider.subscribeEpochs((epoch) => {
    console.log('New epoch:', epoch.epochNumber);
});

// Unsubscribe
await wsProvider.unsubscribe(SubscriptionType.BLOCKS);
```

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `network` | `Network` | The Bitcoin network |
| `url` | `string` | The RPC endpoint URL |
| `utxoManager` | `UTXOsManager` | UTXO management instance |

---

## Next Steps

- [Contract API](./contract-api.md) - Contract class API
- [UTXO Manager API](./utxo-manager-api.md) - UTXO management
- [Types & Interfaces](./types-interfaces.md) - Type definitions

---

[← Previous: Custom ABIs](../abi-reference/custom-abis.md) | [Next: Contract API →](./contract-api.md)
