import { BitcoinAddressLike } from '../../../common/CommonTypes.js';
import { BaseContractProperty } from '../../BaseContractProperty.js';
import { IOP_NETContract } from './IOP_NETContract.js';

/**
 * @description This interface represents the OP_20 base contract.
 * @interface IOP_20Contract
 * @extends {IOP_NETContract}
 * @cathegory Contracts
 *
 * @example
 * import { IOP_20Contract } from '../abi/shared/interfaces/IOP_20Contract.js';
 * import { OP_20_ABI } from '../abi/shared/json/OP_20_ABI.js';
 * import { CallResult } from '../contracts/CallResult.js';
 * import { getContract } from '../contracts/Contract.js';
 * import { JSONRpcProvider } from '../providers/JSONRpcProvider.js';
 *
 * const provider: JSONRpcProvider = new JSONRpcProvider('https://regtest.opnet.org');
 * const contract: IOP_20Contract = getContract<IOP_20Contract>(
 *     'bcrt1qxeyh0pacdtkqmlna9n254fztp3ptadkkfu6efl',
 *     OP_20_ABI,
 *     provider,
 * );
 *
 * const balanceExample = await contract.balanceOf(
 *     'bcrt1pyrs3eqwnrmd4ql3nwvx66yzp0wc24xd2t9pf8699ln340pjs7f3sar3tum',
 * );
 *
 * if ('error' in balanceExample) throw new Error('Error in fetching balance');
 * console.log('Balance:', balanceExample.decoded);
 */
export interface IOP_20Contract extends IOP_NETContract {
    balanceOf(address: BitcoinAddressLike): Promise<BaseContractProperty>;

    name(): Promise<BaseContractProperty>;

    symbol(): Promise<BaseContractProperty>;

    totalSupply(): Promise<BaseContractProperty>;

    decimals(): Promise<BaseContractProperty>;

    transfer(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;

    transferFrom(
        from: BitcoinAddressLike,
        to: BitcoinAddressLike,
        value: bigint,
    ): Promise<BaseContractProperty>;

    approve(spender: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;

    allowance(
        owner: BitcoinAddressLike,
        spender: BitcoinAddressLike,
    ): Promise<BaseContractProperty>;

    mint(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;

    burn(to: BitcoinAddressLike, value: bigint): Promise<BaseContractProperty>;
}
