import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

for (let i = 0; i < 10; i++) {
    (async () => {
        try {
            const block = await provider.getBlock(i);
            console.log(block);
            //const blocks = await provider.getBlocks([1, 2, 3, 4, 5, 6, 7]);
            //console.log(blocks);
        } catch (e) {
            console.log((e as Error).message);
        }
    })();
}
