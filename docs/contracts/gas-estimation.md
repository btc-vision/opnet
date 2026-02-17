# Gas Estimation

Understanding gas costs for OPNet transactions.

## Overview

OPNet uses a gas system where computational operations cost gas units paid in satoshis. The `CallResult` object automatically provides all gas estimates.

---

## CallResult Gas Properties

Every contract call returns gas information directly:

```typescript
const result = await contract.transfer(recipient, amount, new Uint8Array(0));

// Gas consumed (in gas units)
console.log('Gas used:', result.estimatedGas);

// Gas refunded (in gas units)
console.log('Refunded gas:', result.refundedGas);

// Cost in satoshis (already calculated)
console.log('Cost in sats:', result.estimatedSatGas);

// Refunded amount in satoshis
console.log('Refunded sats:', result.estimatedRefundedGasInSat);
```

**Key Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `estimatedGas` | `bigint \| undefined` | Gas units consumed |
| `refundedGas` | `bigint \| undefined` | Gas units refunded |
| `estimatedSatGas` | `bigint` | Cost in satoshis (pre-calculated) |
| `estimatedRefundedGasInSat` | `bigint` | Refund in satoshis |

---

## Transaction Fees

After sending a transaction, the receipt includes actual fees:

```typescript
const receipt = await simulation.sendTransaction(params);

// Actual fees paid in satoshis
console.log('Fees paid:', receipt.estimatedFees, 'sats');
```

---

## Network Gas Parameters

Get current network gas parameters:

```typescript
const gasParams = await provider.gasParameters();

console.log('Gas per sat:', gasParams.gasPerSat);
console.log('Base gas:', gasParams.baseGas);
console.log('Target gas limit:', gasParams.targetGasLimit);

// Bitcoin fee rates (sat/vB)
console.log('High fee:', gasParams.bitcoin.recommended.high);
console.log('Medium fee:', gasParams.bitcoin.recommended.medium);
console.log('Low fee:', gasParams.bitcoin.recommended.low);
console.log('Conservative:', gasParams.bitcoin.conservative);
```

### BlockGasParameters Structure

```typescript
// BlockGasParameters is a class (implements IBlockGasParameters)
class BlockGasParameters implements IBlockGasParameters {
    readonly blockNumber: bigint;      // Current block number
    readonly gasUsed: bigint;          // Gas used in block
    readonly targetGasLimit: bigint;   // Target gas limit
    readonly ema: bigint;              // Exponential moving average
    readonly baseGas: bigint;          // Base gas price
    readonly gasPerSat: bigint;        // Gas units per satoshi
    readonly bitcoin: BitcoinFees;     // Bitcoin fee estimates
}

interface BitcoinFees {
    readonly conservative: number;     // Conservative fee estimate
    readonly recommended: {
        readonly low: number;          // Low priority
        readonly medium: number;       // Medium priority
        readonly high: number;         // High priority (next block)
    };
}
```

---

## Complete Example

```typescript
import {
    getContract,
    IOP20Contract,
    JSONRpcProvider,
    OP_20_ABI,
    TransactionParameters,
} from 'opnet';
import {
    Address,
    AddressTypes,
    Mnemonic,
    MLDSASecurityLevel,
    Wallet,
} from '@btc-vision/transaction';
import { Network, networks } from '@btc-vision/bitcoin';

async function transferWithGasCheck(): Promise<void> {
    const network: Network = networks.regtest;
    const provider: JSONRpcProvider = new JSONRpcProvider({
        url: 'https://regtest.opnet.org',
        network,
    });
    const mnemonic = new Mnemonic('your seed phrase here ...', '', network, MLDSASecurityLevel.LEVEL2);
    const wallet: Wallet = mnemonic.deriveUnisat(AddressTypes.P2TR, 0);  // OPWallet-compatible

    const tokenAddress: Address = Address.fromString('0x...');
    const token: IOP20Contract = getContract<IOP20Contract>(
        tokenAddress,
        OP_20_ABI,
        provider,
        network,
        wallet.address
    );

    // Simulate transfer
    const recipient: Address = Address.fromString('0x...');
    const simulation = await token.transfer(recipient, 100_00000000n, new Uint8Array(0));

    // Check for revert
    if (simulation.revert) {
        console.error('Would fail:', simulation.revert);
        return;
    }

    // Gas is already calculated in satoshis
    console.log('Gas cost:', simulation.estimatedSatGas, 'sats');

    // Get fee rate for transaction
    const gasParams = await provider.gasParameters();

    // Send transaction
    const params: TransactionParameters = {
        signer: wallet.keypair,
        mldsaSigner: null,
        refundTo: wallet.p2tr,
        maximumAllowedSatToSpend: 100_000n,
        feeRate: gasParams.bitcoin.recommended.medium,
        network: network,
    };

    const receipt = await simulation.sendTransaction(params);

    console.log('TX ID:', receipt.transactionId);
    console.log('Fees paid:', receipt.estimatedFees, 'sats');

    await provider.close();
}

transferWithGasCheck().catch(console.error);
```

---

## Fee Selection

Choose appropriate fee rates based on urgency:

```typescript
const gasParams = await provider.gasParameters();

// Non-urgent: use low fee
const economyParams: TransactionParameters = {
    ...baseParams,
    feeRate: gasParams.bitcoin.recommended.low,
};

// Urgent: use high fee (next block)
const urgentParams: TransactionParameters = {
    ...baseParams,
    feeRate: gasParams.bitcoin.recommended.high,
};
```

---

## Access List Optimization

Use access lists to optimize repeated operations:

```typescript
// First call discovers storage access patterns
const firstCall = await contract.transfer(recipient, amount, new Uint8Array(0));

// Set access list for subsequent calls
contract.setAccessList(firstCall.accessList);

// Subsequent calls may use less gas
const optimizedCall = await contract.transfer(recipient2, amount2, new Uint8Array(0));
```

---

## Best Practices

1. **Check `simulation.revert`** before sending transactions
2. **Use `estimatedSatGas`** - it's already calculated for you
3. **Check `receipt.estimatedFees`** after sending for actual cost
4. **Adjust `feeRate`** based on urgency using `gasParameters().bitcoin`
5. **Use access lists** for repeated operations on same contract

---

## Next Steps

- [Contract Code](./contract-code.md) - Fetching contract bytecode
- [Offline Signing](./offline-signing.md) - Sign transactions offline
- [OP20 Examples](../examples/op20-examples.md) - Complete token examples

---

[← Previous: Transaction Configuration](./transaction-configuration.md) | [Next: Contract Code →](./contract-code.md)
