import { ABIDataTypes } from '@btc-vision/bsi-binary';
import { BaseContractProperty } from '../abi/BaseContractProperty.js';
import { BitcoinAbiTypes } from '../abi/BitcoinAbiTypes.js';
import { BaseContractProperties } from '../abi/interfaces/BaseContractProperties.js';
import { BitcoinInterfaceAbi } from '../abi/interfaces/BitcoinInterfaceAbi.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';
import { CallResult } from '../contracts/CallResult.js';
import { getContract } from '../contracts/Contract.js';
import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';

const provider: JSONRpcProvider = new JSONRpcProvider('https://testnet.opnet.org');

interface TestContract extends BaseContractProperties {
    giveFreeMoney(bool: true): Promise<BaseContractProperty>;

    balanceOf(address: BitcoinAddressLike): Promise<BaseContractProperty>;

    owner(): Promise<BaseContractProperty>;
}

(async () => {
    const abi: BitcoinInterfaceAbi = [
        {
            name: 'balanceOf',
            inputs: [
                {
                    name: 'address',
                    type: ABIDataTypes.ADDRESS,
                },
            ],
            outputs: [
                {
                    name: 'balance',
                    type: ABIDataTypes.UINT256,
                },
            ],
            type: BitcoinAbiTypes.Function,
        },
        {
            name: 'owner',
            constant: true,

            outputs: [
                {
                    name: 'owner',
                    type: ABIDataTypes.ADDRESS,
                },
            ],
            type: BitcoinAbiTypes.Function,
        },
    ];

    const contract: TestContract = getContract<TestContract>(
        'tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a',
        abi,
        provider,
    );

    // 13sBQqJdnAdc7v5tnX3ifYqAMoFX79VfLy
    const res: CallResult = (await contract.balanceOf(
        'bc1p134a291b21a4ef28c961daee77a75e81cd7c0f00733a152930f76746a3e9',
    )) as CallResult;

    console.log('Balance:', res.decoded);

    const owner = (await contract.owner()) as CallResult;

    console.log('Owner:', owner.decoded);
})();
