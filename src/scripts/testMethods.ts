import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { IWBTCContract } from '../abi/shared/interfaces/IWBTCContract.js';
import { WBTC_ABI } from '../abi/shared/json/WBTC_ABI.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('https://testnet.opnet.org');

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

console.log('Transaction:', tx);
