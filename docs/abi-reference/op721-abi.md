# OP721 ABI

This guide covers the OP721 NFT (Non-Fungible Token) standard ABI.

## Overview

OP721 is the standard interface for NFTs on OPNet. It defines methods for NFT ownership, transfers, approvals, and metadata management.

---

## Import

```typescript
import {
    OP_721_ABI,
    EXTENDED_OP721_ABI,
    IOP721Contract,
    getContract,
} from 'opnet';
```

---

## Interface: IOP721Contract

### Metadata Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `name()` | - | `string` | Collection name |
| `symbol()` | - | `string` | Collection symbol |
| `maxSupply()` | - | `bigint` | Maximum supply |
| `collectionInfo()` | - | `{ icon, banner, description, website }` | Collection metadata |
| `tokenURI(tokenId)` | `bigint` | `string` | Token metadata URI |
| `metadata()` | - | Full metadata object | All metadata in one call |

### Supply Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `totalSupply()` | - | `bigint` | Total tokens minted |

### Ownership Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `ownerOf(tokenId)` | `bigint` | `Address` | Owner of token |
| `balanceOf(owner)` | `Address` | `bigint` | Token count for owner |
| `tokenOfOwnerByIndex(owner, index)` | `Address, bigint` | `bigint` | Token ID at owner's index |

### Transfer Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `safeTransfer(to, tokenId, data)` | `Address, bigint, Uint8Array` | Transfer NFT with callback data |
| `safeTransferFrom(from, to, tokenId, data)` | `Address, Address, bigint, Uint8Array` | Transfer from another address |

### Approval Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `approve(operator, tokenId)` | `Address, bigint` | - | Approve single token |
| `getApproved(tokenId)` | `bigint` | - | Get approved address |
| `setApprovalForAll(operator, approved)` | `Address, boolean` | - | Approve all tokens |
| `isApprovedForAll(owner, operator)` | `Address, Address` | `boolean` | Check operator approval |

### Signature-Based Approval Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `approveBySignature(owner, ownerTweakedPublicKey, operator, tokenId, deadline, signature)` | `Uint8Array, Uint8Array, Address, bigint, bigint, Uint8Array` | Approve via signature |
| `setApprovalForAllBySignature(owner, ownerTweakedPublicKey, operator, approved, deadline, signature)` | `Uint8Array, Uint8Array, Address, boolean, bigint, Uint8Array` | Set approval via signature |

### Other Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `burn(tokenId)` | `bigint` | - | Burn a token |
| `changeMetadata()` | - | - | Trigger metadata change |
| `setBaseURI(baseURI)` | `string` | - | Set base URI for tokens |
| `domainSeparator()` | - | `Uint8Array` | EIP-712 domain separator |
| `getApproveNonce(owner)` | `Address` | `bigint` | Get nonce for signatures |

---

## Events

### Transferred

Emitted when NFT is transferred.

```typescript
interface TransferredEventNFT {
    operator: Address;  // Who initiated the transfer
    from: Address;      // Sender
    to: Address;        // Recipient
    amount: bigint;     // Amount (1 for single NFT)
}
```

### Approved

Emitted when single token approval changes.

```typescript
interface ApprovedEventNFT {
    owner: Address;     // Token owner
    spender: Address;   // Approved spender
    amount: bigint;     // Token ID as amount
}
```

### ApprovedForAll

Emitted when operator approval changes.

```typescript
interface ApprovedForAllEventNFT {
    account: Address;   // Token owner
    operator: Address;  // Operator address
    approved: boolean;  // Approval status
}
```

### URI

Emitted when token URI changes.

```typescript
interface URIEventNFT {
    value: string;      // New URI value
    id: bigint;         // Token ID
}
```

---

## Usage Examples

### Create Contract Instance

```typescript
import { getContract, OP_721_ABI, IOP721Contract } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const network = networks.regtest;
const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network });

const nft = getContract<IOP721Contract>(
    'bc1p...nft-address...',
    OP_721_ABI,
    provider,
    network
);
```

### Read Collection Info

```typescript
const name = await nft.name();
const symbol = await nft.symbol();
const maxSupply = await nft.maxSupply();

console.log('Collection:', name.properties.name);
console.log('Symbol:', symbol.properties.symbol);
console.log('Max Supply:', maxSupply.properties.maxSupply);

// Get full collection metadata
const info = await nft.collectionInfo();
console.log('Description:', info.properties.description);
console.log('Website:', info.properties.website);
```

### Check Ownership

```typescript
const tokenId = 1n;
const ownerResult = await nft.ownerOf(tokenId);
console.log('Owner of token', tokenId, ':', ownerResult.properties.owner.toHex());

// Get user's balance
const userAddress = Address.fromString('bc1p...');
const balance = await nft.balanceOf(userAddress);
console.log('NFTs owned:', balance.properties.balance);
```

### Enumerate Owner's Tokens

```typescript
const owner = Address.fromString('bc1p...');
const balance = await nft.balanceOf(owner);

for (let i = 0n; i < balance.properties.balance; i++) {
    const tokenResult = await nft.tokenOfOwnerByIndex(owner, i);
    console.log('Token ID:', tokenResult.properties.tokenId);
}
```

### Transfer NFT

```typescript
const to = Address.fromString('bc1p...recipient...');
const tokenId = 1n;
const data = new Uint8Array(); // Empty callback data

// Simulate first
const simulation = await nft.safeTransfer(to, tokenId, data);

if (simulation.revert) {
    throw new Error(`Transfer would fail: ${simulation.revert}`);
}

// Send transaction
const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaSigner,
    refundTo: wallet.p2tr,
    maximumAllowedSatToSpend: 50000n,
    network: network,
    feeRate: 10,
});

console.log('Transfer TX:', result.transactionId);
```

### Approve Operator

```typescript
const operator = Address.fromString('bc1p...marketplace...');

// Approve for all tokens
const simulation = await nft.setApprovalForAll(operator, true);

const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaSigner,
    refundTo: wallet.p2tr,
    maximumAllowedSatToSpend: 50000n,
    network: network,
    feeRate: 10,
});

console.log('Approval TX:', result.transactionId);
```

### Check Approval Status

```typescript
const owner = Address.fromString('bc1p...owner...');
const operator = Address.fromString('bc1p...marketplace...');

const isApproved = await nft.isApprovedForAll(owner, operator);
console.log('Is approved for all:', isApproved.properties.approved);
```

### Get Full Metadata

```typescript
// Get all metadata in a single call
const metadata = await nft.metadata();

console.log('Name:', metadata.properties.name);
console.log('Symbol:', metadata.properties.symbol);
console.log('Icon:', metadata.properties.icon);
console.log('Banner:', metadata.properties.banner);
console.log('Description:', metadata.properties.description);
console.log('Website:', metadata.properties.website);
console.log('Total Supply:', metadata.properties.totalSupply);
console.log('Domain Separator:', metadata.properties.domainSeparator);
```

---

## Extended OP721 ABI

For mintable NFT collections with reservation system:

```typescript
import { EXTENDED_OP721_ABI } from 'opnet';
```

### Extended Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setMintEnabled(enabled)` | `boolean` | - | Enable/disable minting |
| `isMintEnabled()` | - | `boolean` | Check if minting enabled |
| `reserve(quantity)` | `bigint` | `{ remainingPayment, reservationBlock }` | Reserve tokens |
| `claim()` | - | - | Claim reserved tokens |
| `purgeExpired()` | - | - | Purge expired reservations |
| `getStatus()` | - | Status object | Get minting status |
| `airdrop(addresses, amounts)` | `Address[], Uint8Array[]` | - | Batch airdrop |
| `setTokenURI(tokenId, uri)` | `bigint, string` | - | Set individual token URI |

### Extended Events

```typescript
// Minting status changed
interface MintStatusChangedEvent {
    enabled: boolean;
}

// Reservation created
interface ReservationCreatedEvent {
    user: Address;
    amount: bigint;
    block: bigint;
    feePaid: bigint;
}

// Reservation claimed
interface ReservationClaimedEvent {
    user: Address;
    amount: bigint;
    firstTokenId: bigint;
}

// Reservations expired
interface ReservationExpiredEvent {
    block: bigint;
    amountRecovered: bigint;
}
```

### Get Status Example

```typescript
const status = await nft.getStatus();

console.log('Minted:', status.properties.minted);
console.log('Reserved:', status.properties.reserved);
console.log('Available:', status.properties.available);
console.log('Max Supply:', status.properties.maxSupply);
console.log('Price per Token:', status.properties.pricePerToken);
console.log('Reservation Fee %:', status.properties.reservationFeePercent);
```

---

## Full ABI Structure

```typescript
export const OP_721_ABI: BitcoinInterfaceAbi = [
    // Metadata
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
        name: 'maxSupply',
        constant: true,
        inputs: [],
        outputs: [{ name: 'maxSupply', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'collectionInfo',
        constant: true,
        inputs: [],
        outputs: [
            { name: 'icon', type: ABIDataTypes.STRING },
            { name: 'banner', type: ABIDataTypes.STRING },
            { name: 'description', type: ABIDataTypes.STRING },
            { name: 'website', type: ABIDataTypes.STRING },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'tokenURI',
        constant: true,
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'uri', type: ABIDataTypes.STRING }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'metadata',
        constant: true,
        inputs: [],
        outputs: [
            { name: 'name', type: ABIDataTypes.STRING },
            { name: 'symbol', type: ABIDataTypes.STRING },
            { name: 'icon', type: ABIDataTypes.STRING },
            { name: 'banner', type: ABIDataTypes.STRING },
            { name: 'description', type: ABIDataTypes.STRING },
            { name: 'website', type: ABIDataTypes.STRING },
            { name: 'totalSupply', type: ABIDataTypes.UINT256 },
            { name: 'domainSeparator', type: ABIDataTypes.BYTES32 },
        ],
        type: BitcoinAbiTypes.Function,
    },

    // Supply
    {
        name: 'totalSupply',
        constant: true,
        inputs: [],
        outputs: [{ name: 'totalSupply', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },

    // Ownership
    {
        name: 'balanceOf',
        constant: true,
        inputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'balance', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'ownerOf',
        constant: true,
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'tokenOfOwnerByIndex',
        constant: true,
        inputs: [
            { name: 'owner', type: ABIDataTypes.ADDRESS },
            { name: 'index', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },

    // Transfers
    {
        name: 'safeTransfer',
        inputs: [
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'tokenId', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'safeTransferFrom',
        inputs: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'tokenId', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    // Approvals
    {
        name: 'approve',
        inputs: [
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'tokenId', type: ABIDataTypes.UINT256 },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getApproved',
        constant: true,
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setApprovalForAll',
        inputs: [
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'approved', type: ABIDataTypes.BOOL },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'isApprovedForAll',
        constant: true,
        inputs: [
            { name: 'owner', type: ABIDataTypes.ADDRESS },
            { name: 'operator', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'approved', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },

    // Signature-based approvals
    {
        name: 'approveBySignature',
        inputs: [
            { name: 'owner', type: ABIDataTypes.BYTES32 },
            { name: 'ownerTweakedPublicKey', type: ABIDataTypes.BYTES32 },
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'tokenId', type: ABIDataTypes.UINT256 },
            { name: 'deadline', type: ABIDataTypes.UINT64 },
            { name: 'signature', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setApprovalForAllBySignature',
        inputs: [
            { name: 'owner', type: ABIDataTypes.BYTES32 },
            { name: 'ownerTweakedPublicKey', type: ABIDataTypes.BYTES32 },
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'approved', type: ABIDataTypes.BOOL },
            { name: 'deadline', type: ABIDataTypes.UINT64 },
            { name: 'signature', type: ABIDataTypes.BYTES },
        ],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },

    // Other
    {
        name: 'burn',
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'changeMetadata',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setBaseURI',
        inputs: [{ name: 'baseURI', type: ABIDataTypes.STRING }],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'domainSeparator',
        constant: true,
        inputs: [],
        outputs: [{ name: 'domainSeparator', type: ABIDataTypes.BYTES32 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getApproveNonce',
        constant: true,
        inputs: [{ name: 'owner', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'nonce', type: ABIDataTypes.UINT256 }],
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
        name: 'ApprovedForAll',
        values: [
            { name: 'account', type: ABIDataTypes.ADDRESS },
            { name: 'operator', type: ABIDataTypes.ADDRESS },
            { name: 'approved', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Event,
    },
    {
        name: 'URI',
        values: [
            { name: 'value', type: ABIDataTypes.STRING },
            { name: 'id', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Event,
    },
];
```

---

## Best Practices

1. **Check Ownership**: Verify ownership before transfers

2. **Use Safe Transfers**: `safeTransfer` ensures recipient can handle NFTs

3. **Approve Sparingly**: Only approve trusted operators

4. **Handle Reverts**: Always check `simulation.revert` before sending

5. **Batch Metadata**: Use `metadata()` for efficiency instead of multiple calls

---

## Next Steps

- [OP20 ABI](./op20-abi.md) - Token standard
- [OP721 Examples](../examples/op721-examples.md) - Code examples
- [MotoSwap ABIs](./motoswap-abis.md) - DEX interfaces

---

[← Previous: OP20S ABI](./op20s-abi.md) | [Next: MotoSwap ABIs →](./motoswap-abis.md)
