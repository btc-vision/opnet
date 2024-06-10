import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
import { wBTCAbi, WBTCContract } from './ITestContract.js';

const provider: JSONRpcProvider = new JSONRpcProvider('https://testnet.opnet.org'); //http://localhost:9001

const contract: WBTCContract = getContract<WBTCContract>(
    'tb1pq64lx73fwyrdp4asvl7xt5r5qvxvt9wy82x75taqtzvd64f58nasansurj',
    wBTCAbi,
    provider,
);

const myWBTCBalance: BaseContractProperty = await contract.balanceOf(
    'tb1pvajdvghss0tc737z72sq02cga9hd7wvdua9vcqj357a6yqhlhy4seud439',
);

if ('error' in myWBTCBalance) throw new Error(myWBTCBalance.error);

console.log('My WBTC balance:', myWBTCBalance.decoded[0]);

const tx = await provider.getTransaction(
    '4076964e2d70c44562cb4bb8afb074c723e850a7807abc73eb9a33682ec93f44',
);

console.log('Transaction:', tx);

/*const blockNumber = await provider.getBlockNumber();
                                                                                                                                        console.log('Current network height:', blockNumber);

                                                                                                                                        const block = await provider.getBlock(2810101n, true);
                                                                                                                                        console.log('Block ->', block.transactions[2]);

                                                                                                                                        const balance = await provider.getBalance('tb1qcfszz8dcvsz9mcp70ezw5zy2r3ydr0cfz60d3t');
                                                                                                                                        console.log('Balance out:', balance);

                                                                                                                                        const utxos = await provider.getUXTOs('tb1qcfszz8dcvsz9mcp70ezw5zy2r3ydr0cfz60d3t');
                                                                                                                                        console.log('UTXOs:', utxos);*/

/*const transaction = (await provider.getTransaction(
                                            'af7a6001150b2b4ec7361515d3e5075c81d9f975c8ec22989db0a0c474c08418',
                                        )) as InteractionTransaction;

                                        console.log('Transaction:', transaction, transaction.calldata.toString('hex'));

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
                                            console.log('Decoded Events:', receipt, events);

                                            const decodedEvents = contract.decodeEvents(events);
                                            console.log('Decoded Events:', decodedEvents);
                                        }

                                        const callResult = await provider.call(
                                            'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
                                            'ed1470ec6263317065653831396563313361383462353830633934343431383966386237313131653466663335666263656336626534386638346237396137626362356300000000000000008146a1bb27e3b07c40f0209b9f876f80ad503ff71b893e44',
                                        );

                                        console.log('Call result:', callResult);

                                        const blockWitness = await provider.getBlockWitness(398);
                                        console.dir(blockWitness, { depth: 10, colors: true });

                                        const reorgs = await provider.getReorg();
                                        console.log('Reorgs:', reorgs);

                                        const wrapParams = await provider.requestTrustedPublicKeyForBitcoinWrapping(1000n);
                                        console.log('Wrap Params:', wrapParams);

                                        /*const net = await provider.getNetwork();*/
//console.log(net);

/*const code = await provider.getCode(
                                    'tb1pq64lx73fwyrdp4asvl7xt5r5qvxvt9wy82x75taqtzvd64f58nasansurj',
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
