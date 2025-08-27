import { Address } from '@btc-vision/transaction';
import { CallResult } from '../../../../contracts/CallResult.js';
import { OPNetEvent } from '../../../../contracts/OPNetEvent.js';
import { DomainSeparator } from './IOP20Contract.js';
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
    readonly value: bigint;
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
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the symbol function call.
 */
export type SymbolNFT = CallResult<
    {
        symbol: string;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the maxSupply function call.
 */
export type MaxSupplyNFT = CallResult<
    {
        maxSupply: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the tokenURI function call.
 */
export type TokenURI = CallResult<
    {
        uri: string;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the totalSupply function call.
 */
export type TotalSupplyNFT = CallResult<
    {
        totalSupply: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the balanceOf function call.
 */
export type BalanceOfNFT = CallResult<
    {
        balance: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the ownerOf function call.
 */
export type OwnerOfNFT = CallResult<
    {
        owner: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the safeTransferFrom function call.
 */
export type SafeTransferFromNFT = CallResult<{}, OPNetEvent<TransferredEventNFT>[]>;

/**
 * @description Represents the result of the transferFrom function call.
 */
export type TransferFromNFT = CallResult<{}, OPNetEvent<TransferredEventNFT>[]>;

/**
 * @description Represents the result of the approve function call.
 */
export type ApproveNFT = CallResult<{}, OPNetEvent<ApprovedEventNFT>[]>;

/**
 * @description Represents the result of the getApproved function call.
 */
export type GetApprovedNFT = CallResult<
    {
        approved: Address;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setApprovalForAll function call.
 */
export type SetApprovalForAllNFT = CallResult<{}, OPNetEvent<ApprovedForAllEventNFT>[]>;

/**
 * @description Represents the result of the isApprovedForAll function call.
 */
export type IsApprovedForAllNFT = CallResult<
    {
        approved: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the transferBySignature function call.
 */
export type TransferBySignatureNFT = CallResult<{}, OPNetEvent<TransferredEventNFT>[]>;

/**
 * @description Represents the result of the approveBySignature function call.
 */
export type ApproveBySignatureNFT = CallResult<{}, OPNetEvent<ApprovedEventNFT>[]>;

/**
 * @description Represents the result of the burn function call.
 */
export type BurnNFT = CallResult<{}, OPNetEvent<TransferredEventNFT>[]>;

/**
 * @description Represents the result of the tokenOfOwnerByIndex function call.
 */
export type TokenOfOwnerByIndex = CallResult<
    {
        tokenId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getTransferNonce function call.
 */
export type GetTransferNonce = CallResult<
    {
        nonce: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getApproveNonce function call.
 */
export type GetApproveNonce = CallResult<
    {
        nonce: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setBaseURI function call.
 */
export type SetBaseURI = CallResult<{}, OPNetEvent<URIEventNFT>[]>;

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
        maximumSupply: bigint;
        domainSeparator: Uint8Array;
    },
    OPNetEvent<never>[]
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
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// IOP721
// ------------------------------------------------------------------
export interface IOP721 extends IOP_NETContract {
    name(): Promise<NameNFT>;
    symbol(): Promise<SymbolNFT>;
    maxSupply(): Promise<MaxSupplyNFT>;
    tokenURI(tokenId: bigint): Promise<TokenURI>;
    collectionInfo(): Promise<CollectionInfo>;
    totalSupply(): Promise<TotalSupplyNFT>;
    metadata(): Promise<MetadataNFT>;
    balanceOf(owner: Address): Promise<BalanceOfNFT>;
    ownerOf(tokenId: bigint): Promise<OwnerOfNFT>;
    safeTransferFrom(
        from: Address,
        to: Address,
        tokenId: bigint,
        data: Uint8Array,
    ): Promise<SafeTransferFromNFT>;
    transferFrom(from: Address, to: Address, tokenId: bigint): Promise<TransferFromNFT>;
    approve(to: Address, tokenId: bigint): Promise<ApproveNFT>;
    getApproved(tokenId: bigint): Promise<GetApprovedNFT>;
    setApprovalForAll(operator: Address, approved: boolean): Promise<SetApprovalForAllNFT>;
    isApprovedForAll(owner: Address, operator: Address): Promise<IsApprovedForAllNFT>;
    transferBySignature(
        owner: Address,
        to: Address,
        tokenId: bigint,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<TransferBySignatureNFT>;
    approveBySignature(
        owner: Address,
        spender: Address,
        tokenId: bigint,
        deadline: bigint,
        signature: Uint8Array,
    ): Promise<ApproveBySignatureNFT>;
    burn(tokenId: bigint): Promise<BurnNFT>;
    domainSeparator(): Promise<DomainSeparator>;
    tokenOfOwnerByIndex(owner: Address, index: bigint): Promise<TokenOfOwnerByIndex>;
    getTransferNonce(owner: Address): Promise<GetTransferNonce>;
    getApproveNonce(owner: Address): Promise<GetApproveNonce>;
    setBaseURI(baseURI: string): Promise<SetBaseURI>;
}
