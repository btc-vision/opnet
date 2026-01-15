# Epoch API Reference

Complete API reference for epoch-related classes.

## Epoch Class

Represents a finalized epoch.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `epochNumber` | `bigint` | Sequential epoch ID |
| `epochHash` | `Buffer` | Unique epoch hash |
| `epochRoot` | `Buffer` | State root at epoch end |
| `startBlock` | `bigint` | First block in epoch |
| `endBlock` | `bigint` | Last block in epoch |
| `difficultyScaled` | `bigint` | Scaled difficulty |
| `minDifficulty` | `string \| undefined` | Minimum required difficulty |
| `targetHash` | `Buffer` | Mining target hash |
| `proposer` | `EpochMiner` | Winning miner info |
| `proofs` | `readonly Buffer[]` | Epoch validity proofs |

---

## EpochMiner Interface

The miner who proposed the epoch.

```typescript
interface IEpochMiner {
    readonly solution: Buffer;      // SHA-1 collision solution
    readonly publicKey: Address;    // Miner's public key
    readonly salt: Buffer;          // Salt used in solution
    readonly graffiti?: Buffer;     // Optional message (32 bytes max)
}
```

---

## EpochWithSubmissions

Epoch with all miner submissions.

### Properties

Inherits all `Epoch` properties plus:

| Property | Type | Description |
|----------|------|-------------|
| `submissions` | `readonly IEpochSubmission[]` | All miner submissions (optional) |

---

## EpochSubmission Class

A miner's epoch submission. Contains transaction details about the submission.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `submissionTxId` | `Buffer` | Submission transaction ID |
| `submissionTxHash` | `Buffer` | Submission transaction hash |
| `submissionHash` | `Buffer` | Hash of the submission |
| `confirmedAt` | `string` | Confirmation timestamp |
| `epochProposed` | `IEpochMiner` | The miner's proposal details |

```typescript
interface IEpochSubmission {
    readonly submissionTxId: Buffer;
    readonly submissionTxHash: Buffer;
    readonly submissionHash: Buffer;
    readonly confirmedAt: string;
    readonly epochProposed: IEpochMiner;
}
```

---

## EpochTemplate Class

Template for mining the current epoch.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `epochNumber` | `bigint` | Current epoch number |
| `epochTarget` | `Buffer` | Target hash for collision |

---

## EpochSubmissionParams

Parameters for submitting an epoch solution.

```typescript
interface EpochSubmissionParams {
    readonly epochNumber: bigint;      // Epoch number to submit for
    readonly targetHash: Buffer;       // Target hash from template
    readonly salt: Buffer;             // 32-byte salt used in collision
    readonly mldsaPublicKey: Buffer;   // ML-DSA public key
    readonly signature: Buffer;        // ML-DSA signature
    readonly graffiti?: Buffer;        // Optional message (max 32 bytes)
}
```

---

## SubmittedEpoch Class

Result of epoch submission.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `epochNumber` | `bigint` | Epoch that was submitted to |
| `submissionHash` | `Buffer` | Hash of the submission |
| `difficulty` | `number` | Difficulty achieved |
| `timestamp` | `Date` | Submission timestamp |
| `status` | `SubmissionStatus` | Submission result status |
| `message` | `string \| undefined` | Additional status info |

```typescript
interface ISubmittedEpoch {
    readonly epochNumber: bigint;
    readonly submissionHash: Buffer;
    readonly difficulty: number;
    readonly timestamp: Date;
    readonly status: SubmissionStatus;
    readonly message?: string;
}
```

---

## SubmissionStatus Enum

```typescript
enum SubmissionStatus {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}
```

---

## Provider Methods

### getLatestEpoch

```typescript
async getLatestEpoch(
    includeSubmissions: boolean
): Promise<Epoch | EpochWithSubmissions>
```

### getEpochByNumber

```typescript
async getEpochByNumber(
    epochNumber: BigNumberish,
    includeSubmissions: boolean = false
): Promise<Epoch | EpochWithSubmissions>
```

### getEpochByHash

```typescript
async getEpochByHash(
    epochHash: string,
    includeSubmissions: boolean = false
): Promise<Epoch | EpochWithSubmissions>
```

### getEpochTemplate

```typescript
async getEpochTemplate(): Promise<EpochTemplate>
```

### submitEpoch

```typescript
async submitEpoch(
    params: EpochSubmissionParams
): Promise<SubmittedEpoch>
```

---

## Usage Examples

### Get Current Epoch

```typescript
const epoch = await provider.getLatestEpoch(false);

console.log('Epoch:', epoch.epochNumber);
console.log('Blocks:', epoch.startBlock, '-', epoch.endBlock);
console.log('Proposer:', epoch.proposer.publicKey.toHex());
```

### Get With Submissions

```typescript
const epochWithSubs = await provider.getLatestEpoch(true);

if ('submissions' in epochWithSubs && epochWithSubs.submissions) {
    console.log('Total submissions:', epochWithSubs.submissions.length);

    for (const sub of epochWithSubs.submissions) {
        console.log('Miner:', sub.epochProposed.publicKey.toHex());
        console.log('Confirmed at:', sub.confirmedAt);
    }
}
```

### Get Mining Template

```typescript
const template = await provider.getEpochTemplate();

console.log('Mining epoch:', template.epochNumber);
console.log('Target:', template.epochTarget.toString('hex'));
```

### Submit Solution

```typescript
const result = await provider.submitEpoch({
    epochNumber: template.epochNumber,
    targetHash: template.epochTarget,
    salt: mySalt,
    mldsaPublicKey: myMLDSAPublicKey,
    signature: mySignature,
    graffiti: Buffer.from('MyMiner v1.0'),
});

switch (result.status) {
    case 'accepted':
        console.log('Won epoch', result.epochNumber);
        break;
    case 'rejected':
        console.log('Submission rejected:', result.message);
        break;
}
```

---

## Epoch Service Pattern

```typescript
class EpochService {
    constructor(private provider: AbstractRpcProvider) {}

    async getCurrent(): Promise<Epoch> {
        return this.provider.getLatestEpoch(false);
    }

    async getCurrentNumber(): Promise<bigint> {
        const epoch = await this.getCurrent();
        return epoch.epochNumber;
    }

    async getByNumber(num: bigint): Promise<Epoch> {
        return this.provider.getEpochByNumber(num);
    }

    async getTemplate(): Promise<EpochTemplate> {
        return this.provider.getEpochTemplate();
    }

    async getProposerHistory(
        count: number
    ): Promise<{ epoch: bigint; proposer: string }[]> {
        const history = [];
        const current = await this.getCurrent();

        for (let i = 0; i < count; i++) {
            const num = current.epochNumber - BigInt(i);
            if (num < 0n) break;

            const epoch = await this.getByNumber(num);
            history.push({
                epoch: num,
                proposer: epoch.proposer.publicKey.toHex(),
            });
        }

        return history;
    }
}
```

---

## Best Practices

1. **Cache Templates**: Refresh templates periodically, not every hash

2. **Handle Submission Status**: Check for 'accepted' or 'rejected'

3. **Track Difficulty**: Monitor difficulty for mining estimates

4. **Use Graffiti Wisely**: Keep graffiti under 32 bytes

5. **Verify Solutions**: Double-check solutions before submitting

---

## Next Steps

- [Provider API](./provider-api.md) - Provider methods
- [Types & Interfaces](./types-interfaces.md) - Type definitions
- [Epoch Operations](../epochs/epoch-operations.md) - Usage guide

---

[← Previous: UTXO Manager API](./utxo-manager-api.md) | [Next: Types & Interfaces →](./types-interfaces.md)
