import { IWBTCContract } from '../abi/shared/interfaces/IWBTCContract.js';
import { WBTC_ABI } from '../abi/shared/json/WBTC_ABI.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

const contract: IWBTCContract = getContract<IWBTCContract>(
    'bcrt1qxeyh0pacdtkqmlna9n254fztp3ptadkkfu6efl',
    WBTC_ABI,
    provider,
);

const owner = await contract.owner();
console.log(owner);

const name = await contract.name();
console.log(name);

//const blocks = await provider.getBlocks([1, 2, 3, 4, 5]);
//console.log(blocks);
