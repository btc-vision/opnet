import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP20Contract } from '../opnet/IOP20Contract.js';

export type MintedEvent = {
    readonly to: Address;
    readonly amount: bigint;
};

export type FreeMintConfiguredEvent = {
    readonly token: Address;
    readonly supply: bigint;
    readonly perTxLimit: bigint;
};

export type FreeMintClaimedEvent = {
    readonly user: Address;
    readonly token: Address;
    readonly amount: bigint;
};

export type TokenOwnerTransferredEvent = {
    readonly previousOwner: Address;
    readonly newOwner: Address;
};

export type TemplateOP20Initialize = CallResult<
    {},
    OPNetEvent<MintedEvent | FreeMintConfiguredEvent>[]
>;
export type TemplateOP20Mint = CallResult<{}, [OPNetEvent<MintedEvent>]>;
export type GrantMinterRole = CallResult<{ success: boolean }, []>;
export type RevokeMinterRole = CallResult<{ success: boolean }, []>;
export type IsMinter = CallResult<{ isMinter: boolean }, []>;
export type TokenOwner = CallResult<{ owner: Address }, []>;
export type FactoryAddress = CallResult<{ factory: Address }, []>;
export type TemplateOP20Deployer = CallResult<{ deployer: Address }, []>;
export type TransferTokenOwner = CallResult<
    { success: boolean },
    [OPNetEvent<TokenOwnerTransferredEvent>]
>;
export type FreeMint = CallResult<{ success: boolean }, [OPNetEvent<MintedEvent>]>;
export type FreeMintInfo = CallResult<{ info: Uint8Array }, []>;
export type OnOP20Received = CallResult<{ selector: Uint8Array }, []>;

export interface ITemplateOP20 extends IOP20Contract {
    initialize(
        maxSupply: bigint,
        decimals: number,
        name: string,
        symbol: string,
        initialMintTo: Address,
        initialMintAmount: bigint,
        freeMintSupply: bigint,
        freeMintPerTx: bigint,
        tokenOwner: Address,
    ): Promise<TemplateOP20Initialize>;

    mint(to: Address, amount: bigint): Promise<TemplateOP20Mint>;
    grantMinterRole(minter: Address): Promise<GrantMinterRole>;
    revokeMinterRole(minter: Address): Promise<RevokeMinterRole>;
    isMinter(account: Address): Promise<IsMinter>;
    getTokenOwner(): Promise<TokenOwner>;
    getFactoryAddress(): Promise<FactoryAddress>;
    deployer(): Promise<TemplateOP20Deployer>;
    transferTokenOwner(newOwner: Address): Promise<TransferTokenOwner>;
    freeMint(amount: bigint): Promise<FreeMint>;
    getFreeMintInfo(): Promise<FreeMintInfo>;

    onOP20Received(
        operator: Address,
        from: Address,
        amount: bigint,
        data: Uint8Array,
    ): Promise<OnOP20Received>;
}

export default ITemplateOP20;
