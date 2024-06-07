import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

(async () => {
    const tx = await provider.getTransaction(
        '3309cceb2026f3ca22f787c4305670384cb8f824ca9175c7ab1a65ec40374f24',
    );

    console.log('Transaction:', tx);

    const c = await provider.getCode(
        'bcrt1py2dhdrrf4s72gau3mkdw0mpnkgzp63qfdc0j7nah3luhmfcwf8kq4r44ef',
        false,
    );
    console.log(c);

    const d = await provider.getCode('bcrt1qr34ygwd8tqtt5gq2n6mvafygqmfawm7yl6u6kp', false);
    console.log(d);
})();
