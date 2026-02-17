# OP20 ABI

This guide covers the OP20 fungible token standard ABI.

## Overview

OP20 is the standard interface for fungible tokens on OPNet, similar to ERC-20 on Ethereum. It defines methods for token transfers, approvals, and balance queries.

---

## Import

```typescript
import {
    OP_20_ABI,
    IOP20Contract,
    getContract,
} from 'opnet';
```

---

## Interface: IOP20Contract

### Read Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `name()` | `string` | Token name |
| `symbol()` | `string` | Token symbol |
| `icon()` | `string` | Token icon URL |
| `decimals()` | `number` | Decimal places |
| `totalSupply()` | `bigint` | Total token supply |
| `maximumSupply()` | `bigint` | Maximum possible supply |
| `domainSeparator()` | `Uint8Array` | EIP-712 domain separator |
| `balanceOf(owner)` | `bigint` | Balance of address |
| `nonceOf(owner)` | `bigint` | Nonce for signatures |
| `allowance(owner, spender)` | `bigint` | Spending allowance |
| `metadata()` | `TokenMetadata` | All metadata in one call |

### Write Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `transfer(to, amount)` | `Address, bigint` | Transfer tokens |
| `transferFrom(from, to, amount)` | `Address, Address, bigint` | Transfer with allowance |
| `safeTransfer(to, amount, data)` | `Address, bigint, Uint8Array` | Safe transfer with callback |
| `safeTransferFrom(from, to, amount, data)` | `Address, Address, bigint, Uint8Array` | Safe transfer from |
| `increaseAllowance(spender, amount)` | `Address, bigint` | Increase spending limit |
| `decreaseAllowance(spender, amount)` | `Address, bigint` | Decrease spending limit |
| `burn(amount)` | `bigint` | Burn tokens |

### Signature Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `increaseAllowanceBySignature(...)` | Multiple | Approve via signature |
| `decreaseAllowanceBySignature(...)` | Multiple | Revoke via signature |

---

## Events

### Transferred

Emitted when tokens are transferred.

```typescript
interface TransferredEvent {
    operator: Address;  // Who initiated
    from: Address;      // Sender
    to: Address;        // Recipient
    amount: bigint;     // Amount transferred
}
```

### Approved

Emitted when allowance changes.

```typescript
interface ApprovedEvent {
    owner: Address;     // Token owner
    spender: Address;   // Approved spender
    amount: bigint;     // New allowance
}
```

### Burned

Emitted when tokens are burned.

```typescript
interface BurnedEvent {
    from: Address;      // Burner
    amount: bigint;     // Amount burned
}
```

---

## Usage Examples

### Create Contract Instance

```typescript
import { getContract, OP_20_ABI, IOP20Contract } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const network = networks.regtest;
const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network });

const token = getContract<IOP20Contract>(
    'bc1p...token-address...',
    OP_20_ABI,
    provider,
    network
);
```

### Read Token Info

```typescript
// Get metadata
const metadata = await token.metadata();
console.log('Name:', metadata.properties.name);
console.log('Symbol:', metadata.properties.symbol);
console.log('Decimals:', metadata.properties.decimals);
console.log('Total Supply:', metadata.properties.totalSupply);
```

### Check Balance

```typescript
import { Address } from '@btc-vision/transaction';

const userAddress = Address.fromString('bc1p...');
const balance = await token.balanceOf(userAddress);
console.log('Balance:', balance.properties.balance);
```

### Transfer Tokens

```typescript
const recipient = Address.fromString('bc1p...');
const amount = 1000000000n; // 10 tokens with 8 decimals

// Simulate first
const simulation = await token.transfer(recipient, amount, new Uint8Array(0));

if (simulation.revert) {
    throw new Error(`Transfer would fail: ${simulation.revert}`);
}

// Send transaction
const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    feeRate: 10,
    network: network,
    maximumAllowedSatToSpend: 10000n,
});

console.log('Transfer successful! TX:', result.transactionId);
```

### Approve Spending

```typescript
const spender = Address.fromString('bc1p...router...');
const allowance = 1000000000000n; // Large allowance

const simulation = await token.increaseAllowance(spender, allowance);

if (simulation.revert) {
    throw new Error(`Approve failed: ${simulation.revert}`);
}

const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    feeRate: 10,
    network: network,
    maximumAllowedSatToSpend: 10000n,
});
```

### Transfer From (with Allowance)

```typescript
const owner = Address.fromString('bc1p...owner...');
const recipient = Address.fromString('bc1p...recipient...');
const amount = 500000000n;

// Requires prior approval
const simulation = await token.transferFrom(owner, recipient, amount);

if (simulation.revert) {
    throw new Error(`TransferFrom failed: ${simulation.revert}`);
}

const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    feeRate: 10,
    network: network,
    maximumAllowedSatToSpend: 10000n,
});
```

---

## Full ABI Structure

```typescript
export const OP_20_ABI: BitcoinInterfaceAbi = [
    // Read functions
    {
        name: 'name',
        constant: true,
        inputs: [],
        outputs: [{ name: 'name', type: ABIDataTypes.STRING }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'symbol',
        constant: true,
        inputs: [],
        outputs: [{ name: 'symbol', type: ABIDataTypes.STRING }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'decimals',
        constant: true,
        inputs: [],
        outputs: [{ name: 'decimals', type: ABIDataTypes.UINT8 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'totalSupply',
        constant: true,
        inputs: [],
        outputs: [{ name: 'totalSupply', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'balanceOf',
        constant: true,
        inputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'balance', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'allowance',
        constant: true,
        inputs: [
            { name: 'owner', type: ABIDataTypes.ADDRESS },
            { name: 'spender', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'remaining', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },

    // Write functions
    {
        name: 'transfer',
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'transferFrom',
        inputs: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'increaseAllowance',
        inputs: [
            { name: 'spender', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'decreaseAllowance',
        inputs: [
            { name: 'spender', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'burn',
        inputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    // Events
    {
        name: 'Transferred',
        values: [
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Approved',
        values: [
            { name: 'owner', type: ABIDataTypes.ADDRESS },
            { name: 'spender', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'Burned',
        values: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
];
```

---

## Best Practices

1. **Check Decimals**: Always check decimals before formatting amounts

2. **Use BigInt**: All amounts should be bigint, not number

3. **Set Reasonable Allowance**: Don't approve unlimited amounts

4. **Handle Events**: Listen for events to confirm transfers

5. **Check Balance First**: Verify sufficient balance before transfers

---

## Next Steps

- [OP20S ABI](./op20s-abi.md) - Ownable token standard
- [OP721 ABI](./op721-abi.md) - NFT standard
- [OP20 Examples](../examples/op20-examples.md) - Code examples

---

[← Previous: Data Types](./data-types.md) | [Next: OP20S ABI →](./op20s-abi.md)
