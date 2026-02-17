import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP_NETContract } from '../opnet/IOP_NETContract.js';

export type TokenDeployedEvent = {
    readonly deployer: Address;
    readonly token: Address;
    readonly name: string;
    readonly symbol: string;
};

export type MotoChefDeployedEvent = {
    readonly deployer: Address;
    readonly token: Address;
    readonly motoChef: Address;
    readonly userBTCFeePercentage: bigint;
    readonly farmName: string;
};

export type FactoryPausedEvent = {
    readonly by: Address;
};

export type FactoryUnpausedEvent = {
    readonly by: Address;
};

export type InitializeFactory = CallResult<{ success: boolean }, []>;
export type Owner = CallResult<{ owner: Address }, []>;
export type PauseFactory = CallResult<{ success: boolean }, [OPNetEvent<FactoryPausedEvent>]>;
export type UnpauseFactory = CallResult<{ success: boolean }, [OPNetEvent<FactoryUnpausedEvent>]>;
export type IsPaused = CallResult<{ isPaused: boolean }, []>;
export type GetTokenDeployer = CallResult<{ deployer: Address }, []>;
export type GetTokenOwner = CallResult<{ owner: Address }, []>;
export type DeployToken = CallResult<{ success: boolean }, [OPNetEvent<TokenDeployedEvent>]>;
export type DeployMotoChef = CallResult<{ success: boolean }, [OPNetEvent<MotoChefDeployedEvent>]>;
export type UpdateTokenOwner = CallResult<{ success: boolean }, []>;
export type GetUserTokens = CallResult<{ tokens: Uint8Array }, []>;
export type GetDeploymentInfo = CallResult<
    { has: boolean; token: Address; motoChef: Address; block: bigint },
    []
>;
export type GetDeploymentsCount = CallResult<{ count: number }, []>;
export type GetDeploymentByIndex = CallResult<
    { deployer: Address; token: Address; motoChef: Address; block: bigint },
    []
>;
export type GetTokenMotoChef = CallResult<{ motoChefAddress: Address }, []>;
export type OnOP20Received = CallResult<{ selector: Uint8Array }, []>;

export interface IMotoChefFactory extends IOP_NETContract {
    owner(): Promise<Owner>;
    initialize(): Promise<InitializeFactory>;
    pauseFactory(): Promise<PauseFactory>;
    unpauseFactory(): Promise<UnpauseFactory>;
    isPaused(): Promise<IsPaused>;
    getTokenDeployer(tokenAddress: Address): Promise<GetTokenDeployer>;
    getTokenOwner(tokenAddress: Address): Promise<GetTokenOwner>;

    deployToken(
        maxSupply: bigint,
        decimals: number,
        name: string,
        symbol: string,
        initialMintTo: Address,
        initialMintAmount: bigint,
        freeMintSupply: bigint,
        freeMintPerTx: bigint,
        tokenOwner: Address,
    ): Promise<DeployToken>;

    deployMotoChef(
        tokenPerBlock: bigint,
        bonusEndBlock: bigint,
        bonusMultiplier: bigint,
        BTCAllocPoint: bigint,
        tokenAddress: Address,
        tokenAllocPoint: bigint,
        userBTCFeePercentage: bigint,
        userFeeRecipient: string,
        farmName: string,
        farmBanner: string,
        additionalPoolTokens: Address[],
        additionalPoolAllocPoints: bigint[],
    ): Promise<DeployMotoChef>;

    updateTokenOwner(tokenAddress: Address, newOwner: Address): Promise<UpdateTokenOwner>;
    getUserTokens(deployer: Address): Promise<GetUserTokens>;
    getDeploymentInfo(deployer: Address): Promise<GetDeploymentInfo>;
    getDeploymentsCount(): Promise<GetDeploymentsCount>;
    getDeploymentByIndex(index: number): Promise<GetDeploymentByIndex>;
    getTokenMotoChef(tokenAddress: Address): Promise<GetTokenMotoChef>;

    onOP20Received(
        operator: Address,
        from: Address,
        amount: bigint,
        data: Uint8Array,
    ): Promise<OnOP20Received>;
}

export default IMotoChefFactory;
