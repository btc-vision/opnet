# Factory ABIs

This guide covers factory contract ABIs for deploying tokens and staking pools.

## Overview

Factory contracts allow deploying new token and staking contracts from templates. They provide standardized deployment patterns.

---

## Available Factories

| Factory | Interface | ABI |
|---------|-----------|-----|
| OP20 Factory | `IOP20Factory` | `OP20_FACTORY_ABI` |
| MotoChef Factory | `IMotoChefFactory` | `MOTOCHEF_FACTORY_ABI` |

---

## OP20 Factory

### IOP20Factory

Deploys new OP20 tokens from a template.

```typescript
import {
    OP20_FACTORY_ABI,
    IOP20Factory,
    getContract,
} from 'opnet';

const factory = getContract<IOP20Factory>(
    factoryAddress,
    OP20_FACTORY_ABI,
    provider,
    network
);
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `deployToken(name, symbol, decimals, maxSupply)` | `string, string, number, bigint` | `Address` | Deploy new token |
| `getTemplate()` | - | `Address` | Get template address |
| `deployedTokens(index)` | `bigint` | `Address` | Get token by index |
| `deployedTokensCount()` | - | `bigint` | Total deployed tokens |

### Example: Deploy Token

```typescript
const result = await factory.deployToken(
    'My Token',
    'MTK',
    8,
    1000000000000000n, // 10M tokens
    {
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        refundTo: wallet.p2tr,
        feeRate: 10,
    }
);

console.log('New token address:', result.properties.tokenAddress);
```

---

## MotoChef Factory

### IMotoChefFactory

Deploys new staking pools from a template.

```typescript
import {
    MOTOCHEF_FACTORY_ABI,
    IMotoChefFactory,
    getContract,
} from 'opnet';

const factory = getContract<IMotoChefFactory>(
    factoryAddress,
    MOTOCHEF_FACTORY_ABI,
    provider,
    network
);
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `deployPool(stakingToken, rewardToken, rewardRate)` | `Address, Address, bigint` | `Address` | Deploy staking pool |
| `getTemplate()` | - | `Address` | Get template address |
| `deployedPools(index)` | `bigint` | `Address` | Get pool by index |
| `deployedPoolsCount()` | - | `bigint` | Total deployed pools |

### Example: Deploy Staking Pool

```typescript
const result = await factory.deployPool(
    stakingToken,
    rewardToken,
    1000000n, // Reward rate per block
    {
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        refundTo: wallet.p2tr,
        feeRate: 10,
    }
);

console.log('New pool address:', result.properties.poolAddress);
```

---

## Template Contracts

### ITemplateOP20

The template used by OP20 Factory.

```typescript
import {
    TEMPLATE_OP20_ABI,
    ITemplateOP20,
    getContract,
} from 'opnet';
```

Template tokens include initialization methods for the factory to configure.

### ITemplateMotoChef

The template used by MotoChef Factory.

```typescript
import {
    TEMPLATE_MOTOCHEF_ABI,
    ITemplateMotoChef,
    getContract,
} from 'opnet';
```

---

## Factory Pattern Usage

### List All Deployed Tokens

```typescript
async function getAllDeployedTokens(
    factory: IOP20Factory
): Promise<Address[]> {
    const count = await factory.deployedTokensCount();
    const tokens: Address[] = [];

    for (let i = 0n; i < count.properties.count; i++) {
        const token = await factory.deployedTokens(i);
        tokens.push(token.properties.tokenAddress);
    }

    return tokens;
}
```

### Deploy and Initialize Token

```typescript
async function deployAndConfigureToken(
    factory: IOP20Factory,
    config: {
        name: string;
        symbol: string;
        decimals: number;
        maxSupply: bigint;
        initialMint?: bigint;
        mintTo?: Address;
    },
    wallet: Wallet
): Promise<Address> {
    // Deploy token
    const deployResult = await factory.deployToken(
        config.name,
        config.symbol,
        config.decimals,
        config.maxSupply,
        {
            signer: wallet.keypair,
            mldsaSigner: wallet.mldsaKeypair,
            refundTo: wallet.p2tr,
            feeRate: 10,
        }
    );

    const tokenAddress = deployResult.properties.tokenAddress;

    // If initial mint requested
    if (config.initialMint && config.mintTo) {
        const token = getContract<IOP20SContract>(
            tokenAddress.toHex(),
            OP_20S_ABI,
            provider,
            network
        );

        await token.mint(config.mintTo, config.initialMint, {
            signer: wallet.keypair,
            mldsaSigner: wallet.mldsaKeypair,
            refundTo: wallet.p2tr,
            feeRate: 10,
        });
    }

    return tokenAddress;
}
```

---

## Events

### TokenDeployed

Emitted when a new token is deployed.

```typescript
interface TokenDeployedEvent {
    deployer: Address;
    tokenAddress: Address;
    name: string;
    symbol: string;
}
```

### PoolDeployed

Emitted when a new staking pool is deployed.

```typescript
interface PoolDeployedEvent {
    deployer: Address;
    poolAddress: Address;
    stakingToken: Address;
    rewardToken: Address;
}
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
const provider: JSONRpcProvider = new JSONRpcProvider(
    'https://regtest.opnet.org',
    network
);

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
const stakeSimulation = await staking.stake(1000000000n);
if (!stakeSimulation.revert) {
    await stakeSimulation.sendTransaction({
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaSigner,
        refundTo: wallet.p2tr,
        maximumAllowedSatToSpend: 50000n,
        network: network,
        feeRate: 10,
    });
}

// Claim rewards
const claimSimulation = await staking.claim();
if (!claimSimulation.revert) {
    await claimSimulation.sendTransaction({
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaSigner,
        refundTo: wallet.p2tr,
        maximumAllowedSatToSpend: 50000n,
        network: network,
        feeRate: 10,
    });
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
