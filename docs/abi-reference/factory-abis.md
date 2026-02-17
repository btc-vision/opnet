# Factory ABIs

This guide covers factory contract ABIs for deploying tokens and staking pools.

## Overview

Factory contracts allow deploying new token and staking contracts from templates. They provide standardized deployment patterns.

---

## Available Factories

| Factory | Interface | ABI |
|---------|-----------|-----|
| OP20 Factory | `IOP20Factory` | `OP20FactoryAbi` |
| MotoChef Factory | `IMotoChefFactory` | `MotoChefFactoryAbi` |

---

## OP20 Factory

### IOP20Factory

Deploys new OP20 tokens from a template.

```typescript
import {
    OP20FactoryAbi,
    IOP20Factory,
    getContract,
} from 'opnet';

const factory = getContract<IOP20Factory>(
    factoryAddress,
    OP20FactoryAbi,
    provider,
    network
);
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `pauseFactory()` | - | `{ success: boolean }` | Pause the factory |
| `unpauseFactory()` | - | `{ success: boolean }` | Unpause the factory |
| `isPaused()` | - | `{ isPaused: boolean }` | Check if factory is paused |
| `owner()` | - | `{ owner: Address }` | Get the factory owner |
| `deployToken(maxSupply, decimals, name, symbol, initialMintTo, initialMintAmount, freeMintSupply, freeMintPerTx, tokenOwner)` | `bigint, number, string, string, Address, bigint, bigint, bigint, Address` | `{ success: boolean }` | Deploy new token |
| `getTokenDeployer(tokenAddress)` | `Address` | `{ deployer: Address }` | Get token deployer |
| `getTokenOwner(tokenAddress)` | `Address` | `{ owner: Address }` | Get token owner |
| `updateTokenOwner(tokenAddress, newOwner)` | `Address, Address` | `{ success: boolean }` | Update token owner |
| `getUserTokens(deployer)` | `Address` | `{ tokens: Uint8Array }` | Get tokens by deployer |
| `getDeploymentInfo(deployer)` | `Address` | `{ has: boolean, token: Address, block: bigint }` | Get deployment info |
| `getDeploymentsCount()` | - | `{ count: number }` | Total deployments |
| `getDeploymentByIndex(index)` | `number` | `{ deployer: Address, token: Address, block: bigint }` | Get deployment by index |
| `onOP20Received(operator, from, amount, data)` | `Address, Address, bigint, Uint8Array` | `{ selector: Uint8Array }` | OP20 receive callback |

### Events

| Event | Fields |
|-------|--------|
| `TokenDeployed` | `deployer: Address, token: Address, name: string, symbol: string` |
| `FactoryPaused` | `by: Address` |
| `FactoryUnpaused` | `by: Address` |

### Example: Deploy Token

```typescript
const result = await factory.deployToken(
    21_000_000_00000000n,               // maxSupply
    8,                                   // decimals
    'My Token',                          // name
    'MTK',                               // symbol
    Address.fromString('0x...'),         // initialMintTo
    1_000_000_00000000n,                 // initialMintAmount
    0n,                                  // freeMintSupply
    0n,                                  // freeMintPerTx
    Address.fromString('0x...'),         // tokenOwner
);

console.log('Deploy success:', result.properties.success);
```

---

## MotoChef Factory

### IMotoChefFactory

Deploys new tokens and MotoChef staking contracts from templates. Extends the OP20 Factory with MotoChef-specific deployment methods.

```typescript
import {
    MotoChefFactoryAbi,
    IMotoChefFactory,
    getContract,
} from 'opnet';

const factory = getContract<IMotoChefFactory>(
    factoryAddress,
    MotoChefFactoryAbi,
    provider,
    network
);
```

### Additional Methods (beyond OP20 Factory)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `initialize()` | - | `{ success: boolean }` | Initialize the factory |
| `deployMotoChef(...)` | See below | `{ success: boolean }` | Deploy a MotoChef staking contract |
| `getTokenMotoChef(tokenAddress)` | `Address` | `{ motoChefAddress: Address }` | Get MotoChef for a token |

The `deployMotoChef` method takes the following parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokenPerBlock` | `bigint` | Reward tokens per block |
| `bonusEndBlock` | `bigint` | Block number when bonus period ends |
| `bonusMultiplier` | `bigint` | Multiplier during bonus period |
| `BTCAllocPoint` | `bigint` | BTC pool allocation points |
| `tokenAddress` | `Address` | Token address for the farm |
| `tokenAllocPoint` | `bigint` | Token pool allocation points |
| `userBTCFeePercentage` | `bigint` | User BTC fee percentage |
| `userFeeRecipient` | `string` | Fee recipient address (string) |
| `farmName` | `string` | Name of the farm |
| `farmBanner` | `string` | Banner URL for the farm |
| `additionalPoolTokens` | `Address[]` | Additional pool token addresses |
| `additionalPoolAllocPoints` | `bigint[]` | Additional pool allocation points |

The `getDeploymentInfo` return type includes an additional `motoChef: Address` field compared to the OP20 Factory. Similarly, `getDeploymentByIndex` also returns a `motoChef: Address` field.

### Additional Events

| Event | Fields |
|-------|--------|
| `TokenDeployed` | `deployer: Address, token: Address, name: string, symbol: string` |
| `MotoChefDeployed` | `deployer: Address, token: Address, motoChef: Address, userBTCFeePercentage: bigint, farmName: string` |
| `FeeRecipientsUpdated` | `motoSwapFeeRecipient: string, opnetFeeRecipient: string` |
| `FactoryPaused` | `by: Address` |
| `FactoryUnpaused` | `by: Address` |

### Example: Deploy MotoChef

```typescript
const result = await factory.deployMotoChef(
    1000000n,                            // tokenPerBlock
    100000n,                             // bonusEndBlock
    2n,                                  // bonusMultiplier
    1000n,                               // BTCAllocPoint
    Address.fromString('0x...'),         // tokenAddress
    2000n,                               // tokenAllocPoint
    5n,                                  // userBTCFeePercentage
    'bc1q...',                           // userFeeRecipient
    'My Farm',                           // farmName
    'https://example.com/banner.png',    // farmBanner
    [],                                  // additionalPoolTokens
    [],                                  // additionalPoolAllocPoints
);

console.log('Deploy success:', result.properties.success);
```

---

## Template Contracts

### ITemplateOP20

The template used by OP20 Factory.

```typescript
import {
    TemplateOP20Abi,
    ITemplateOP20,
    getContract,
} from 'opnet';
```

Template tokens extend the OP20 interface with additional methods including `initialize`, `mint`, `grantMinterRole`, `revokeMinterRole`, `isMinter`, `getTokenOwner`, `getFactoryAddress`, `deployer`, `transferTokenOwner`, `freeMint`, `getFreeMintInfo`, and `onOP20Received`.

### ITemplateMotoChef

The template used by MotoChef Factory.

```typescript
import {
    TemplateMotoChefAbi,
    getContract,
} from 'opnet';
```

---

## Factory Pattern Usage

### List All Deployed Tokens

```typescript
async function getAllDeployedTokens(
    factory: IOP20Factory
): Promise<{ deployer: Address; token: Address; block: bigint }[]> {
    const countResult = await factory.getDeploymentsCount();
    const count = countResult.properties.count;
    const deployments: { deployer: Address; token: Address; block: bigint }[] = [];

    for (let i = 0; i < count; i++) {
        const deployment = await factory.getDeploymentByIndex(i);
        deployments.push({
            deployer: deployment.properties.deployer,
            token: deployment.properties.token,
            block: deployment.properties.block,
        });
    }

    return deployments;
}
```

### Deploy Token with Factory

```typescript
async function deployTokenViaFactory(
    factory: IOP20Factory,
    config: {
        name: string;
        symbol: string;
        decimals: number;
        maxSupply: bigint;
        initialMintTo: Address;
        initialMintAmount: bigint;
        tokenOwner: Address;
    },
    wallet: Wallet
): Promise<void> {
    // Deploy token (factory handles initialization and initial minting)
    const simulation = await factory.deployToken(
        config.maxSupply,
        config.decimals,
        config.name,
        config.symbol,
        config.initialMintTo,
        config.initialMintAmount,
        0n,                  // freeMintSupply
        0n,                  // freeMintPerTx
        config.tokenOwner,
    );

    // Note: The simulation call throws if the contract reverts.
    // Use try/catch around the entire function to handle reverts gracefully.

    const receipt = await simulation.sendTransaction({
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        refundTo: wallet.p2tr,
        maximumAllowedSatToSpend: 50000n,
        network: network,
        feeRate: 10,
    });

    console.log('Deploy TX:', receipt.transactionId);
}
```

---

## Events

### TokenDeployed

Emitted when a new token is deployed via either factory.

```typescript
type TokenDeployedEvent = {
    readonly deployer: Address;
    readonly token: Address;
    readonly name: string;
    readonly symbol: string;
};
```

### MotoChefDeployed

Emitted when a new MotoChef is deployed (MotoChef Factory only).

```typescript
type MotoChefDeployedEvent = {
    readonly deployer: Address;
    readonly token: Address;
    readonly motoChef: Address;
    readonly userBTCFeePercentage: bigint;
    readonly farmName: string;
};
```

### FactoryPaused / FactoryUnpaused

Emitted when the factory is paused or unpaused.

```typescript
type FactoryPausedEvent = {
    readonly by: Address;
};

type FactoryUnpausedEvent = {
    readonly by: Address;
};
```

### FeeRecipientsUpdated

Emitted when fee recipients are updated (MotoChef Factory only).

```typescript
type FeeRecipientsUpdatedEvent = {
    readonly motoSwapFeeRecipient: string;
    readonly opnetFeeRecipient: string;
};
```

---

## Generic Staking ABI

A simple staking interface for basic stake/unstake/claim functionality.

```typescript
import { STAKING_ABI } from 'opnet';
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `stake(amount)` | `bigint` | - | Stake tokens |
| `unstake()` | - | - | Unstake all tokens |
| `claim()` | - | - | Claim pending rewards |
| `stakedAmount(address)` | `Address` | `bigint` | Get staked amount for address |
| `stakedReward(address)` | `Address` | `bigint` | Get pending reward for address |
| `rewardPool()` | - | `bigint` | Get total reward pool |
| `totalStaked()` | - | `bigint` | Get total staked across all users |

### Staking Events

```typescript
// Stake event
interface StakeEvent {
    amount: bigint;
}

// Unstake event
interface UnstakeEvent {
    amount: bigint;
}

// Claim event
interface ClaimEvent {
    amount: bigint;
}
```

### Example: Stake and Check Rewards

```typescript
import {
    STAKING_ABI,
    getContract,
    IStackingContract,
    JSONRpcProvider,
} from 'opnet';
import { networks } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';

const network = networks.regtest;
const provider: JSONRpcProvider = new JSONRpcProvider({
    url: 'https://regtest.opnet.org',
    network,
});

const stakingAddress: string = '0x...'; // Contract address
const userAddress: Address = Address.fromString('0x...');

const staking = getContract<IStackingContract>(
    stakingAddress,
    STAKING_ABI,
    provider,
    network
);

// Check staked amount
const staked = await staking.stakedAmount(userAddress);
console.log('Staked:', staked.properties.amount);

// Check pending rewards
const rewards = await staking.stakedReward(userAddress);
console.log('Pending rewards:', rewards.properties.amount);

// Stake tokens
try {
    const stakeSimulation = await staking.stake(1000000000n);
    await stakeSimulation.sendTransaction({
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        refundTo: wallet.p2tr,
        maximumAllowedSatToSpend: 50000n,
        network: network,
        feeRate: 10,
    });
} catch (error) {
    console.error('Stake failed:', error);
}

// Claim rewards
try {
    const claimSimulation = await staking.claim();
    await claimSimulation.sendTransaction({
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        refundTo: wallet.p2tr,
        maximumAllowedSatToSpend: 50000n,
        network: network,
        feeRate: 10,
    });
} catch (error) {
    console.error('Claim failed:', error);
}
```

---

## Best Practices

1. **Verify Template**: Check template address before deploying

2. **Test on Regtest**: Always test deployments on regtest first

3. **Track Deployments**: Keep record of deployed contract addresses

4. **Set Reasonable Supply**: Consider tokenomics before setting max supply

5. **Initialize Properly**: Configure tokens immediately after deployment

---

## Next Steps

- [Stablecoin ABIs](./stablecoin-abis.md) - Stablecoin interfaces
- [Custom ABIs](./custom-abis.md) - Creating custom ABIs
- [Deployment Examples](../examples/deployment-examples.md) - Deployment code

---

[← Previous: MotoSwap ABIs](./motoswap-abis.md) | [Next: Stablecoin ABIs →](./stablecoin-abis.md)
