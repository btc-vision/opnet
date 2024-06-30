import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
import { wBTCAbi, WBTCContract } from './ITestContract.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

/*const tx = await provider.getTransaction(
    '3309cceb2026f3ca22f787c4305670384cb8f824ca9175c7ab1a65ec40374f24',
);

console.log('Transaction:', tx);

const c = await provider.getCode('', false);
console.log(c);

const d = await provider.getCode('bcrt1qmsx5vpm6yfwtex5ygag0nwktnmj7a48eew2qn0', false);
console.log(d);*/

const contract: WBTCContract = getContract<WBTCContract>(
    'bcrt1q3tklc99rj4w5x7aq5zvfryw64hqv2lneakg69y',
    wBTCAbi,
    provider,
);

const owner = await contract.owner();
console.log(owner);

const name = await contract.name();
console.log(name);

const blocks = await provider.getBlocks([1, 2, 3, 4, 5]);
console.log(blocks);


/*const myWBTCBalance: BaseContractProperty = await contract.balanceOf(
    'tb1pvajdvghss0tc737z72sq02cga9hd7wvdua9vcqj357a6yqhlhy4seud439',
);

if ('error' in myWBTCBalance) throw new Error(myWBTCBalance.error);*/
