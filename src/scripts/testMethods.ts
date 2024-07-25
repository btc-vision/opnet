import {
    MOTO_ADDRESS_REGTEST,
    ROUTER_ADDRESS_REGTEST,
    WBTC_ADDRESS_REGTEST,
} from '@btc-vision/transaction';
import { IMotoswapRouterContract } from '../abi/shared/interfaces/IMotoswapRouterContract.js';
import { MOTOSWAP_ROUTER_ABI } from '../abi/shared/json/MOTOSWAP_ROUTER_ABI.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

/*const tx = await provider.getTransaction(
    '335f66a330ba3cce82c271c1cbe3e9fa35ed6e47aa5d9104049066a2d52269e6',
);

console.log(tx);*/
//bcrt1pe0slk2klsxckhf90hvu8g0688rxt9qts6thuxk3u4ymxeejw53gs0xjlhn

/*const contract: IOP_20Contract = getContract<IOP_20Contract>(
    WBTC_ADDRESS_REGTEST,
    MOTO_TOKEN_ABI,
    provider,
    'bcrt1pe0slk2klsxckhf90hvu8g0688rxt9qts6thuxk3u4ymxeejw53gs0xjlhn',
);

const res = await contract.allowance(
    'bcrt1p68g4tlmzwgcaluhfjhfqar45a54tx53mhdehlklce4pywv92jamqct39nn',
    ROUTER_ADDRESS_REGTEST,
);

console.log(res);*/

const routerContract: IMotoswapRouterContract = getContract<IMotoswapRouterContract>(
    ROUTER_ADDRESS_REGTEST,
    MOTOSWAP_ROUTER_ABI,
    provider,
    SENDER,
);

const getData = await routerContract.getAmountsOut(1000n, [
    WBTC_ADDRESS_REGTEST,
    MOTO_ADDRESS_REGTEST,
]);
console.log(getData);


/*
const myWBTCBalance: BaseContractProperty = await contract.balanceOf(
    'tb1pvajdvghss0tc737z72sq02cga9hd7wvdua9vcqj357a6yqhlhy4seud439',
);

if ('error' in myWBTCBalance) throw new Error(myWBTCBalance.error);

console.log('My WBTC balance:', myWBTCBalance.decoded[0]);

const tx = await provider.getTransaction(
    '4076964e2d70c44562cb4bb8afb074c723e850a7807abc73eb9a33682ec93f44',
);

console.log('Transaction:', tx);*/
