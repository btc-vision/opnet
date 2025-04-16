# OP_NET - Smart Contracts on Bitcoin L1

![Bitcoin](https://img.shields.io/badge/Bitcoin-000?style=for-the-badge&logo=bitcoin&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Gulp](https://img.shields.io/badge/GULP-%23CF4647.svg?style=for-the-badge&logo=gulp&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Introduction

A complete, compact and simple library for the Bitcoin ecosystem, written in
TypeScript. This library is designed to be easy to use and understand, while
providing a comprehensive set of functions for creating, reading and
manipulating Bitcoin transactions. This library is designed to be able to
manipulate anything related to BSI (Bitcoin Smart Inscription), smart contracts,
and other Bitcoin-related technologies.

## Getting Started

### Prerequisites

- Node.js version 16.x or higher
- npm (Node Package Manager)

### Installation

```shell
npm i opnet
```

### Documentation

Documentation available at [https://dev.opnet.org](https://dev.opnet.org) or in
the `docs/` directory of the repository.

#### Development

1. Clone the repository:
    ```bash
    git clone https://github.com/btc-vision/opnet.git
    ```
2. Navigate to the repository directory:
    ```bash
    cd opnet
    ```
3. Install the required dependencies:
    ```bash
    npm i
    ```

## Example

Calling a contract function from typescript/javascript is as simple as a few
lines of code:

```typescript
import {
    getContract,
    IOP_20Contract,
    JSONRpcProvider,
    OP_20_ABI,
    TransactionParameters,
} from 'opnet';
import { Configs } from '../configs/Configs.js';
import { Address, Wallet } from '@btc-vision/transaction';
import { Network } from '@btc-vision/bitcoin';

const network: Network = Configs.NETWORK;
const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org', network);
const wallet: Wallet = Configs.WALLET;
const yourAddress: Address = new Address(wallet.keypair.publicKey);

const example: IOP_20Contract = getContract<IOP_20Contract>(
    'bcrt1plz0svv3wl05qrrv0dx8hvh5mgqc7jf3mhqgtw8jnj3l3d3cs6lzsfc3mxh',
    OP_20_ABI,
    provider,
    Configs.NETWORK,
    yourAddress,
);

const name = await example.name();
const symbol = await example.symbol();
const totalSupply = await example.totalSupply();
const decimals = await example.decimals();
const myBalance = await example.balanceOf(yourAddress);

console.log('Name:', name.properties.name);
console.log('Symbol:', symbol.properties.symbol);
console.log('Total Supply:', totalSupply.properties.totalSupply);
console.log('Decimals:', decimals.properties.decimals);
console.log('My Balance:', myBalance.properties.balance);

// You can also easily simulate & interact onchain!

const transferSimulation = await example.transfer(yourAddress, 10000n);
const params: TransactionParameters = {
    signer: wallet.keypair, // The keypair that will sign the transaction
    refundTo: wallet.p2tr, // Refund the rest of the funds to this address
    maximumAllowedSatToSpend: 5000n, // The maximum we want to allocate to this transaction in satoshis
    feeRate: 10, // We need to provide a fee rate
    network: network, // The network we are operating on
};

const tx = await transferSimulation.sendTransaction(params);
console.log('Transaction created!', tx);
```

You can get the calldata generated by doing balanceExample.calldata and generate
your transaction based on that. In scenarios where you are writing data
on-chain, you must specify the sender in the getContract function. This is
important for the simulation to pass.

## Contribution

Contributions are welcome! Please read through the `CONTRIBUTING.md` file for
guidelines on how to submit issues, feature requests, and pull requests. We
appreciate your input and encourage you to help us improve OP_NET.

## License

This project is open source and available under the [MIT License](LICENSE). If
you have any suggestions or contributions, please feel free to submit a pull
request.
