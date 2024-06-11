# WBTC Staking Consensus

## Overview
This guide will help you understand what WBTC staking is, how it works, and how you can benefit from it. 

## What is WBTC Staking?

WBTC staking is a process where you can lock up your WBTC tokens (Wrapped Bitcoin) in a smart contract for a specified period and earn rewards. These rewards come from a reward pool, which accumulates over time through various sources. 

## How Does WBTC Staking Work?

### 1. Staking Your WBTC

When you stake your WBTC tokens, they are locked in the smart contract for a minimum duration of 576 blocks. This period ensures that your tokens are committed to the staking process and helps maintain the stability of the reward system. The minimum amount you can stake is 0.0001 WBTC (10000 sat).

### 2. Reward Pool

The reward pool is a collective pool of WBTC tokens that accumulates over time. It is funded through various sources, such as a portion of newly minted WBTC. The reward pool is distributed to stakers based on how much they have staked and how long they have staked their tokens.

### 3. Unstaking Your WBTC

After the minimum staking duration of 576 blocks, you can unstake your WBTC. When you unstake, you receive your original staked amount plus any accumulated rewards. This ensures that long-term stakers are rewarded more.

### 4. How Rewards Are Calculated

The rewards you earn from staking are calculated based on two factors:
- **Stake Proportion:** This is the ratio of your staked amount to the total amount of WBTC staked by all users.
- **Duration Multiplier:** This is the ratio of your staking duration to a set duration multiplier (2016 blocks in this case).

#### Mathematical Representation

1. **Stake Proportion:**

$$ \text{stakeProportion} = \frac{\text{Your Staked Amount}}{\text{Total Staked Amount}} $$

2. **Duration Multiplier:**

$$ \text{durationMultiplier} = \frac{\text{Your Staking Duration}}{2016} $$

3. **Reward Calculation:**

$$ \text{Reward} = \text{Reward Pool} \times \left( \frac{\text{Your Staked Amount}}{\text{Total Staked Amount}} \right) \times \left( \frac{\text{Your Staking Duration}}{2016} \right) $$

### Example

Imagine you staked 0.1 WBTC, the total amount of WBTC staked by all users is 166 WBTC, your staking duration is 10000 blocks, and the reward pool has 4.56 WBTC. Your reward would be calculated as follows:

1. **Stake Proportion:**

$$ \text{stakeProportion} = \frac{0.1}{166} \approx 0.000602 $$

2. **Duration Multiplier:**

$$ \text{durationMultiplier} = \frac{10000}{2016} \approx 4.96 $$

3. **Reward Calculation:**

$$ \text{Reward} = 4.56 \times 0.000602 \times 4.96 \approx 0.0136 \text{ WBTC} $$

In this example, you would receive approximately 0.0136 WBTC as a reward for staking your tokens.

## Benefits of WBTC Staking

- **Earn Rewards:** By staking your WBTC, you can earn additional WBTC over time.
- **Long-term Gains:** The longer you stake, the more rewards you can earn.
- **Support the Network:** Staking helps maintain the stability and security of the WBTC network.

## Conclusion

WBTC staking is a great way to earn rewards while supporting the network. By understanding how the staking process works and how rewards are calculated, you can make informed decisions about how much and how long to stake your WBTC.