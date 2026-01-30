# MotoSwap ABIs

This guide covers the MotoSwap DEX contract ABIs.

## Overview

MotoSwap is a decentralized exchange on OPNet. It consists of factory, router, pool, and staking contracts.

---

## Available Contracts

| Contract | Interface | ABI |
|----------|-----------|-----|
| Factory | `IMotoswapFactoryContract` | `MotoSwapFactoryAbi` |
| Router | `IMotoswapRouterContract` | `MOTOSWAP_ROUTER_ABI` |
| Pool | `IMotoswapPoolContract` | `MotoswapPoolAbi` |
| Staking | `IMotoswapStakingContract` | `MOTOSWAP_STAKING_ABI` |
| Native Swap | `INativeSwapContract` | `NativeSwapAbi` |
| MOTO Token | `IMoto` | `MOTO_ABI` |

---

## Factory Contract

### IMotoswapFactoryContract

Creates and manages liquidity pools.

```typescript
import {
    MotoSwapFactoryAbi,
    IMotoswapFactoryContract,
    getContract,
} from 'opnet';

const factory = getContract<IMotoswapFactoryContract>(
    factoryAddress,
    MotoSwapFactoryAbi,
    provider,
    network
);
```

### Factory Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getPool(tokenA, tokenB)` | `Address, Address` | `Address` | Get pool address |
| `createPool(tokenA, tokenB)` | `Address, Address` | `Address` | Create new pool |
| `allPools(index)` | `bigint` | `Address` | Get pool by index |
| `allPoolsLength()` | - | `bigint` | Total pool count |

### Example: Get Pool Address

```typescript
const pool = await factory.getPool(tokenA, tokenB);
console.log('Pool address:', pool.properties.pool.toHex());
```

---

## Router Contract

### IMotoswapRouterContract

Handles swaps and liquidity operations.

```typescript
import {
    MOTOSWAP_ROUTER_ABI,
    IMotoswapRouterContract,
    getContract,
} from 'opnet';

const router = getContract<IMotoswapRouterContract>(
    routerAddress,
    MOTOSWAP_ROUTER_ABI,
    provider,
    network
);
```

### Router Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `addLiquidity(...)` | Multiple | Add liquidity to pool |
| `removeLiquidity(...)` | Multiple | Remove liquidity |
| `swapExactTokensForTokens(...)` | Multiple | Swap exact input |
| `swapTokensForExactTokens(...)` | Multiple | Swap for exact output |
| `getAmountsOut(amountIn, path)` | `bigint, Address[]` | Quote output amounts |
| `getAmountsIn(amountOut, path)` | `bigint, Address[]` | Quote input amounts |

### Example: Get Swap Quote

```typescript
const amountIn = 1000000000n; // 10 tokens
const path = [tokenA, tokenB];

const quote = await router.getAmountsOut(amountIn, path);
console.log('Output amounts:', quote.properties.amounts);
```

### Example: Execute Swap

```typescript
const amountIn = 1000000000n;
const amountOutMin = 900000000n; // 10% slippage
const path = [tokenA, tokenB];
const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

const result = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    recipient,
    deadline,
    {
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        refundTo: wallet.p2tr,
        feeRate: 10,
    }
);
```

---

## Pool Contract

### IMotoswapPoolContract

Represents a liquidity pool.

```typescript
import {
    MotoswapPoolAbi,
    IMotoswapPoolContract,
    getContract,
} from 'opnet';

const pool = getContract<IMotoswapPoolContract>(
    poolAddress,
    MotoswapPoolAbi,
    provider,
    network
);
```

### Pool Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `token0()` | `Address` | First token |
| `token1()` | `Address` | Second token |
| `getReserves()` | `(bigint, bigint, bigint)` | Pool reserves |
| `totalSupply()` | `bigint` | LP token supply |
| `balanceOf(owner)` | `bigint` | LP token balance |
| `price0CumulativeLast()` | `bigint` | Price accumulator |
| `price1CumulativeLast()` | `bigint` | Price accumulator |

### Example: Get Pool Reserves

```typescript
const reserves = await pool.getReserves();
console.log('Reserve 0:', reserves.properties.reserve0);
console.log('Reserve 1:', reserves.properties.reserve1);
console.log('Timestamp:', reserves.properties.blockTimestampLast);
```

---

## Staking Contract

### IMotoswapStakingContract

Handles MOTO token staking and rewards.

```typescript
import {
    MOTOSWAP_STAKING_ABI,
    IMotoswapStakingContract,
    getContract,
} from 'opnet';

const staking = getContract<IMotoswapStakingContract>(
    stakingAddress,
    MOTOSWAP_STAKING_ABI,
    provider,
    network
);
```

### Staking Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `stake(amount)` | `bigint` | Stake tokens |
| `unstake(amount)` | `bigint` | Unstake tokens |
| `claimRewards()` | - | Claim pending rewards |
| `pendingRewards(user)` | `Address` | Get pending rewards |
| `stakedBalance(user)` | `Address` | Get staked balance |

---

## Native Swap Contract

### INativeSwapContract

Native BTC to token swap mechanism with liquidity provider queue system.

> **⚠️ WARNING: Examples Are Simplified**
>
> The NativeSwap examples below are **incomplete and for demonstration purposes only**. They do NOT include:
>
> - **Reorg protection** - Bitcoin reorganizations can invalidate reservations
> - **Confirmation tracking** - Waiting for sufficient confirmations before swapping
> - **Error recovery** - Handling failed or stuck reservations
> - **Race condition handling** - Multiple users competing for same liquidity
> - **Timeout management** - Reservations expire and must be handled
>
> **Production implementations require significant additional logic to be user-safe.** These examples demonstrate the basic API usage only. Consult the OPNet team or review production implementations before deploying.

```typescript
import {
    NativeSwapAbi,
    INativeSwapContract,
    getContract,
} from 'opnet';

const nativeSwap = getContract<INativeSwapContract>(
    nativeSwapAddress,
    NativeSwapAbi,
    provider,
    network
);
```

### Trading Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `reserve(token, maximumAmountIn, minimumAmountOut, forLP, activationDelay)` | `Address, bigint, bigint, boolean, number` | Reserve tokens for swap |
| `swap(token)` | `Address` | Execute swap after reservation |
| `getQuote(token, satoshisIn)` | `Address, bigint` | Get swap quote |
| `getReserve(token)` | `Address` | Get pool reserves |

### Liquidity Provider Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `listLiquidity(token, receiver, receiverStr, amountIn, priority)` | `Address, Uint8Array, string, bigint, boolean` | List tokens for sale |
| `cancelListing(token)` | `Address` | Cancel listing |
| `withdrawListing(token)` | `Address` | Withdraw in emergency mode |
| `getProviderDetails(token)` | `Address` | Get your provider info |
| `getProviderDetailsById(providerId)` | `bigint` | Get provider by ID |
| `getQueueDetails(token)` | `Address` | Get queue state |
| `getPriorityQueueCost()` | - | Get priority queue fee |

### Pool Creation Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `createPool(token, floorPrice, initialLiquidity, receiver, receiverStr, antiBotEnabledFor, antiBotMaximumTokensPerReservation, maxReservesIn5BlocksPercent, poolType, amplification, pegStalenessThreshold)` | Multiple | Create new liquidity pool |
| `getPoolInfo(token)` | `Address` | Get pool type and settings |
| `getAntibotSettings(token)` | `Address` | Get anti-bot config |

### Admin Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `setFees(reservationBaseFee, priorityQueueBaseFee)` | `bigint, bigint` | Set fee parameters |
| `setStakingContractAddress(address)` | `Address` | Set staking contract |
| `setFeesAddress(address)` | `string` | Set fees collection address |
| `pause()` | - | Pause contract |
| `unpause()` | - | Unpause contract |
| `activateWithdrawMode()` | - | Enable emergency withdrawals |
| `isPaused()` | - | Check pause state |
| `isWithdrawModeActive()` | - | Check withdraw mode |
| `getFees()` | - | Get current fees |

### Native Swap Events

```typescript
// Swap executed
interface SwapExecutedEvent {
    buyer: Address;
    amountIn: bigint;
    amountOut: bigint;
    totalFees: bigint;
}

// Liquidity listed
interface LiquidityListedEvent {
    totalLiquidity: bigint;
    provider: string;
}

// Reservation created
interface ReservationCreatedEvent {
    expectedAmountOut: bigint;
    totalSatoshis: bigint;
}

// Provider fulfilled
interface ProviderFulfilledEvent {
    providerId: bigint;
    removalCompleted: boolean;
    stakedAmount: bigint;
}
```

### Example: Get Quote and Reserve

```typescript
import {
    INativeSwapContract,
    OPNetEvent,
    ReservationCreatedEvent,
    TransactionOutputFlags,
    TransactionParameters,
} from 'opnet';
import { PsbtOutputExtended } from '@btc-vision/bitcoin';

// Fee recipient address (required for reservations)
const FEE_RECIPIENT = 'bcrt1q...fee-address...';

// Get quote for 100,000 satoshis
const token = Address.fromString('0x...token...');
const maximumAmountIn = 100_000n;

const quote = await nativeSwap.getQuote(token, maximumAmountIn);
console.log('Tokens out:', quote.properties.tokensOut);
console.log('Required sats:', quote.properties.requiredSatoshis);
console.log('Price:', quote.properties.price);

// Calculate minimum output with 5% slippage
const minimumAmountOut = quote.properties.tokensOut * 95n / 100n;

// Create fee output (required)
const feeOutput: PsbtOutputExtended = {
    address: FEE_RECIPIENT,
    value: 10_000,
};

// Set transaction details with fee output
nativeSwap.setTransactionDetails({
    inputs: [],
    outputs: [
        {
            to: feeOutput.address,
            value: BigInt(feeOutput.value),
            index: 1,
            scriptPubKey: undefined,
            flags: TransactionOutputFlags.hasTo,
        },
    ],
});

// Reserve tokens
// Parameters: token, maximumAmountIn, minimumAmountOut, forLP, activationDelay
const simulation = await nativeSwap.reserve(
    token,
    maximumAmountIn,
    minimumAmountOut,
    false,  // forLP - set true if reserving for LP position
    0,      // activationDelay - blocks to wait before swap
);

if (simulation.revert) {
    throw new Error(`Reservation failed: ${simulation.revert}`);
}

// Get reserved amount from event
const event = simulation.events[
    simulation.events.length - 1
] as OPNetEvent<ReservationCreatedEvent>;

console.log('Expected tokens out:', event.properties.expectedAmountOut);

// Send transaction with fee output
const params: TransactionParameters = {
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.address.p2tr(network),
    priorityFee: 0n,
    feeRate: 10,
    maximumAllowedSatToSpend: 10_000n,
    network: network,
    extraOutputs: [feeOutput],  // Include fee output
};

const result = await simulation.sendTransaction(params);
console.log('Reserved:', result.transactionId);
console.log('Tokens reserved:', event.properties.expectedAmountOut);
```

### Example: Execute Swap After Reservation

After reserving tokens, you must execute the swap by sending BTC to the liquidity providers.

```typescript
import {
    INativeSwapContract,
    JSONRpcProvider,
    Swap,
    TransactionOutputFlags,
    TransactionParameters,
} from 'opnet';
import { PsbtOutputExtended } from '@btc-vision/bitcoin';

interface Recipient {
    address: string;
    amount: bigint;
}

// Get recipients from reservation transaction
async function getRecipients(
    provider: JSONRpcProvider,
    contract: INativeSwapContract,
    reservationTxId: string,
): Promise<Recipient[]> {
    const tx = await provider.getTransactionReceipt(reservationTxId);
    const decodedEvents = contract.decodeEvents(tx.events);

    return decodedEvents
        .filter((event) => event.type === 'LiquidityReserved')
        .map((event) => ({
            amount: (event.properties as any).satoshisAmount,
            address: (event.properties as any).depositAddress,
        }));
}

// Execute swap
async function executeSwap(
    provider: JSONRpcProvider,
    wallet: Wallet,
    contract: INativeSwapContract,
    token: Address,
    recipients: Recipient[],
): Promise<string> {
    // Build outputs for LP payments
    const outputs: PsbtOutputExtended[] = [];
    const transactionOutputs = [];
    const totalAmount = recipients.reduce((acc, r) => acc + r.amount, 0n);

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];

        transactionOutputs.push({
            to: recipient.address,
            value: recipient.amount,
            index: i + 1,
            flags: TransactionOutputFlags.hasTo,
            scriptPubKey: undefined,
        });

        outputs.push({
            address: recipient.address,
            value: Number(recipient.amount),
        });
    }

    // Set transaction details with recipient outputs
    contract.setTransactionDetails({
        inputs: [],
        outputs: transactionOutputs,
    });

    // Execute swap
    const simulation: Swap = await contract.swap(token);

    if (simulation.revert) {
        throw new Error(`Swap failed: ${simulation.revert}`);
    }

    const params: TransactionParameters = {
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        refundTo: wallet.address.p2tr(provider.getNetwork()),
        priorityFee: 0n,
        feeRate: 10,
        maximumAllowedSatToSpend: totalAmount + 10_000n,
        network: provider.getNetwork(),
        extraOutputs: outputs,  // Include LP payment outputs
    };

    const tx = await simulation.sendTransaction(params);
    return tx.transactionId;
}

// Usage
const recipients = await getRecipients(provider, nativeSwap, reservationTxId);
const swapTxId = await executeSwap(provider, wallet, nativeSwap, token, recipients);
console.log('Swap executed:', swapTxId);
```

### Example: List Liquidity

```typescript
const token = Address.fromString('0x...token...');
const receiverPubKey = new Uint8Array(33); // 33 byte compressed pubkey
const receiverAddress = 'bcrt1p...your-btc-address...';
const amount = 1_000_000_000_000n; // Amount to list
const usePriorityQueue = true;

const simulation = await nativeSwap.listLiquidity(
    token,
    receiverPubKey,
    receiverAddress,
    amount,
    usePriorityQueue,
);

if (simulation.revert) {
    throw new Error(`List liquidity failed: ${simulation.revert}`);
}

const result = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.address.p2tr(network),
    maximumAllowedSatToSpend: 50_000n,
    network: network,
    feeRate: 10,
});

console.log('Liquidity listed:', result.transactionId);
```

---

## MOTO Token

### IMoto

The native MOTO token interface.

```typescript
import {
    MOTO_ABI,
    IMoto,
    getContract,
} from 'opnet';

const moto = getContract<IMoto>(
    motoAddress,
    MOTO_ABI,
    provider,
    network
);
```

MOTO extends OP20 with additional staking-related functionality.

---

## Complete Swap Example

```typescript
import {
    getContract,
    MOTOSWAP_ROUTER_ABI,
    IMotoswapRouterContract,
    OP_20_ABI,
    IOP20Contract,
} from 'opnet';

async function executeSwap(
    provider: JSONRpcProvider,
    network: Network,
    routerAddress: string,
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    slippagePercent: number,
    wallet: Wallet
): Promise<void> {
    // Get router
    const router = getContract<IMotoswapRouterContract>(
        routerAddress,
        MOTOSWAP_ROUTER_ABI,
        provider,
        network
    );

    // Get token contract for approval
    const tokenInContract = getContract<IOP20Contract>(
        tokenIn,
        OP_20_ABI,
        provider,
        network
    );

    // Approve router
    await tokenInContract.increaseAllowance(
        Address.fromString(routerAddress),
        amountIn,
        {
            signer: wallet.keypair,
            mldsaSigner: wallet.mldsaKeypair,
            refundTo: wallet.p2tr,
            feeRate: 10,
        }
    );

    // Get quote
    const path = [
        Address.fromString(tokenIn),
        Address.fromString(tokenOut),
    ];
    const quote = await router.getAmountsOut(amountIn, path);
    const expectedOut = quote.properties.amounts[1];

    // Calculate minimum output
    const slippageMultiplier = BigInt(100 - slippagePercent);
    const amountOutMin = (expectedOut * slippageMultiplier) / 100n;

    // Execute swap
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const result = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        wallet.address,
        deadline,
        {
            signer: wallet.keypair,
            mldsaSigner: wallet.mldsaKeypair,
            refundTo: wallet.p2tr,
            feeRate: 10,
        }
    );

    console.log('Swap completed:', result.success);
}
```

---

## Best Practices

1. **Check Slippage**: Always set reasonable slippage tolerance

2. **Approve First**: Ensure token approval before swaps

3. **Set Deadline**: Use reasonable deadline for transactions

4. **Check Reserves**: Verify pool has sufficient liquidity

5. **Monitor Prices**: Check price impact before large swaps

---

## Next Steps

- [Factory ABIs](./factory-abis.md) - Token factories
- [Stablecoin ABIs](./stablecoin-abis.md) - Stablecoin interfaces
- [Advanced Swaps](../examples/advanced-swaps.md) - Swap examples

---

[← Previous: OP721 ABI](./op721-abi.md) | [Next: Factory ABIs →](./factory-abis.md)
