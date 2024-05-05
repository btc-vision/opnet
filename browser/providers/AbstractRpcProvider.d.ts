/// <reference types="node" />
import '../serialize/BigInt.js';
import { Network } from 'bitcoinjs-lib';
import { BigNumberish, BlockTag, JsonRpcApiProvider } from 'ethers';
import { Block } from '../block/Block.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';
import { CallResult } from '../contracts/CallResult.js';
import { ContractData } from '../contracts/ContractData.js';
import { ICallRequestError } from '../contracts/interfaces/ICallResult.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { StoredValue } from '../storage/StoredValue.js';
import { ITransactionReceipt } from '../transactions/interfaces/ITransactionReceipt.js';
import { TransactionBase } from '../transactions/Transaction.js';
export declare abstract class AbstractRpcProvider {
    protected abstract readonly provider: JsonRpcApiProvider;
    private nextId;
    protected constructor();
    getBlockNumber(): Promise<number>;
    getBlock(blockNumberOrHash: BlockTag, prefetchTxs?: boolean): Promise<Block>;
    getBlockByHash(blockHash: string): Promise<Block>;
    getBalance(addressLike: BitcoinAddressLike): Promise<bigint>;
    getUXTOs(address: BitcoinAddressLike, optimize?: boolean): Promise<unknown>;
    getTransaction(txHash: string): Promise<TransactionBase<OPNetTransactionTypes>>;
    getTransactionReceipt(txHash: string): Promise<ITransactionReceipt>;
    getNetwork(): Promise<Network>;
    getCode(address: BitcoinAddressLike, onlyBytecode?: boolean): Promise<ContractData | Buffer>;
    getStorageAt(address: BitcoinAddressLike, rawPointer: bigint | string, proofs?: boolean, height?: BigNumberish): Promise<StoredValue>;
    call(to: BitcoinAddressLike, data: Buffer | string, from?: BitcoinAddressLike, height?: BigNumberish): Promise<CallResult | ICallRequestError>;
    protected abstract providerUrl(url: string): string;
    private bufferToHex;
    private bigintToBase64;
    private callPayloadSingle;
    private buildJsonRpcPayload;
}
