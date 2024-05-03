import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

(async () => {
    const blockNumber = await provider.getBlockNumber();
    console.log('Current network height:', blockNumber);

    const block = await provider.getBlock(blockNumber, true);
    console.log('Block ->', block);
})();
