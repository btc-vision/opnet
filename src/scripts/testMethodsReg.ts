import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

(async () => {
    const tx = await provider.getTransaction(
        '3309cceb2026f3ca22f787c4305670384cb8f824ca9175c7ab1a65ec40374f24',
    );

    console.log('Transaction:', tx);

    const c = await provider.getCode('', false);
    console.log(c);

    const d = await provider.getCode('bcrt1qmsx5vpm6yfwtex5ygag0nwktnmj7a48eew2qn0', false);
    console.log(d);
})();
