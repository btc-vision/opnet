# OPNet - Smart Contracts on Bitcoin L1

![Bitcoin](https://img.shields.io/badge/Bitcoin-000?style=for-the-badge&logo=bitcoin&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The official client library for building Bitcoin-based applications on OPNet. Full TypeScript support with type-safe contract interactions.

## Security Audit

<p align="center">
  <a href="https://verichains.io">
    <img src="https://raw.githubusercontent.com/btc-vision/contract-logo/refs/heads/main/public-assets/verichains.png" alt="Verichains" width="100"/>
  </a>
</p>

<p align="center">
  <a href="https://verichains.io">
    <img src="https://img.shields.io/badge/Security%20Audit-Verichains-4C35E0?style=for-the-badge" alt="Audited by Verichains"/>
  </a>
  <a href="./SECURITY.md">
    <img src="https://img.shields.io/badge/Security-Report-22C55E?style=for-the-badge" alt="Security Report"/>
  </a>
</p>

This library has been professionally audited by [Verichains](https://verichains.io).

See [SECURITY.md](./SECURITY.md) for details.

## Installation

```bash
npm install opnet @btc-vision/transaction @btc-vision/bitcoin
```

## Documentation

Check out the full documentation in [`/docs`](./docs)!

- [Getting Started](./docs/getting-started/quick-start.md)
- [Providers](./docs/providers/json-rpc-provider.md) - JSON-RPC & WebSocket connections
- [Smart Contracts](./docs/contracts/overview.md) - Contract interactions & transactions
- [UTXO Management](./docs/bitcoin/utxos.md) - Bitcoin UTXO handling
- [Offline Signing](./docs/contracts/offline-signing.md) - Cold wallet support
- [ABI Reference](./docs/abi-reference/abi-overview.md) - OP20, OP721, MotoSwap ABIs
- [API Reference](./docs/api-reference/provider-api.md) - Full API documentation

## RPC Endpoints

| Network | URL |
|---------|-----|
| Mainnet | `https://mainnet.opnet.org` |
| Regtest | `https://regtest.opnet.org` |

## Quick Start

```typescript
import { BitcoinUtils, getContract, IOP20Contract, JSONRpcProvider, OP_20_ABI } from 'opnet';
import { AddressTypes, Mnemonic, MLDSASecurityLevel } from '@btc-vision/transaction';
import { networks } from '@btc-vision/bitcoin';

// Connect to OPNet
const provider = new JSONRpcProvider('https://regtest.opnet.org', networks.regtest);

// Create wallet from mnemonic
const mnemonic = new Mnemonic(
    'your twenty four word seed phrase goes here ...',
    '',
    networks.regtest,
    MLDSASecurityLevel.LEVEL2,
);
const wallet = mnemonic.deriveUnisat(AddressTypes.P2TR, 0);
const myAddress = wallet.address;

// Interact with a token contract
const token = getContract<IOP20Contract>(
    'op1...', // contract address
    OP_20_ABI,
    provider,
    networks.regtest,
    myAddress
);

// Read token info
const name = await token.name();
const balance = await token.balanceOf(myAddress);

console.log('Token:', name.properties.name);
console.log('Balance:', balance.properties.balance);

// Send a transaction (100 tokens with 8 decimals)
const amount = BitcoinUtils.expandToDecimals(100, 8);
const simulation = await token.transfer(recipientAddress, amount);

if (simulation.revert) {
    throw new Error(`Transfer would fail: ${simulation.revert}`);
}

const tx = await simulation.sendTransaction({
    signer: wallet.keypair,
    mldsaSigner: wallet.mldsaKeypair,
    refundTo: wallet.p2tr,
    maximumAllowedSatToSpend: 50000n,
    feeRate: 10,
    network: networks.regtest,
});

console.log('TX ID:', tx.transactionId);
```

## Requirements

- Node.js >= 24.0.0
- TypeScript >= 5.9

## Development

```bash
git clone https://github.com/btc-vision/opnet.git
cd opnet
npm install
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

See the [pull request template](./.github/PULL_REQUEST_TEMPLATE.md) for requirements.

## Reporting Issues

- **Bugs**: Use the [bug report template](https://github.com/btc-vision/opnet/issues/new?template=bug_report.yml)
- **Security**: See [SECURITY.md](./SECURITY.md) - do not open public issues for vulnerabilities

## License

[Apache-2.0](LICENSE)

## Links

- [OPNet](https://opnet.org)
- [Documentation](./docs/)
- [GitHub](https://github.com/btc-vision/opnet)
- [npm](https://www.npmjs.com/package/opnet)
- [Verichains](https://verichains.io)
