import { CallResult } from '../contracts/CallResult.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
import { wBTCAbi, WBTCContract } from './ITestContract.js';

const provider: JSONRpcProvider = new JSONRpcProvider('https://testnet.opnet.org');

(async () => {
    const contract: WBTCContract = getContract<WBTCContract>(
        'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
        wBTCAbi,
        provider,
    );

    const balanceExample: CallResult = (await contract.balanceOf(
        'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
    )) as CallResult;

    console.log('Balance:', balanceExample.decoded);

    const owner = (await contract.owner()) as CallResult;
    console.log('Owner:', owner.properties);
})();
