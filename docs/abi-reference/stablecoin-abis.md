# Stablecoin ABIs

This guide covers stablecoin contract ABIs.

## Overview

OPNet supports various stablecoin patterns including oracle-based, multi-collateral, and pegged implementations.

---

## Available Stablecoin ABIs

| Contract | Interface | ABI |
|----------|-----------|-----|
| Oracle Coin | `IOracleCoinExample` | `ORACLE_COIN` |
| Stable Coin | `IStableCoinExample` | `STABLE_COIN` |
| Pegged Coin | `IPeggedCoinExample` | `PEGGED_COIN` |

---

## Oracle Coin

### IOracleCoinExample

Stablecoin backed by oracle price feeds.

```typescript
import {
    ORACLE_COIN,
    IOracleCoinExample,
    getContract,
} from 'opnet';

const oracleCoin = getContract<IOracleCoinExample>(
    coinAddress,
    ORACLE_COIN,
    provider,
    network
);
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `mint(collateralAmount)` | `bigint` | `bigint` | Mint with collateral |
| `burn(amount)` | `bigint` | `bigint` | Burn and get collateral |
| `getPrice()` | - | `bigint` | Current oracle price |
| `getCollateralRatio()` | - | `bigint` | Required collateral % |
| `getCollateralBalance(user)` | `Address` | `bigint` | User's collateral |

### Example: Mint Oracle Coin

```typescript
// Approve collateral
await collateralToken.increaseAllowance(coinAddress, collateralAmount, txParams);

// Mint stablecoin
const result = await oracleCoin.mint(collateralAmount, {
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    feeRate: 10,
});

console.log('Minted:', result.properties.mintedAmount);
```

---

## Stable Coin (Multi-Collateral)

### IStableCoinExample

Multi-collateral stablecoin supporting multiple assets.

```typescript
import {
    STABLE_COIN,
    IStableCoinExample,
    getContract,
} from 'opnet';

const stableCoin = getContract<IStableCoinExample>(
    coinAddress,
    STABLE_COIN,
    provider,
    network
);
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `depositCollateral(token, amount)` | `Address, bigint` | - | Deposit collateral |
| `withdrawCollateral(token, amount)` | `Address, bigint` | - | Withdraw collateral |
| `mint(amount)` | `bigint` | - | Mint against collateral |
| `burn(amount)` | `bigint` | - | Burn stablecoin |
| `getCollateralValue(user)` | `Address` | `bigint` | Total collateral value |
| `getSupportedCollaterals()` | - | `Address[]` | List of accepted tokens |
| `getHealthFactor(user)` | `Address` | `bigint` | User's health factor |

### Example: Multi-Collateral Usage

```typescript
// Deposit multiple collaterals
await stableCoin.depositCollateral(btcToken, btcAmount, txParams);
await stableCoin.depositCollateral(ethToken, ethAmount, txParams);

// Check health factor
const health = await stableCoin.getHealthFactor(userAddress);
console.log('Health factor:', health.properties.factor);

// Mint stablecoin
if (health.properties.factor > 150n) {
    await stableCoin.mint(mintAmount, txParams);
}
```

---

## Pegged Coin

### IPeggedCoinExample

1:1 pegged stablecoin (e.g., wrapped stablecoin).

```typescript
import {
    PEGGED_COIN,
    IPeggedCoinExample,
    getContract,
} from 'opnet';

const peggedCoin = getContract<IPeggedCoinExample>(
    coinAddress,
    PEGGED_COIN,
    provider,
    network
);
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `wrap(amount)` | `bigint` | - | Wrap underlying token |
| `unwrap(amount)` | `bigint` | - | Unwrap to underlying |
| `underlyingToken()` | - | `Address` | Get underlying token |
| `totalBacking()` | - | `bigint` | Total backing amount |

### Example: Wrap/Unwrap

```typescript
// Wrap underlying token
await underlyingToken.increaseAllowance(peggedCoinAddress, amount, txParams);
await peggedCoin.wrap(amount, txParams);

// Later: unwrap
await peggedCoin.unwrap(amount, txParams);
```

---

## Collateral Management

### Check Collateral Health

```typescript
async function checkCollateralHealth(
    stableCoin: IStableCoinExample,
    userAddress: Address
): Promise<{
    collateralValue: bigint;
    debtValue: bigint;
    healthFactor: bigint;
    isHealthy: boolean;
}> {
    const [collateral, debt, health] = await Promise.all([
        stableCoin.getCollateralValue(userAddress),
        stableCoin.balanceOf(userAddress),
        stableCoin.getHealthFactor(userAddress),
    ]);

    return {
        collateralValue: collateral.properties.value,
        debtValue: debt.properties.balance,
        healthFactor: health.properties.factor,
        isHealthy: health.properties.factor >= 100n,
    };
}
```

### Liquidation Check

```typescript
async function canLiquidate(
    stableCoin: IStableCoinExample,
    userAddress: Address,
    liquidationThreshold: bigint = 110n
): Promise<boolean> {
    const health = await stableCoin.getHealthFactor(userAddress);
    return health.properties.factor < liquidationThreshold;
}
```

---

## Events

### CollateralDeposited

```typescript
interface CollateralDepositedEvent {
    user: Address;
    token: Address;
    amount: bigint;
}
```

### CollateralWithdrawn

```typescript
interface CollateralWithdrawnEvent {
    user: Address;
    token: Address;
    amount: bigint;
}
```

### Liquidated

```typescript
interface LiquidatedEvent {
    user: Address;
    liquidator: Address;
    debtCovered: bigint;
    collateralSeized: bigint;
}
```

---

## Best Practices

1. **Monitor Health Factor**: Keep health factor above safe threshold

2. **Diversify Collateral**: Use multiple collateral types when supported

3. **Watch Oracle Prices**: Be aware of price volatility

4. **Set Up Alerts**: Monitor positions for liquidation risk

5. **Test Thoroughly**: Test all scenarios on regtest first

---

## Next Steps

- [Custom ABIs](./custom-abis.md) - Creating custom ABIs
- [OP20 ABI](./op20-abi.md) - Token standard
- [MotoSwap ABIs](./motoswap-abis.md) - DEX interfaces

---

[← Previous: Factory ABIs](./factory-abis.md) | [Next: Custom ABIs →](./custom-abis.md)
