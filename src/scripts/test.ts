import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('https://testnet.opnet.org');

/*
    const blockNumber = await provider.getBlockNumber();
    console.log('Current network height:', blockNumber);

    const block = await provider.getBlock(2810101n, true);
    console.log('Block ->', block.transactions[2]);

    const balance = await provider.getBalance('tb1qcfszz8dcvsz9mcp70ezw5zy2r3ydr0cfz60d3t');
    console.log('Balance out:', balance);

    const utxos = await provider.getUXTOs('tb1qcfszz8dcvsz9mcp70ezw5zy2r3ydr0cfz60d3t');
    console.log('UTXOs:', utxos);

    const transaction = await provider.getTransaction(
        '63e77ba9fa4262b3d4d0d9d97fa8a7359534606c3f3af096284662e3f619f374',
    );

    console.log('Transaction:', transaction);

    const receipt = await provider.getTransactionReceipt(
        '63e77ba9fa4262b3d4d0d9d97fa8a7359534606c3f3af096284662e3f619f374',
    );
    console.log('Receipt:', receipt);
*/

(async () => {
    const net = await provider.getNetwork();
    console.log(net);

    const code = await provider.getCode(
        'tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a',
    );

    console.log('Code:', code);

    const pointerValue = await provider.getStorageAt(
        'tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a',
        'EXLK/QhEQMI5d9DrthLvozT+UcDQ7WuSPaz7g8GV3AQ=',
        true,
    );

    console.log('Pointer value:', pointerValue);

    const callResult = await provider.call(
        'tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a',
        '82d62f3d3133734251714a646e416463377635746e583369665971414d6f4658373956664c79000000000000000000000000000000000000000000000000000000000000',
    );

    console.log('Call result:', callResult);
})();
