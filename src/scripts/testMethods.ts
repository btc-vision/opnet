import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
import { TestContract, TestContractABI } from './ITestContract.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

(async () => {
    /*const blockNumber = await provider.getBlockNumber();
                                    console.log('Current network height:', blockNumber);

                                    const block = await provider.getBlock(2810101n, true);
                                    console.log('Block ->', block.transactions[2]);

                                    const balance = await provider.getBalance('tb1qcfszz8dcvsz9mcp70ezw5zy2r3ydr0cfz60d3t');
                                    console.log('Balance out:', balance);

                                    const utxos = await provider.getUXTOs('tb1qcfszz8dcvsz9mcp70ezw5zy2r3ydr0cfz60d3t');
                                    console.log('UTXOs:', utxos);*/

    const transaction = await provider.getTransaction(
        'af7a6001150b2b4ec7361515d3e5075c81d9f975c8ec22989db0a0c474c08418',
    );
    console.log('Transaction:', transaction);

    const receipt = await provider.getTransactionReceipt(
        'af7a6001150b2b4ec7361515d3e5075c81d9f975c8ec22989db0a0c474c08418',
    );
    console.log('Receipt:', receipt);

    const contract: TestContract = getContract<TestContract>(
        'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
        TestContractABI,
        provider,
    );

    const events = receipt.events;
    if (!events) {
        console.log('No events');
    } else {
        console.log('Events:', events);

        const decodedEvents = contract.decodeEvents(events);

        console.log('Decoded events:', decodedEvents);
    }

    /*const net = await provider.getNetwork();
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

                                    console.log('Call result:', callResult);*/
})();
