import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('https://testnet.opnet.org');

(async () => {
    const blockNumber = await provider.getBlockNumber();
    console.log('Current network height:', blockNumber);

    const block = await provider.getBlock(2810101n, true);
    console.log('Block ->', block.transactions[2]);
})();
