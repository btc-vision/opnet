# Transaction Configuration

This guide provides a comprehensive reference for all transaction configuration options.

## Table of Contents

- [Overview](#overview)
- [TransactionParameters Reference](#transactionparameters-reference)
- [Mining Fee (feeRate)](#mining-fee-feerate)
- [Priority Fee](#priority-fee)
- [ML-DSA Recipient Specification](#ml-dsa-recipient-specification)
- [Multiple Private Keys](#multiple-private-keys)
- [Custom UTXOs](#custom-utxos)
- [Refund Address](#refund-address)
- [Extra Inputs and Outputs](#extra-inputs-and-outputs)
  - [Extra Inputs](#extra-inputs)
  - [Extra Outputs](#extra-outputs)
  - [Using Extra UTXOs in Simulations](#using-extra-utxos-in-simulations)
- [Additional Options](#additional-options)
  - [Minimum Gas](#minimum-gas)
  - [Transaction Note (OP_RETURN)](#transaction-note-op_return)
  - [UTXO Limits](#utxo-limits)
  - [Transaction Version](#transaction-version)
  - [Anchor Transactions](#anchor-transactions)
- [Complete Example](#complete-example)
- [Best Practices](#best-practices)

---

## Overview

Transaction configuration controls how Bitcoin transactions are built and signed. Understanding these options is crucial for optimizing costs and ensuring successful transactions.

---

## TransactionParameters Reference

```typescript
interface TransactionParameters {
    // Required: Signing
    readonly signer: Signer | UniversalSigner | null;
    readonly mldsaSigner: QuantumBIP32Interface | null;

    // Required: Addresses
    readonly refundTo: string;
    readonly maximumAllowedSatToSpend: bigint;
    readonly network: Network;

    // Optional: Fees
    feeRate?: number;
    readonly priorityFee?: bigint;

    // Optional: UTXOs
    readonly utxos?: UTXO[];
    readonly extraInputs?: UTXO[];
    readonly extraOutputs?: PsbtOutputExtended[];

    // Optional: Address overrides
    readonly sender?: string;
    readonly from?: Address;

    // Optional: Transaction options
    readonly minGas?: bigint;
    readonly note?: string | Uint8Array;
    readonly p2wda?: boolean;
    readonly txVersion?: SupportedTransactionVersion;
    readonly anchor?: boolean;
    readonly dontUseCSVUtxos?: boolean;
    readonly maxUTXOs?: number;
    readonly throwIfUTXOsLimitReached?: boolean;

    // Optional: ML-DSA options
    readonly linkMLDSAPublicKeyToAddress?: boolean;
    readonly revealMLDSAPublicKey?: boolean;

    // Optional: Challenge
    readonly challenge?: ChallengeSolution;
}
```

---

## Mining Fee (feeRate)

The `feeRate` specifies how many satoshis per virtual byte to pay for the transaction.

### Automatic Fee

If you omit `feeRate` or set it to `0`, the provider automatically fetches the current recommended fee rate:

```typescript
const params: TransactionParameters = {
    // feeRate omitted - automatically fetched from provider
    // ...
};
```

### Manual Fee

```typescript
const params: TransactionParameters = {
    feeRate: 10,  // 10 sat/vB
    // ...
};
```

### Getting Recommended Fees

```typescript
const gasParams = await provider.gasParameters();

// Fee recommendations
const lowFee = gasParams.bitcoin.recommended.low;           // Low priority
const mediumFee = gasParams.bitcoin.recommended.medium;     // Medium priority
const highFee = gasParams.bitcoin.recommended.high;         // Next block
const conservativeFee = gasParams.bitcoin.conservative;     // Conservative

const params: TransactionParameters = {
    feeRate: mediumFee,
    // ...
};
```

---

## Priority Fee

An additional fee added to prioritize the transaction:

```typescript
const params: TransactionParameters = {
    feeRate: 10,
    priorityFee: 5000n,  // Additional 5000 sats
    // ...
};
```

**Use priority fee when:**
- Transaction is time-sensitive
- Network is congested
- You need faster confirmation

---

## ML-DSA Recipient Specification

ML-DSA provides quantum-resistant signatures. Configure ML-DSA options for future-proof security.

### Basic ML-DSA Usage

```typescript
import {
    AddressTypes,
    Mnemonic,
    MLDSASecurityLevel,
} from '@btc-vision/transaction';

// Create wallet with ML-DSA support from mnemonic
const mnemonic = new Mnemonic(
    'your twenty four word seed phrase goes here ...',
    '',                            // BIP39 passphrase
    network,
    MLDSASecurityLevel.LEVEL2,     // Quantum security level
);
const wallet = mnemonic.deriveUnisat(AddressTypes.P2TR, 0);  // OPWallet-compatible

const params: TransactionParameters = {
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    // ...
};
```

### Linking ML-DSA to Address

```typescript
const params: TransactionParameters = {
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    linkMLDSAPublicKeyToAddress: true,  // Link quantum key
    revealMLDSAPublicKey: true,         // Reveal in TX
    // ...
};
```

---

## Multiple Private Keys

For advanced scenarios requiring multiple signers:

```typescript
import { ECPairFactory } from '@btc-vision/ecpair';

const ECPair = ECPairFactory();

// Create multiple keypairs
const keypair1 = ECPair.fromWIF('cKey1...', network);
const keypair2 = ECPair.fromWIF('cKey2...', network);

// Use primary signer
const params: TransactionParameters = {
    signer: keypair1,
    // For multisig, additional signing happens at PSBT level
    // ...
};
```

---

## Custom UTXOs

Specify exactly which UTXOs to use:

### Fetch and Filter UTXOs

```typescript
const allUtxos = await provider.utxoManager.getUTXOs({
    address: wallet.p2tr,
    optimize: true,
});

// Filter for specific UTXOs
const selectedUtxos = allUtxos.filter((utxo) => utxo.value >= 10000n);

const params: TransactionParameters = {
    utxos: selectedUtxos,
    // ...
};
```

### UTXO Structure

```typescript
interface UTXO {
    transactionId: string;      // Previous TX hash
    outputIndex: number;        // Output index
    value: bigint;              // Satoshi value
    scriptPubKey: ScriptPubKey; // Locking script
    nonWitnessUtxo?: Uint8Array; // Previous TX data
    witnessScript?: Uint8Array;  // For P2WSH
    redeemScript?: Uint8Array;   // For P2SH
    isCSV?: boolean;            // CheckSequenceVerify
}
```

---

## Refund Address

The address where change is sent:

```typescript
const params: TransactionParameters = {
    refundTo: wallet.p2tr,  // Address for change (any type)
    // ...
};
```

**Best practices:**
- Use your own address
- Any address type works (P2TR, P2MR, P2WPKH, P2PKH, etc.)
- P2TR (Taproot) and P2MR (BIP 360) offer the lowest fees
- Never use exchange addresses

---

## Extra Inputs and Outputs

Add custom inputs and outputs to the transaction:

### Extra Inputs

```typescript
// Add additional UTXOs as inputs
const extraInput: UTXO = {
    transactionId: 'abc123...',
    outputIndex: 0,
    value: 50000n,
    scriptPubKey: { /* ... */ },
};

const params: TransactionParameters = {
    extraInputs: [extraInput],
    // ...
};
```

### Extra Outputs

```typescript
import { PsbtOutputExtended } from '@btc-vision/bitcoin';

// Add additional outputs (e.g., treasury payment)
const extraOutput: PsbtOutputExtended = {
    address: treasuryAddress,
    value: 1000,  // 1000 sats
};

const params: TransactionParameters = {
    extraOutputs: [extraOutput],
    // ...
};
```

### Using Extra UTXOs in Simulations

When your contract needs to see extra outputs:

```typescript
import { TransactionOutputFlags } from 'opnet';

// Tell contract about the extra output
contract.setTransactionDetails({
    inputs: [],
    outputs: [
        {
            to: treasuryAddress,
            value: 1000n,
            index: 1,
            scriptPubKey: undefined,
            flags: TransactionOutputFlags.hasTo,
        },
    ],
});

// Now simulate with awareness of extra outputs
const simulation = await contract.claim();

// Include the extra output in transaction
const params: TransactionParameters = {
    extraOutputs: [{ address: treasuryAddress, value: 1000 }],
    // ...
};
```

---

## Additional Options

### Minimum Gas

Ensure minimum gas is allocated:

```typescript
const params: TransactionParameters = {
    minGas: 50000n,  // At least 50k gas
    // ...
};
```

### Transaction Note (OP_RETURN)

Add arbitrary data to the transaction:

```typescript
import { fromHex } from '@btc-vision/bitcoin';

const params: TransactionParameters = {
    note: 'My transaction note',
    // or
    note: fromHex('deadbeef'),
    // ...
};
```

### UTXO Limits

Control UTXO selection:

```typescript
const params: TransactionParameters = {
    maxUTXOs: 10,                    // Use at most 10 UTXOs
    throwIfUTXOsLimitReached: true,  // Error if limit hit
    dontUseCSVUtxos: false,          // Allow CSV UTXOs
    // ...
};
```

### Transaction Version

Specify transaction version:

```typescript
import { SupportedTransactionVersion } from '@btc-vision/transaction';

const params: TransactionParameters = {
    txVersion: SupportedTransactionVersion.V1,
    // ...
};
```

### Anchor Transactions

For CPFP (Child Pays For Parent):

```typescript
const params: TransactionParameters = {
    anchor: true,  // Create anchor output
    // ...
};
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
} from '@btc-vision/transaction';
import { networks, PsbtOutputExtended } from '@btc-vision/bitcoin';

async function fullConfigurationExample() {
    const network = networks.regtest;
    const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network });

    const mnemonic = new Mnemonic(
        'your twenty four word seed phrase goes here ...',
        '',
        network,
        MLDSASecurityLevel.LEVEL2,
    );
    const wallet = mnemonic.deriveUnisat(AddressTypes.P2TR, 0);  // OPWallet-compatible

    const token = getContract<IOP20Contract>(
        Address.fromString('0x...'),
        OP_20_ABI,
        provider,
        network,
        wallet.address
    );

    // Get fee recommendation
    const gasParams = await provider.gasParameters();

    // Get UTXOs
    const utxos = await provider.utxoManager.getUTXOs({
        address: wallet.p2tr,
        optimize: true,
    });

    // Treasury payment
    const treasuryOutput: PsbtOutputExtended = {
        address: 'bcrt1q...',
        value: 1000,
    };

    // Full configuration
    const params: TransactionParameters = {
        // Signing
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        linkMLDSAPublicKeyToAddress: true,
        revealMLDSAPublicKey: true,

        // Addresses
        refundTo: wallet.p2tr,
        from: wallet.address,

        // Fees
        feeRate: gasParams.bitcoin.recommended.medium,
        priorityFee: 1000n,

        // UTXOs
        utxos: utxos,
        maximumAllowedSatToSpend: 50000n,
        maxUTXOs: 10,
        dontUseCSVUtxos: false,

        // Extra outputs
        extraOutputs: [treasuryOutput],

        // Options
        minGas: 50000n,
        note: 'Token transfer',

        // Network
        network: network,
    };

    // Simulate and send
    const simulation = await token.transfer(
        Address.fromString('0x...'),
        100_00000000n
    );

    if (!simulation.revert) {
        const receipt = await simulation.sendTransaction(params);
        console.log('TX:', receipt.transactionId);
    }

    await provider.close();
}
```

---

## Best Practices

1. **Start Simple**: Use minimal configuration first, add options as needed

2. **Test on Regtest**: Verify configuration on regtest before mainnet

3. **Monitor Fees**: Check current fee rates before sending

4. **Limit Spending**: Always set `maximumAllowedSatToSpend`

5. **Track UTXOs**: Update UTXO list after each transaction

---

## Next Steps

- [Gas Estimation](./gas-estimation.md) - Understanding gas costs
- [Offline Signing](./offline-signing.md) - Sign without provider
- [Contract Code](./contract-code.md) - Fetching contract bytecode

---

[← Previous: Sending Transactions](./sending-transactions.md) | [Next: Gas Estimation →](./gas-estimation.md)
