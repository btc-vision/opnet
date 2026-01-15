# Mining Template

This guide covers using epoch templates for SHA-1 collision mining on OPNet.

## Overview

The epoch template provides the target hash and difficulty parameters needed to mine the current epoch. Miners must find a SHA-1 collision solution that meets the difficulty requirements.

```mermaid
flowchart TD
    A[Get Template] --> B[EpochTemplate]
    B --> C[epochTarget]
    B --> D[epochNumber]
    C --> E[Generate Salt]
    E --> F[SHA1 Hash]
    F --> G{Meets Difficulty?}
    G -->|No| E
    G -->|Yes| H[Submit Solution]
```

---

## Get Mining Template

### Basic Template Query

```typescript
import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const network = networks.regtest;
const provider = new JSONRpcProvider('https://regtest.opnet.org', network);

const template = await provider.getEpochTemplate();

console.log('Mining Template:');
console.log('  Epoch:', template.epochNumber);
console.log('  Target:', template.epochTarget.toString('hex'));
```

### Method Signature

```typescript
async getEpochTemplate(): Promise<EpochTemplate>
```

---

## EpochTemplate Structure

```typescript
interface EpochTemplate {
    epochNumber: bigint;    // Current epoch being mined
    epochTarget: Buffer;    // Target hash for collision
}
```

---

## Mining Process

### Understanding the Target

The `epochTarget` is the hash that miners must find a collision for. A valid solution requires:

```
SHA1(epochTarget || salt) = collision that meets difficulty
```

### Basic Mining Loop

```typescript
import { createHash } from 'crypto';

async function mineEpoch(
    provider: JSONRpcProvider,
    minerPublicKey: Buffer
): Promise<{ salt: Buffer; solution: Buffer } | null> {
    const template = await provider.getEpochTemplate();
    const target = template.epochTarget;

    let attempts = 0;
    const maxAttempts = 1000000; // Limit for demo

    while (attempts < maxAttempts) {
        // Generate random salt (32 bytes)
        const salt = crypto.getRandomValues(new Uint8Array(32));
        const saltBuffer = Buffer.from(salt);

        // Calculate SHA-1 hash
        const data = Buffer.concat([target, saltBuffer]);
        const hash = createHash('sha1').update(data).digest();

        // Check if meets difficulty (simplified)
        if (meetsTargetDifficulty(hash, template)) {
            return {
                salt: saltBuffer,
                solution: hash,
            };
        }

        attempts++;
    }

    return null;
}

function meetsTargetDifficulty(
    hash: Buffer,
    template: EpochTemplate
): boolean {
    // Difficulty check - leading zeros required
    // Actual implementation depends on network difficulty
    const leadingZeros = countLeadingZeros(hash);
    return leadingZeros >= 4; // Simplified example
}

function countLeadingZeros(hash: Buffer): number {
    let zeros = 0;
    for (const byte of hash) {
        if (byte === 0) {
            zeros += 8;
        } else {
            zeros += Math.clz32(byte) - 24;
            break;
        }
    }
    return zeros;
}
```

---

## Difficulty Management

### Get Current Difficulty

```typescript
async function getCurrentDifficulty(
    provider: JSONRpcProvider
): Promise<{
    epochNumber: bigint;
    difficultyScaled: bigint;
    minDifficulty?: string;
}> {
    const epoch = await provider.getLatestEpoch(false);

    return {
        epochNumber: epoch.epochNumber,
        difficultyScaled: epoch.difficultyScaled,
        minDifficulty: epoch.minDifficulty,
    };
}

// Usage
const difficulty = await getCurrentDifficulty(provider);
console.log('Current difficulty:', difficulty.difficultyScaled);
```

### Track Difficulty Changes

```typescript
async function trackDifficultyHistory(
    provider: JSONRpcProvider,
    epochCount: number
): Promise<Array<{ epoch: bigint; difficulty: bigint }>> {
    const history: Array<{ epoch: bigint; difficulty: bigint }> = [];
    const latest = await provider.getLatestEpoch(false);

    for (let i = 0; i < epochCount; i++) {
        const epochNum = latest.epochNumber - BigInt(i);
        if (epochNum < 0n) break;

        const epoch = await provider.getEpochByNumber(epochNum);
        history.push({
            epoch: epoch.epochNumber,
            difficulty: epoch.difficultyScaled,
        });
    }

    return history.reverse();
}

// Usage
const difficultyHistory = await trackDifficultyHistory(provider, 20);
console.log('Difficulty over last 20 epochs:');
for (const entry of difficultyHistory) {
    console.log(`  Epoch ${entry.epoch}: ${entry.difficulty}`);
}
```

---

## Mining Service

### Complete Mining Implementation

```typescript
class MiningService {
    private provider: JSONRpcProvider;
    private isRunning: boolean = false;
    private currentTemplate: EpochTemplate | null = null;

    constructor(provider: JSONRpcProvider) {
        this.provider = provider;
    }

    async refreshTemplate(): Promise<EpochTemplate> {
        this.currentTemplate = await this.provider.getEpochTemplate();
        return this.currentTemplate;
    }

    getTemplate(): EpochTemplate | null {
        return this.currentTemplate;
    }

    async startMining(
        minerPublicKey: Buffer,
        onSolutionFound: (solution: {
            salt: Buffer;
            hash: Buffer;
            epochNumber: bigint;
        }) => void,
        hashesPerBatch: number = 10000
    ): Promise<void> {
        this.isRunning = true;

        while (this.isRunning) {
            // Refresh template periodically
            const template = await this.refreshTemplate();

            // Mine batch
            const result = await this.mineBatch(
                template,
                hashesPerBatch
            );

            if (result) {
                onSolutionFound({
                    salt: result.salt,
                    hash: result.hash,
                    epochNumber: template.epochNumber,
                });
            }

            // Small delay to prevent tight loop
            await new Promise(r => setTimeout(r, 100));
        }
    }

    stopMining(): void {
        this.isRunning = false;
    }

    private async mineBatch(
        template: EpochTemplate,
        batchSize: number
    ): Promise<{ salt: Buffer; hash: Buffer } | null> {
        const target = template.epochTarget;

        for (let i = 0; i < batchSize; i++) {
            const salt = Buffer.from(
                crypto.getRandomValues(new Uint8Array(32))
            );

            const data = Buffer.concat([target, salt]);
            const hash = createHash('sha1').update(data).digest();

            if (this.meetsRequirements(hash)) {
                return { salt, hash };
            }
        }

        return null;
    }

    private meetsRequirements(hash: Buffer): boolean {
        // Check leading zeros (simplified difficulty check)
        let zeros = 0;
        for (const byte of hash) {
            if (byte === 0) {
                zeros += 8;
            } else {
                zeros += Math.clz32(byte) - 24;
                break;
            }
        }
        return zeros >= 20; // Adjust based on network difficulty
    }
}

// Usage
const miningService = new MiningService(provider);

const minerKey = Buffer.from('your-public-key', 'hex');

miningService.startMining(minerKey, async (solution) => {
    console.log('Solution found!');
    console.log('  Epoch:', solution.epochNumber);
    console.log('  Salt:', solution.salt.toString('hex'));

    // Submit the solution
    // await submitSolution(solution);
});

// Later: stop mining
// miningService.stopMining();
```

---

## Template Monitoring

### Watch for New Epochs

```typescript
async function monitorTemplates(
    provider: JSONRpcProvider,
    onNewEpoch: (template: EpochTemplate) => void,
    intervalMs: number = 10000
): Promise<() => void> {
    let lastEpoch = -1n;

    const intervalId = setInterval(async () => {
        try {
            const template = await provider.getEpochTemplate();

            if (template.epochNumber !== lastEpoch) {
                lastEpoch = template.epochNumber;
                onNewEpoch(template);
            }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    }, intervalMs);

    return () => clearInterval(intervalId);
}

// Usage
const stopMonitoring = await monitorTemplates(provider, (template) => {
    console.log('New epoch started:', template.epochNumber);
    console.log('New target:', template.epochTarget.toString('hex'));
});
```

### Check Template Freshness

```typescript
async function isTemplateStale(
    provider: JSONRpcProvider,
    template: EpochTemplate
): Promise<boolean> {
    const current = await provider.getEpochTemplate();
    return current.epochNumber !== template.epochNumber;
}

// Usage in mining loop
const template = await provider.getEpochTemplate();

// ... mining work ...

if (await isTemplateStale(provider, template)) {
    console.log('Template changed, refreshing...');
    // Get new template and restart
}
```

---

## Hashrate Estimation

### Calculate Mining Hashrate

```typescript
class HashrateTracker {
    private hashCount: number = 0;
    private startTime: number = Date.now();
    private samples: number[] = [];

    addHashes(count: number): void {
        this.hashCount += count;
    }

    getHashrate(): number {
        const elapsedSeconds = (Date.now() - this.startTime) / 1000;
        if (elapsedSeconds === 0) return 0;
        return this.hashCount / elapsedSeconds;
    }

    recordSample(): void {
        const hashrate = this.getHashrate();
        this.samples.push(hashrate);

        // Keep last 60 samples
        if (this.samples.length > 60) {
            this.samples.shift();
        }

        // Reset counter
        this.hashCount = 0;
        this.startTime = Date.now();
    }

    getAverageHashrate(): number {
        if (this.samples.length === 0) return 0;
        const sum = this.samples.reduce((a, b) => a + b, 0);
        return sum / this.samples.length;
    }

    formatHashrate(hashrate: number): string {
        if (hashrate >= 1e9) {
            return `${(hashrate / 1e9).toFixed(2)} GH/s`;
        } else if (hashrate >= 1e6) {
            return `${(hashrate / 1e6).toFixed(2)} MH/s`;
        } else if (hashrate >= 1e3) {
            return `${(hashrate / 1e3).toFixed(2)} KH/s`;
        }
        return `${hashrate.toFixed(2)} H/s`;
    }
}

// Usage
const tracker = new HashrateTracker();

// In mining loop
tracker.addHashes(10000);

// Every second
setInterval(() => {
    tracker.recordSample();
    console.log('Hashrate:', tracker.formatHashrate(tracker.getAverageHashrate()));
}, 1000);
```

---

## Mining Statistics

### Track Mining Performance

```typescript
interface MiningStats {
    totalHashes: bigint;
    solutionsFound: number;
    epochsMined: Set<bigint>;
    startTime: number;
    lastSolutionTime?: number;
}

class MiningStatsTracker {
    private stats: MiningStats = {
        totalHashes: 0n,
        solutionsFound: 0,
        epochsMined: new Set(),
        startTime: Date.now(),
    };

    addHashes(count: bigint): void {
        this.stats.totalHashes += count;
    }

    recordSolution(epochNumber: bigint): void {
        this.stats.solutionsFound++;
        this.stats.epochsMined.add(epochNumber);
        this.stats.lastSolutionTime = Date.now();
    }

    getStats(): {
        totalHashes: string;
        solutions: number;
        uniqueEpochs: number;
        uptimeHours: number;
        avgHashesPerSolution: string;
    } {
        const uptimeMs = Date.now() - this.stats.startTime;
        const uptimeHours = uptimeMs / (1000 * 60 * 60);

        const avgHashes = this.stats.solutionsFound > 0
            ? this.stats.totalHashes / BigInt(this.stats.solutionsFound)
            : 0n;

        return {
            totalHashes: this.stats.totalHashes.toString(),
            solutions: this.stats.solutionsFound,
            uniqueEpochs: this.stats.epochsMined.size,
            uptimeHours: Math.round(uptimeHours * 100) / 100,
            avgHashesPerSolution: avgHashes.toString(),
        };
    }
}

// Usage
const statsTracker = new MiningStatsTracker();

// During mining
statsTracker.addHashes(10000n);

// On solution found
statsTracker.recordSolution(100n);

// Display stats
const stats = statsTracker.getStats();
console.log('Mining Stats:');
console.log('  Total hashes:', stats.totalHashes);
console.log('  Solutions found:', stats.solutions);
console.log('  Uptime:', stats.uptimeHours, 'hours');
```

---

## Best Practices

1. **Refresh Templates**: Check for new epochs regularly to avoid wasted work

2. **Batch Processing**: Process hashes in batches for better performance

3. **Monitor Difficulty**: Adjust expectations based on network difficulty

4. **Handle Errors**: Network issues shouldn't crash the mining loop

5. **Track Statistics**: Monitor hashrate and success rate

---

## Next Steps

- [Epoch Overview](./overview.md) - Understanding epochs
- [Epoch Operations](./epoch-operations.md) - Fetching epochs
- [Submitting Epochs](./submitting-epochs.md) - Submit solutions

---

[← Previous: Epoch Operations](./epoch-operations.md) | [Next: Submitting Epochs →](./submitting-epochs.md)
