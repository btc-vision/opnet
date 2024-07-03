import { IOP_20Contract } from '../abi/shared/interfaces/IOP_20Contract.js';
import { OP_20_ABI } from '../abi/shared/json/OP_20_ABI.js';
import { CallResult } from '../contracts/CallResult.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org');
const contract: IOP_20Contract = getContract<IOP_20Contract>(
    'bcrt1qxeyh0pacdtkqmlna9n254fztp3ptadkkfu6efl',
    OP_20_ABI,
    provider,
);

const balanceExample = await contract.balanceOf(
    'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
);

if ('error' in balanceExample) throw new Error('Error in fetching balance');
console.log('Balance:', balanceExample.decoded);

const owner = (await contract.owner()) as CallResult;
console.log('Owner:', owner.properties);
