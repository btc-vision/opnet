# OPNet Client Library Documentation

Welcome to the comprehensive documentation for **opnet**, the official client library for building Bitcoin-based applications on OPNet.

## Quick Start

```bash
npm install opnet @btc-vision/transaction @btc-vision/bitcoin
```

```typescript
import { getContract, IOP20Contract, JSONRpcProvider, OP_20_ABI } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

// Connect to OPNet
const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });

// Interact with a token contract
const token = getContract<IOP20Contract>(
    'op1...',  // contract address
    OP_20_ABI,
    provider,
    networks.regtest
);

// Read token balance
const balance = await token.balanceOf(myAddress);
console.log('Balance:', balance.properties.balance);
```

---

## Complete Table of Contents

### Getting Started

#### [Installation](./getting-started/installation.md)
- [npm Installation](./getting-started/installation.md#npm-installation)
- [TypeScript Configuration](./getting-started/installation.md#typescript-configuration)
- [Peer Dependencies](./getting-started/installation.md#peer-dependencies)
- [Browser Setup](./getting-started/installation.md#browser-setup)
- [Node.js Setup](./getting-started/installation.md#nodejs-setup)

#### [Overview](./getting-started/overview.md)
- [Architecture](./getting-started/overview.md#architecture)
- [Key Concepts](./getting-started/overview.md#key-concepts)
- [OPNet Protocol](./getting-started/overview.md#opnet-protocol)
- [Networks](./getting-started/overview.md#networks)

#### [Quick Start](./getting-started/quick-start.md)
- [Provider Setup](./getting-started/quick-start.md#provider-setup)
- [First Contract Call](./getting-started/quick-start.md#first-contract-call)
- [First Transaction](./getting-started/quick-start.md#first-transaction)

---

### Providers

#### [Understanding Providers](./providers/understanding-providers.md)
- [What Providers Do](./providers/understanding-providers.md#what-providers-do)
- [Provider Types](./providers/understanding-providers.md#provider-types)
- [Choosing the Right Provider](./providers/understanding-providers.md#choosing-the-right-provider)
- [Network Selection](./providers/understanding-providers.md#network-selection)

#### [JSON-RPC Provider](./providers/json-rpc-provider.md)
- [Setting Up HTTP Connections](./providers/json-rpc-provider.md#setting-up-http-connections)
- [Constructor Parameters](./providers/json-rpc-provider.md#constructor-parameters)
- [Network Configuration](./providers/json-rpc-provider.md#network-configuration)
- [REST API vs JSON-RPC Mode](./providers/json-rpc-provider.md#rest-api-vs-json-rpc-mode)
- [Threaded Parsing](./providers/json-rpc-provider.md#threaded-parsing)

#### [WebSocket Provider](./providers/websocket-provider.md)
- [Real-Time Subscriptions](./providers/websocket-provider.md#real-time-subscriptions)
- [Block Notifications](./providers/websocket-provider.md#block-notifications)
- [Epoch Notifications](./providers/websocket-provider.md#epoch-notifications)
- [Event Handlers](./providers/websocket-provider.md#event-handlers)
- [Connection Management](./providers/websocket-provider.md#connection-management)

#### [Internal Caching](./providers/internal-caching.md)
- [LRU Cache Behavior](./providers/internal-caching.md#lru-cache-behavior)
- [P2OP Address Cache](./providers/internal-caching.md#p2op-address-cache)
- [Performance Considerations](./providers/internal-caching.md#performance-considerations)

#### [Advanced Configuration](./providers/advanced-configuration.md)
- [Request Batching](./providers/advanced-configuration.md#request-batching)
- [Error Handling](./providers/advanced-configuration.md#error-handling)
- [Retry Logic](./providers/advanced-configuration.md#retry-logic)
- [Connection Pooling](./providers/advanced-configuration.md#connection-pooling)

---

### Smart Contract Interactions

#### [Overview](./contracts/overview.md)
- [Contract Interaction Flow](./contracts/overview.md#contract-interaction-flow)
- [Simulation vs Execution](./contracts/overview.md#simulation-vs-execution)
- [ABI System](./contracts/overview.md#abi-system)
- [Contract Types](./contracts/overview.md#contract-types)

#### [Instantiating Contracts](./contracts/instantiating-contracts.md)
- [Using getContract()](./contracts/instantiating-contracts.md#using-getcontract)
- [Importing ABIs](./contracts/instantiating-contracts.md#importing-abis)
- [Type-Safe Interfaces](./contracts/instantiating-contracts.md#type-safe-interfaces)
- [Setting Sender Address](./contracts/instantiating-contracts.md#setting-sender-address)

#### [Simulating Calls](./contracts/simulating-calls.md)
- [Read-Only Method Calls](./contracts/simulating-calls.md#read-only-method-calls)
- [CallResult Class](./contracts/simulating-calls.md#callresult-class)
- [Decoded Outputs](./contracts/simulating-calls.md#decoded-outputs)
- [Handling Reverts](./contracts/simulating-calls.md#handling-reverts)
- [Historical Queries](./contracts/simulating-calls.md#historical-queries)
- [Access Lists](./contracts/simulating-calls.md#access-lists)

#### [Sending Transactions](./contracts/sending-transactions.md)
- [TransactionParameters](./contracts/sending-transactions.md#transactionparameters)
- [Signer Configuration](./contracts/sending-transactions.md#signer-configuration)
- [Fee Configuration](./contracts/sending-transactions.md#fee-configuration)
- [UTXO Selection](./contracts/sending-transactions.md#utxo-selection)
- [Transaction Flow](./contracts/sending-transactions.md#transaction-flow)

#### [Transaction Configuration](./contracts/transaction-configuration.md)
- [Mining Fee (feeRate)](./contracts/transaction-configuration.md#mining-fee-feerate)
- [Priority Fee](./contracts/transaction-configuration.md#priority-fee)
- [ML-DSA Recipient](./contracts/transaction-configuration.md#ml-dsa-recipient)
- [Multiple Private Keys](./contracts/transaction-configuration.md#multiple-private-keys)
- [Custom UTXOs](./contracts/transaction-configuration.md#custom-utxos)
- [Refund Address](./contracts/transaction-configuration.md#refund-address)
- [Extra Inputs/Outputs](./contracts/transaction-configuration.md#extra-inputsoutputs)

#### [Gas Estimation](./contracts/gas-estimation.md)
- [gasUsed Property](./contracts/gas-estimation.md#gasused-property)
- [Gas Parameters](./contracts/gas-estimation.md#gas-parameters)
- [Cost Calculation](./contracts/gas-estimation.md#cost-calculation)

#### [Contract Code](./contracts/contract-code.md)
- [Fetching Contract Code](./contracts/contract-code.md#fetching-contract-code)
- [ContractData Class](./contracts/contract-code.md#contractdata-class)
- [Bytecode Only](./contracts/contract-code.md#bytecode-only)

#### [Offline Signing](./contracts/offline-signing.md)
- [Building Transactions Offline](./contracts/offline-signing.md#building-transactions-offline)
- [signTransaction()](./contracts/offline-signing.md#signtransaction)
- [Broadcasting Separately](./contracts/offline-signing.md#broadcasting-separately)

---

### Examples

#### [OP20 Token Examples](./examples/op20-examples.md)
- [Method Data Encoding](./examples/op20-examples.md#method-data-encoding)
- [Transfer Example](./examples/op20-examples.md#transfer-example)
- [Approve/TransferFrom](./examples/op20-examples.md#approvetransferfrom)
- [Airdrop Example](./examples/op20-examples.md#airdrop-example)
- [Balance Checking](./examples/op20-examples.md#balance-checking)

#### [OP721 NFT Examples](./examples/op721-examples.md)
- [NFT Method Data](./examples/op721-examples.md#nft-method-data)
- [Transfer Example](./examples/op721-examples.md#transfer-example)
- [Airdrop Example](./examples/op721-examples.md#airdrop-example)
- [Whitelist Management](./examples/op721-examples.md#whitelist-management)
- [Claim with Treasury](./examples/op721-examples.md#claim-with-treasury)

#### [Advanced Swaps](./examples/advanced-swaps.md)
- [MotoSwap Router](./examples/advanced-swaps.md#motoswap-router)
- [Pool Liquidity](./examples/advanced-swaps.md#pool-liquidity)
- [Swap Execution](./examples/advanced-swaps.md#swap-execution)
- [Slippage Handling](./examples/advanced-swaps.md#slippage-handling)

#### [Contract Deployment](./examples/deployment-examples.md)
- [Deployment Flow](./examples/deployment-examples.md#deployment-flow)
- [Bytecode Preparation](./examples/deployment-examples.md#bytecode-preparation)
- [Constructor Calldata](./examples/deployment-examples.md#constructor-calldata)
- [Broadcasting Deployment](./examples/deployment-examples.md#broadcasting-deployment)

---

### Working with Bitcoin

#### [Address Balances](./bitcoin/balances.md)
- [Get Single Balance](./bitcoin/balances.md#get-single-balance)
- [Get Multiple Balances](./bitcoin/balances.md#get-multiple-balances)
- [Filtering Ordinals](./bitcoin/balances.md#filtering-ordinals)

#### [UTXO Management](./bitcoin/utxos.md)
- [UTXOsManager Overview](./bitcoin/utxos.md#utxosmanager-overview)
- [Fetching UTXOs](./bitcoin/utxos.md#fetching-utxos)
- [UTXOs for Amount](./bitcoin/utxos.md#utxos-for-amount)
- [UTXO Tracking](./bitcoin/utxos.md#utxo-tracking)

#### [Sending Bitcoin](./bitcoin/sending-bitcoin.md)
- [Building Transactions](./bitcoin/sending-bitcoin.md#building-transactions)
- [Fee Calculation](./bitcoin/sending-bitcoin.md#fee-calculation)
- [Output Construction](./bitcoin/sending-bitcoin.md#output-construction)

#### [UTXO Optimization](./bitcoin/utxo-optimization.md)
- [UTXO Consolidation](./bitcoin/utxo-optimization.md#utxo-consolidation)
- [Batch Payments](./bitcoin/utxo-optimization.md#batch-payments)
- [Dust Removal](./bitcoin/utxo-optimization.md#dust-removal)

---

### Working with Blocks

#### [Block Operations](./blocks/block-operations.md)
- [Get Current Block Height](./blocks/block-operations.md#get-current-block-height)
- [Fetch Block by Number](./blocks/block-operations.md#fetch-block-by-number)
- [Fetch Block by Hash](./blocks/block-operations.md#fetch-block-by-hash)
- [Fetch Multiple Blocks](./blocks/block-operations.md#fetch-multiple-blocks)
- [Block Properties](./blocks/block-operations.md#block-properties)

#### [Gas Parameters](./blocks/gas-parameters.md)
- [gasParameters() Method](./blocks/gas-parameters.md#gasparameters-method)
- [BlockGasParameters](./blocks/gas-parameters.md#blockgasparameters)
- [Fee Data Structure](./blocks/gas-parameters.md#fee-data-structure)

#### [Block Witnesses](./blocks/block-witnesses.md)
- [getBlockWitness()](./blocks/block-witnesses.md#getblockwitness)
- [BlockWitness Class](./blocks/block-witnesses.md#blockwitness-class)
- [Proof Validation](./blocks/block-witnesses.md#proof-validation)

#### [Reorg Detection](./blocks/reorg-detection.md)
- [getReorg() Method](./blocks/reorg-detection.md#getreorg-method)
- [ReorgInformation](./blocks/reorg-detection.md#reorginformation)
- [Handling Reorgs](./blocks/reorg-detection.md#handling-reorgs)

---

### Working with Epochs

#### [Overview](./epochs/overview.md)
- [OPNet Consensus](./epochs/overview.md#opnet-consensus)
- [SHA-1 Collision Mining](./epochs/overview.md#sha-1-collision-mining)
- [Epoch Lifecycle](./epochs/overview.md#epoch-lifecycle)
- [EpochMiner](./epochs/overview.md#epochminer)

#### [Epoch Operations](./epochs/epoch-operations.md)
- [Get Latest Epoch](./epochs/epoch-operations.md#get-latest-epoch)
- [Get Epoch by Number](./epochs/epoch-operations.md#get-epoch-by-number)
- [Get Epoch by Hash](./epochs/epoch-operations.md#get-epoch-by-hash)
- [Epoch Properties](./epochs/epoch-operations.md#epoch-properties)

#### [Mining Template](./epochs/mining-template.md)
- [getEpochTemplate()](./epochs/mining-template.md#getepochtemplate)
- [EpochTemplate Class](./epochs/mining-template.md#epochtemplate-class)
- [Target Hash](./epochs/mining-template.md#target-hash)
- [Difficulty Conversion](./epochs/mining-template.md#difficulty-conversion)

#### [Submitting Epochs](./epochs/submitting-epochs.md)
- [submitEpoch()](./epochs/submitting-epochs.md#submitepoch)
- [EpochSubmissionParams](./epochs/submitting-epochs.md#epochsubmissionparams)
- [Solution Format](./epochs/submitting-epochs.md#solution-format)
- [SubmittedEpoch Result](./epochs/submitting-epochs.md#submittedepoch-result)

---

### Storage Operations

#### [Storage Operations](./storage/storage-operations.md)
- [getStorageAt()](./storage/storage-operations.md#getstorageat)
- [Pointer-Based Access](./storage/storage-operations.md#pointer-based-access)
- [StoredValue Class](./storage/storage-operations.md#storedvalue-class)
- [Requesting Proofs](./storage/storage-operations.md#requesting-proofs)
- [Historical Queries](./storage/storage-operations.md#historical-queries)

---

### Working with Transactions

#### [Fetching Transactions](./transactions/fetching-transactions.md)
- [Get Transaction by Hash](./transactions/fetching-transactions.md#get-transaction-by-hash)
- [Transaction Classes](./transactions/fetching-transactions.md#transaction-classes)
- [Transaction Properties](./transactions/fetching-transactions.md#transaction-properties)
- [OPNet Transaction Types](./transactions/fetching-transactions.md#opnet-transaction-types)

#### [Transaction Receipts](./transactions/transaction-receipts.md)
- [getTransactionReceipt()](./transactions/transaction-receipts.md#gettransactionreceipt)
- [TransactionReceipt Class](./transactions/transaction-receipts.md#transactionreceipt-class)
- [Event Decoding](./transactions/transaction-receipts.md#event-decoding)

#### [Challenges](./transactions/challenges.md)
- [getChallenge()](./transactions/challenges.md#getchallenge)
- [ProofOfWorkChallenge](./transactions/challenges.md#proofofworkchallenge)
- [Challenge Purpose](./transactions/challenges.md#challenge-purpose)
- [Expiration Handling](./transactions/challenges.md#expiration-handling)

#### [Broadcasting](./transactions/broadcasting.md)
- [sendRawTransaction()](./transactions/broadcasting.md#sendrawtransaction)
- [Bulk Broadcasting](./transactions/broadcasting.md#bulk-broadcasting)
- [BroadcastedTransaction](./transactions/broadcasting.md#broadcastedtransaction)

---

### Working with Public Keys

#### [Public Key Operations](./public-keys/public-key-operations.md)
- [Get Unified Addresses](./public-keys/public-key-operations.md#get-unified-addresses)
- [Fetch Multiple Keys](./public-keys/public-key-operations.md#fetch-multiple-keys)
- [CSV1 Address Lookup](./public-keys/public-key-operations.md#csv1-address-lookup)
- [Address Validation](./public-keys/public-key-operations.md#address-validation)
- [Address Conversions](./public-keys/public-key-operations.md#address-conversions)

---

### Utilities

#### [BitcoinUtils](./utils/bitcoin-utils.md)
- [formatUnits()](./utils/bitcoin-utils.md#formatunits)
- [expandToDecimals()](./utils/bitcoin-utils.md#expandtodecimals)
- [Address Utilities](./utils/bitcoin-utils.md#address-utilities)

#### [Revert Decoder](./utils/revert-decoder.md)
- [decodeRevertData Function](./utils/revert-decoder.md#decode-revert-data)
- [Decoding Revert Data](./utils/revert-decoder.md#decoding-revert-data)
- [Common Patterns](./utils/revert-decoder.md#common-patterns)

#### [Binary Serialization](./utils/binary-serialization.md)
- [BinaryWriter](./utils/binary-serialization.md#binarywriter)
- [BinaryReader](./utils/binary-serialization.md#binaryreader)
- [Primitive Methods](./utils/binary-serialization.md#primitive-methods)
- [Array Methods](./utils/binary-serialization.md#array-methods)
- [Complete Examples](./utils/binary-serialization.md#complete-examples)

---

### ABI Reference

#### [ABI Overview](./abi-reference/abi-overview.md)
- [BitcoinInterface Class](./abi-reference/abi-overview.md#bitcoininterface-class)
- [ABI Structure](./abi-reference/abi-overview.md#abi-structure)
- [Functions and Events](./abi-reference/abi-overview.md#functions-and-events)

#### [Data Types](./abi-reference/data-types.md)
- [ABIDataTypes](./abi-reference/data-types.md#abidatatypes)
- [Type Mapping](./abi-reference/data-types.md#type-mapping)
- [Array Types](./abi-reference/data-types.md#array-types)

#### [OP20 ABI](./abi-reference/op20-abi.md)
- [IOP20Contract Interface](./abi-reference/op20-abi.md#iop20contract-interface)
- [OP_20_ABI](./abi-reference/op20-abi.md#op_20_abi)
- [Standard Methods](./abi-reference/op20-abi.md#standard-methods)

#### [OP20S ABI](./abi-reference/op20s-abi.md)
- [IOP20SContract Interface](./abi-reference/op20s-abi.md#iop20scontract-interface)
- [OP_20S_ABI](./abi-reference/op20s-abi.md#op_20s_abi)
- [Ownable Methods](./abi-reference/op20s-abi.md#ownable-methods)

#### [OP721 ABI](./abi-reference/op721-abi.md)
- [IOP721Contract Interface](./abi-reference/op721-abi.md#iop721contract-interface)
- [IExtendedOP721Contract](./abi-reference/op721-abi.md#iextendedop721contract)
- [OP_721_ABI](./abi-reference/op721-abi.md#op_721_abi)

#### [MotoSwap ABIs](./abi-reference/motoswap-abis.md)
- [Factory Contract](./abi-reference/motoswap-abis.md#factory-contract)
- [Pool Contract](./abi-reference/motoswap-abis.md#pool-contract)
- [Router Contract](./abi-reference/motoswap-abis.md#router-contract)
- [MOTO Token](./abi-reference/motoswap-abis.md#moto-token)
- [Staking Contract](./abi-reference/motoswap-abis.md#staking-contract)

#### [Factory ABIs](./abi-reference/factory-abis.md)
- [MotoChef Factory](./abi-reference/factory-abis.md#motochef-factory)
- [OP20 Factory](./abi-reference/factory-abis.md#op20-factory)
- [Template Contracts](./abi-reference/factory-abis.md#template-contracts)

#### [Stablecoin ABIs](./abi-reference/stablecoin-abis.md)
- [Oracle Coin](./abi-reference/stablecoin-abis.md#oracle-coin)
- [Multi-Collateral Stablecoin](./abi-reference/stablecoin-abis.md#multi-collateral-stablecoin)
- [Pegged Coin](./abi-reference/stablecoin-abis.md#pegged-coin)

#### [Custom ABIs](./abi-reference/custom-abis.md)
- [Creating Custom ABIs](./abi-reference/custom-abis.md#creating-custom-abis)
- [Defining Functions](./abi-reference/custom-abis.md#defining-functions)
- [Defining Events](./abi-reference/custom-abis.md#defining-events)
- [Type Safety](./abi-reference/custom-abis.md#type-safety)

---

### API Reference

#### [Provider API](./api-reference/provider-api.md)
- [AbstractRpcProvider](./api-reference/provider-api.md#abstractrpcprovider)
- [JSONRpcProvider](./api-reference/provider-api.md#jsonrpcprovider)
- [WebSocketRpcProvider](./api-reference/provider-api.md#websocketrpcprovider)

#### [Contract API](./api-reference/contract-api.md)
- [BaseContract](./api-reference/contract-api.md#basecontract)
- [getContract()](./api-reference/contract-api.md#getcontract)
- [CallResult](./api-reference/contract-api.md#callresult)
- [OPNetEvent](./api-reference/contract-api.md#opnetevent)

#### [UTXOsManager API](./api-reference/utxo-manager-api.md)
- [UTXOsManager](./api-reference/utxo-manager-api.md#utxosmanager)
- [RequestUTXOsParams](./api-reference/utxo-manager-api.md#requestutxosparams)
- [UTXO Interface](./api-reference/utxo-manager-api.md#utxo-interface)

#### [Epoch API](./api-reference/epoch-api.md)
- [Epoch Class](./api-reference/epoch-api.md#epoch-class)
- [EpochMiner](./api-reference/epoch-api.md#epochminer)
- [EpochTemplate](./api-reference/epoch-api.md#epochtemplate)
- [EpochDifficultyConverter](./api-reference/epoch-api.md#epochdifficultyconverter)

#### [Types & Interfaces](./api-reference/types-interfaces.md)
- [Common Types](./api-reference/types-interfaces.md#common-types)
- [Transaction Types](./api-reference/types-interfaces.md#transaction-types)
- [Enums](./api-reference/types-interfaces.md#enums)

