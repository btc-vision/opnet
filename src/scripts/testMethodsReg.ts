import { MOTO_ADDRESS_REGTEST } from '@btc-vision/transaction';
import { IWBTCContract } from '../abi/shared/interfaces/IWBTCContract.js';
import { WBTC_ABI } from '../abi/shared/json/WBTC_ABI.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

const contract: IWBTCContract = getContract<IWBTCContract>(
    MOTO_ADDRESS_REGTEST,
    WBTC_ABI,
    provider,
    'bcrt1p2m2yz9hae5lkypuf8heh6udnt0tchmxhaftcfslqsr5vrwzh34yqgn6hs6',
);

const decimals = contract.encodeCalldata('decimals', []);

console.log(decimals);

//const transferCalldata = await contract.transfer(amount, transferToAddress);

//if ('error' in transferCalldata) throw transferCalldata.error;

/*
const withdrawalRequest = await contract.requestWithdrawal(249789999n);

if ('error' in withdrawalRequest) {
    throw new Error(withdrawalRequest.error);
}

console.log(withdrawalRequest);

const owner = await contract.owner();
console.log(owner);

const name = await contract.name();
console.log(name);*/

/*for (let i = 0; i < 10; i++) {
    (async () => {
        try {
            const blocks = await provider.getBlocks([1, 2, 3, 4, 5, 6, 7]);
            console.log(blocks);
        } catch (e) {
            console.log((e as Error).message);
        }
    })();
}*/
