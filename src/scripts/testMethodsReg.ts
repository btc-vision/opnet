import { IWBTCContract } from '../abi/shared/interfaces/IWBTCContract.js';
import { WBTC_ABI } from '../abi/shared/json/WBTC_ABI.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

const contract: IWBTCContract = getContract<IWBTCContract>(
    'bcrt1q99qtptumw027cw8w274tqzd564q66u537vn0lh',
    WBTC_ABI,
    provider,
);

const withdrawalRequest = await contract.requestWithdrawal(100000000n);

if ('error' in withdrawalRequest) {
    throw new Error(withdrawalRequest.error);
}

const owner = await contract.owner();
console.log(owner);

const name = await contract.name();
console.log(name);

//const blocks = await provider.getBlocks([1, 2, 3, 4, 5]);
//console.log(blocks);
