import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('http://localhost:9001');

const tx = await provider.getTransaction(
    '335f66a330ba3cce82c271c1cbe3e9fa35ed6e47aa5d9104049066a2d52269e6',
);

console.log(tx);

/*
const contract: IWBTCContract = getContract<IWBTCContract>(
    'tb1qs4d69qpw57cm3pxyeuamenkv0aswtnhpgxry06',
    WBTC_ABI,
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

console.log('Transaction:', tx);*/
