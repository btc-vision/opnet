import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { IOP_NETContract } from './IOP_NETContract.js';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type TransferredEventNFT = {
    readonly operator: Address;
    readonly from: Address;
    readonly to: Address;
    readonly amount: bigint;
};

export type ApprovedEventNFT = {
    readonly owner: Address;
    readonly spender: Address;
    readonly amount: bigint;
};

export type ApprovedForAllEventNFT = {
    readonly account: Address;
    readonly operator: Address;
    readonly approved: boolean;
};

export type URIEventNFT = {
    readonly value: string;
    readonly id: bigint;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the name function call.
 */
export type NameNFT = CallResult<
    {
        name: string;
    },
    []
>;

/**
 * @description Represents the result of the symbol function call.
 */
export type SymbolNFT = CallResult<
    {
        symbol: string;
    },
    []
>;

/**
 * @description Represents the result of the maxSupply function call.
 */
export type MaxSupplyNFT = CallResult<
    {
        maxSupply: bigint;
    },
    []
>;

/**
 * @description Represents the result of the collectionInfo function call.
 */
export type CollectionInfo = CallResult<
    {
        icon: string;
        banner: string;
        description: string;
        website: string;
    },
    []
>;

/**
 * @description Represents the result of the tokenURI function call.
 */
export type TokenURI = CallResult<
    {
        uri: string;
    },
    []
>;

/**
 * @description Represents the result of the changeMetadata function call.
 */
export type ChangeMetadata = CallResult<{}, []>;

/**
 * @description Represents the result of the totalSupply function call.
 */
export type TotalSupplyNFT = CallResult<
    {
        totalSupply: bigint;
    },
    []
>;

/**
 * @description Represents the result of the balanceOf function call.
 */
export type BalanceOfNFT = CallResult<
    {
        balance: bigint;
    },
    []
>;

/**
 * @description Represents the result of the ownerOf function call.
 */
export type OwnerOfNFT = CallResult<
    {
        owner: Address;
    },
    []
>;

/**
 * @description Represents the result of the safeTransfer function call.
 */
export type SafeTransferNFT = CallResult<{}, [OPNetEvent<TransferredEventNFT>]>;

/**
 * @description Represents the result of the safeTransferFrom function call.
 */
export type SafeTransferFromNFT = CallResult<{}, [OPNetEvent<TransferredEventNFT>]>;

/**
 * @description Represents the result of the approve function call.
 */
export type ApproveNFT = CallResult<{}, [OPNetEvent<ApprovedEventNFT>]>;

/**
 * @description Represents the result of the getApproved function call.
 */
export type GetApprovedNFT = CallResult<{}, []>;

/**
 * @description Represents the result of the setApprovalForAll function call.
 */
export type SetApprovalForAllNFT = CallResult<{}, [OPNetEvent<ApprovedForAllEventNFT>]>;

/**
 * @description Represents the result of the isApprovedForAll function call.
 */
export type IsApprovedForAllNFT = CallResult<
    {
        approved: boolean;
    },
    []
>;

/**
 * @description Represents the result of the approveBySignature function call.
 */
export type ApproveBySignatureNFT = CallResult<{}, [OPNetEvent<ApprovedEventNFT>]>;

/**
 * @description Represents the result of the setApprovalForAllBySignature function call.
 */
export type SetApprovalForAllBySignatureNFT = CallResult<{}, [OPNetEvent<ApprovedForAllEventNFT>]>;

/**
 * @description Represents the result of the burn function call.
 */
export type BurnNFT = CallResult<{}, [OPNetEvent<TransferredEventNFT>]>;

/**
 * @description Represents the result of the domainSeparator function call.
 */
export type DomainSeparatorNFT = CallResult<
    {
        domainSeparator: Uint8Array;
    },
    []
>;

/**
 * @description Represents the result of the tokenOfOwnerByIndex function call.
 */
export type TokenOfOwnerByIndex = CallResult<
    {
        tokenId: bigint;
    },
    []
>;

/**
 * @description Represents the result of the getApproveNonce function call.
 */
export type GetApproveNonce = CallResult<
    {
        nonce: bigint;
    },
    []
>;

/**
 * @description Represents the result of the setBaseURI function call.
 */
export type SetBaseURI = CallResult<{}, [OPNetEvent<URIEventNFT>]>;

/**
 * @description Represents the result of the metadata function call.
 */
export type MetadataNFT = CallResult<
    {
        name: string;
        symbol: string;
        icon: string;
        banner: string;
        description: string;
        website: string;
        totalSupply: bigint;
        domainSeparator: Uint8Array;
    },
    []
>;

// ------------------------------------------------------------------
// IOP721Contract
// ------------------------------------------------------------------
export interface IOP721Contract extends IOP_NETContract {
    name(): Promise<NameNFT>;

    symbol(): Promise<SymbolNFT>;

    maxSupply(): Promise<MaxSupplyNFT>;

    collectionInfo(): Promise<CollectionInfo>;

    tokenURI(tokenId: bigint): Promise<TokenURI>;

    changeMetadata(): Promise<ChangeMetadata>;

    totalSupply(): Promise<TotalSupplyNFT>;

    balanceOf(owner: Address): Promise<BalanceOfNFT>;

    ownerOf(tokenId: bigint): Promise<OwnerOfNFT>;

    safeTransfer(to: Address, tokenId: bigint, data: Uint8Array): Promise<SafeTransferNFT>;

    safeTransferFrom(
        from: Address,
        to: Address,
        tokenId: bigint,
        data: Uint8Array,
    ): Promise<SafeTransferFromNFT>;

    approve(operator: Address, tokenId: bigint): Promise<ApproveNFT>;

    getApproved(tokenId: bigint): Promise<GetApprovedNFT>;

    setApprovalForAll(operator: Address, approved: boolean): Promise<SetApprovalForAllNFT>;

    isApprovedForAll(owner: Address, operator: Address): Promise<IsApprovedForAllNFT>;

    approveBySignature(
        owner: Uint8Array,
        ownerTweakedPublicKey: Uint8Array,
        operator: Address,
        tokenId: bigint,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<ApproveBySignatureNFT>;

    setApprovalForAllBySignature(
        owner: Uint8Array,
        ownerTweakedPublicKey: Uint8Array,
        operator: Address,
        approved: boolean,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<SetApprovalForAllBySignatureNFT>;

    burn(tokenId: bigint): Promise<BurnNFT>;

    domainSeparator(): Promise<DomainSeparatorNFT>;

    tokenOfOwnerByIndex(owner: Address, index: bigint): Promise<TokenOfOwnerByIndex>;

    getApproveNonce(owner: Address): Promise<GetApproveNonce>;

    setBaseURI(baseURI: string): Promise<SetBaseURI>;

    metadata(): Promise<MetadataNFT>;
}

/**
 * @deprecated Use IOP721Contract instead
 */
export type IOP721 = IOP721Contract;
