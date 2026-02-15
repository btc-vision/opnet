# Custom ABIs

This guide covers creating custom ABI definitions for your contracts.

## Overview

When working with custom contracts, you need to define ABIs that match your contract's interface. This enables type-safe interactions.

---

## ABI Structure

### Basic Template

```typescript
import { ABIDataTypes, BitcoinAbiTypes, BitcoinInterfaceAbi } from 'opnet';

export const MY_CONTRACT_ABI: BitcoinInterfaceAbi = [
    // Functions
    {
        name: 'functionName',
        type: BitcoinAbiTypes.Function,
        constant: false,  // true for read-only
        inputs: [
            { name: 'param1', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'result', type: ABIDataTypes.BOOL },
        ],
    },

    // Events
    {
        name: 'EventName',
        type: BitcoinAbiTypes.Event,
        values: [
            { name: 'field1', type: ABIDataTypes.ADDRESS },
            { name: 'field2', type: ABIDataTypes.UINT256 },
        ],
    },
];
```

---

## Defining Functions

### Read-Only Function (View)

```typescript
{
    name: 'getValue',
    type: BitcoinAbiTypes.Function,
    constant: true,  // Indicates no state change
    inputs: [],
    outputs: [
        { name: 'value', type: ABIDataTypes.UINT256 },
    ],
}
```

### Write Function

```typescript
{
    name: 'setValue',
    type: BitcoinAbiTypes.Function,
    constant: false,
    inputs: [
        { name: 'newValue', type: ABIDataTypes.UINT256 },
    ],
    outputs: [],  // No return value
}
```

### Payable Function

Functions that require Bitcoin payment (via extra inputs/outputs):

```typescript
{
    name: 'purchase',
    type: BitcoinAbiTypes.Function,
    payable: true,
    inputs: [
        { name: 'quantity', type: ABIDataTypes.UINT256 },
    ],
    outputs: [
        { name: 'success', type: ABIDataTypes.BOOL },
    ],
}
```

> **Important**: When `payable: true`, calling `sendTransaction()` requires `extraInputs` or `extraOutputs` in the transaction parameters. Additionally, `setTransactionDetails()` must be called before the contract method invocation for simulation. Omitting either will throw an error.

### Function with Multiple Parameters

```typescript
{
    name: 'complexFunction',
    type: BitcoinAbiTypes.Function,
    inputs: [
        { name: 'recipient', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
        { name: 'data', type: ABIDataTypes.BYTES },
    ],
    outputs: [
        { name: 'success', type: ABIDataTypes.BOOL },
        { name: 'resultData', type: ABIDataTypes.BYTES },
    ],
}
```

### Function with Array Parameters

```typescript
{
    name: 'batchTransfer',
    type: BitcoinAbiTypes.Function,
    inputs: [
        { name: 'recipients', type: ABIDataTypes.ARRAY_OF_ADDRESSES },
        { name: 'amounts', type: ABIDataTypes.ARRAY_OF_UINT256 },
    ],
    outputs: [],
}
```

### Function with Tuple Parameters

Tuples let you define composite types inline. A multi-element tuple represents an array of ordered entries:

```typescript
{
    name: 'batchTransfer',
    type: BitcoinAbiTypes.Function,
    inputs: [
        {
            name: 'transfers',
            type: [ABIDataTypes.ADDRESS, ABIDataTypes.UINT256],
        },
    ],
    outputs: [],
}
```

Each entry is passed as an array matching the tuple shape:

```typescript
await contract.batchTransfer(
    [
        [recipientA, 100n],
        [recipientB, 200n],
    ],
    txParams
);
```

A single-element tuple `[T]` encodes as a flat array of that type:

```typescript
{
    name: 'setScores',
    type: BitcoinAbiTypes.Function,
    inputs: [
        { name: 'scores', type: [ABIDataTypes.UINT256] },
    ],
    outputs: [],
}

// Pass as a flat array
await contract.setScores([100n, 200n, 300n], txParams);
```

### Function with Struct Parameters

Structs define named fields as an object. Unlike tuples, a struct represents a single inline value (no array wrapping):

```typescript
{
    name: 'configure',
    type: BitcoinAbiTypes.Function,
    inputs: [
        {
            name: 'config',
            type: {
                maxSupply: ABIDataTypes.UINT256,
                mintEnabled: ABIDataTypes.BOOL,
                admin: ABIDataTypes.ADDRESS,
            },
        },
    ],
    outputs: [],
}
```

Pass a plain object matching the struct shape:

```typescript
await contract.configure(
    {
        maxSupply: 1000000n,
        mintEnabled: true,
        admin: adminAddress,
    },
    txParams
);
```

### Function with Struct Output

Structs work in outputs too:

```typescript
{
    name: 'getPoolInfo',
    type: BitcoinAbiTypes.Function,
    constant: true,
    inputs: [],
    outputs: [
        {
            name: 'pool',
            type: {
                tokenA: ABIDataTypes.ADDRESS,
                tokenB: ABIDataTypes.ADDRESS,
                reserveA: ABIDataTypes.UINT256,
                reserveB: ABIDataTypes.UINT256,
                active: ABIDataTypes.BOOL,
            },
        },
    ],
}
```

Access the decoded struct via `properties`:

```typescript
const result = await contract.getPoolInfo();
console.log(result.properties.pool.tokenA);
console.log(result.properties.pool.reserveA);
console.log(result.properties.pool.active);
```

---

## Defining Events

### Simple Event

```typescript
{
    name: 'ValueChanged',
    type: BitcoinAbiTypes.Event,
    values: [
        { name: 'oldValue', type: ABIDataTypes.UINT256 },
        { name: 'newValue', type: ABIDataTypes.UINT256 },
    ],
}
```

### Complex Event

```typescript
{
    name: 'ComplexAction',
    type: BitcoinAbiTypes.Event,
    values: [
        { name: 'actor', type: ABIDataTypes.ADDRESS },
        { name: 'action', type: ABIDataTypes.STRING },
        { name: 'timestamp', type: ABIDataTypes.UINT64 },
        { name: 'data', type: ABIDataTypes.BYTES },
    ],
}
```

---

## TypeScript Interface

### Define Result Types

```typescript
import { CallResult, OPNetEvent, BaseContractProperties } from 'opnet';

// Event types
interface ValueChangedEvent {
    oldValue: bigint;
    newValue: bigint;
}

interface ComplexActionEvent {
    actor: Address;
    action: string;
    timestamp: bigint;
    data: Uint8Array;
}

// Result types
type GetValue = CallResult<{ value: bigint }, []>;
type SetValue = CallResult<{}, [OPNetEvent<ValueChangedEvent>]>;
type BatchTransfer = CallResult<{}, [OPNetEvent<ComplexActionEvent>]>;
```

### Define Contract Interface

```typescript
import { BaseContractProperties } from 'opnet';
import { Address } from '@btc-vision/transaction';

export interface IMyContract extends BaseContractProperties {
    // Read methods
    getValue(): Promise<GetValue>;
    getOwner(): Promise<CallResult<{ owner: Address }, []>>;

    // Write methods
    setValue(newValue: bigint): Promise<SetValue>;
    batchTransfer(
        recipients: Address[],
        amounts: bigint[]
    ): Promise<BatchTransfer>;
}
```

---

## Complete Example

### Custom Voting Contract

```typescript
import {
    ABIDataTypes,
    BitcoinAbiTypes,
    BitcoinInterfaceAbi,
    CallResult,
    OPNetEvent,
    BaseContractProperties,
    getContract,
} from 'opnet';
import { Address } from '@btc-vision/transaction';

// ============ ABI Definition ============
export const VOTING_ABI: BitcoinInterfaceAbi = [
    // Read functions
    {
        name: 'getProposal',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'proposalId', type: ABIDataTypes.UINT256 }],
        outputs: [
            { name: 'description', type: ABIDataTypes.STRING },
            { name: 'votesFor', type: ABIDataTypes.UINT256 },
            { name: 'votesAgainst', type: ABIDataTypes.UINT256 },
            { name: 'deadline', type: ABIDataTypes.UINT64 },
            { name: 'executed', type: ABIDataTypes.BOOL },
        ],
    },
    {
        name: 'hasVoted',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [
            { name: 'proposalId', type: ABIDataTypes.UINT256 },
            { name: 'voter', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'voted', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'proposalCount',
        type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
    },

    // Write functions
    {
        name: 'createProposal',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'description', type: ABIDataTypes.STRING },
            { name: 'duration', type: ABIDataTypes.UINT64 },
        ],
        outputs: [{ name: 'proposalId', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'vote',
        type: BitcoinAbiTypes.Function,
        inputs: [
            { name: 'proposalId', type: ABIDataTypes.UINT256 },
            { name: 'support', type: ABIDataTypes.BOOL },
        ],
        outputs: [],
    },
    {
        name: 'executeProposal',
        type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'proposalId', type: ABIDataTypes.UINT256 }],
        outputs: [],
    },

    // Events
    {
        name: 'ProposalCreated',
        type: BitcoinAbiTypes.Event,
        values: [
            { name: 'proposalId', type: ABIDataTypes.UINT256 },
            { name: 'creator', type: ABIDataTypes.ADDRESS },
            { name: 'description', type: ABIDataTypes.STRING },
        ],
    },
    {
        name: 'Voted',
        type: BitcoinAbiTypes.Event,
        values: [
            { name: 'proposalId', type: ABIDataTypes.UINT256 },
            { name: 'voter', type: ABIDataTypes.ADDRESS },
            { name: 'support', type: ABIDataTypes.BOOL },
            { name: 'votes', type: ABIDataTypes.UINT256 },
        ],
    },
    {
        name: 'ProposalExecuted',
        type: BitcoinAbiTypes.Event,
        values: [
            { name: 'proposalId', type: ABIDataTypes.UINT256 },
        ],
    },
];

// ============ Event Types ============
interface ProposalCreatedEvent {
    proposalId: bigint;
    creator: Address;
    description: string;
}

interface VotedEvent {
    proposalId: bigint;
    voter: Address;
    support: boolean;
    votes: bigint;
}

interface ProposalExecutedEvent {
    proposalId: bigint;
}

// ============ Result Types ============
type GetProposal = CallResult<{
    description: string;
    votesFor: bigint;
    votesAgainst: bigint;
    deadline: bigint;
    executed: boolean;
}, []>;

type HasVoted = CallResult<{ voted: boolean }, []>;
type ProposalCount = CallResult<{ count: bigint }, []>;
type CreateProposal = CallResult<
    { proposalId: bigint },
    [OPNetEvent<ProposalCreatedEvent>]
>;
type Vote = CallResult<{}, [OPNetEvent<VotedEvent>]>;
type ExecuteProposal = CallResult<{}, [OPNetEvent<ProposalExecutedEvent>]>;

// ============ Contract Interface ============
export interface IVotingContract extends BaseContractProperties {
    getProposal(proposalId: bigint): Promise<GetProposal>;
    hasVoted(proposalId: bigint, voter: Address): Promise<HasVoted>;
    proposalCount(): Promise<ProposalCount>;

    createProposal(
        description: string,
        duration: bigint
    ): Promise<CreateProposal>;

    vote(proposalId: bigint, support: boolean): Promise<Vote>;

    executeProposal(proposalId: bigint): Promise<ExecuteProposal>;
}

// ============ Usage ============
const voting = getContract<IVotingContract>(
    votingAddress,
    VOTING_ABI,
    provider,
    network
);

// Create proposal
const createResult = await voting.createProposal(
    'Upgrade to version 2.0',
    86400n, // 1 day in seconds
    txParams
);

// Vote
await voting.vote(proposalId, true, txParams);

// Check results
const proposal = await voting.getProposal(proposalId);
console.log('Votes for:', proposal.properties.votesFor);
console.log('Votes against:', proposal.properties.votesAgainst);
```

---

## Validation

ABIs are validated when creating a BitcoinInterface:

```typescript
// These will throw errors
new BitcoinInterface([]); // "The ABI provided is empty."

new BitcoinInterface([{ type: 'function' }]); // "missing a name"

new BitcoinInterface([{
    name: 'test',
    type: 'function',
    inputs: [{ name: 'x' }] // missing type
}]); // "missing an input type"
```

---

## Best Practices

1. **Match Contract**: Ensure ABI matches deployed contract exactly

2. **Use TypeScript**: Define interfaces for type safety

3. **Document Functions**: Add comments explaining each function

4. **Test Thoroughly**: Test all ABI functions on regtest

5. **Version ABIs**: Track ABI versions with contract versions

6. **Reuse Patterns**: Extend base ABIs like OP_NET_ABI

---

## Next Steps

- [ABI Overview](./abi-overview.md) - ABI system overview
- [Data Types](./data-types.md) - Supported data types
- [Contract Overview](../contracts/overview.md) - Contract interactions

---

[← Previous: Stablecoin ABIs](./stablecoin-abis.md) | [Next: Provider API →](../api-reference/provider-api.md)
