import '../serialize/BigInt.js';
import { BufferHelper } from '@btc-vision/bsi-binary';
import { Network, networks } from 'bitcoinjs-lib';

import {
    BigNumberish,
    BlockTag,
    JsonRpcApiProvider,
    JsonRpcError,
    JsonRpcPayload,
    JsonRpcResult,
} from 'ethers';

import { IUTXO, UTXO } from '../bitcoin/UTXOs.js';
import { Block } from '../block/Block.js';
import { IBlock } from '../block/interfaces/IBlock.js';
import { BitcoinAddressLike } from '../common/CommonTypes.js';
import { CallResult } from '../contracts/CallResult.js';
import { ContractData } from '../contracts/ContractData.js';
import { ICallRequestError, ICallResult } from '../contracts/interfaces/ICallResult.js';
import { IRawContract } from '../contracts/interfaces/IRawContract.js';
import { OPNetTransactionTypes } from '../interfaces/opnet/OPNetTransactionTypes.js';
import { IStorageValue } from '../storage/interfaces/IStorageValue.js';
import { StoredValue } from '../storage/StoredValue.js';
import { ITransaction } from '../transactions/interfaces/ITransaction.js';
import { ITransactionReceipt } from '../transactions/interfaces/ITransactionReceipt.js';
import { TransactionBase } from '../transactions/Transaction.js';
import { TransactionParser } from '../transactions/TransactionParser.js';
import { TransactionReceipt } from '../transactions/TransactionReceipt.js';

type JsonRpcCallResult = (JsonRpcResult | JsonRpcError)[];

/**
 * @description This class is used to provide an abstract RPC provider.
 * @abstract
 * @class AbstractRpcProvider
 * @category Providers
 */
export abstract class AbstractRpcProvider {
    protected abstract readonly provider: JsonRpcApiProvider;

    private nextId: number = 0;

    protected constructor() {}

    /**
     * Get the latest block number.
     * @description This method is used to get the latest block number.
     * @returns {Promise<number>} The latest block number
     * @example await getBlockNumber();
     */
    public async getBlockNumber(): Promise<number> {
        return await this.provider.getBlockNumber();
    }

    /**
     * Get block by number or hash.
     * @param {BlockTag} blockNumberOrHash The block number or hash
     * @param {boolean} prefetchTxs Whether to prefetch transactions
     * @description This method is used to get a block by its number or hash.
     * @returns {Promise<Block>} The requested block
     * @throws {Error} If the block is not found
     * @example await getBlock(123456);
     */
    public async getBlock(
        blockNumberOrHash: BlockTag,
        prefetchTxs: boolean = false,
    ): Promise<Block> {
        const method =
            typeof blockNumberOrHash === 'string' ? 'btc_getBlockByHash' : 'btc_getBlockByNumber';

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(method, [
            blockNumberOrHash,
            prefetchTxs,
        ]);

        const block: JsonRpcResult = await this.callPayloadSingle(payload);

        const result: IBlock = block.result;
        return new Block(result);
    }

    /**
     * Get block by hash. This is the same method as getBlock.
     * @param {string} blockHash The block hash
     * @description This method is used to get a block by its hash. Note that this method is the same as getBlock.
     * @returns {Promise<Block>} The requested block
     * @throws {Error} If the block is not found
     */
    public async getBlockByHash(blockHash: string): Promise<Block> {
        return await this.getBlock(blockHash);
    }

    /**
     * Get the bitcoin balance of an address.
     * @param {BitcoinAddressLike} addressLike The address to get the balance of
     * @description This method is used to get the balance of a bitcoin address.
     * @returns {Promise<bigint>} The balance of the address
     * @example await getBalance('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
     */
    public async getBalance(addressLike: BitcoinAddressLike): Promise<bigint> {
        const address: string = addressLike.toString();
        const payload: JsonRpcPayload = this.buildJsonRpcPayload('btc_getBalance', [address]);
        const rawBalance: JsonRpcResult = await this.callPayloadSingle(payload);

        const result: string = rawBalance.result;
        if (!result || (result && !result.startsWith('0x'))) {
            throw new Error(`Invalid balance returned from provider: ${result}`);
        }

        return BigInt(result);
    }

    /**
     * Get the UTXOs (Unspent Transaction Outputs) of an address.
     * @description This method is used to get the UTXOs of a bitcoin address.
     * @param {BitcoinAddressLike} address The address to get the UTXOs of
     * @param {boolean} optimize Whether to optimize the UTXOs
     * @returns {Promise<UTXOs>} The UTXOs of the address
     * @example await getUXTOsOf('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
     * @throws {Error} If something went wrong while fetching the UTXOs
     */
    public async getUXTOs(
        address: BitcoinAddressLike,
        optimize: boolean = false,
    ): Promise<unknown> {
        const addressStr: string = address.toString();
        const payload: JsonRpcPayload = this.buildJsonRpcPayload('btc_getUTXOs', [
            addressStr,
            optimize,
        ]);

        const rawUXTOs: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: IUTXO[] = rawUXTOs.result || [];

        return result.map((utxo: IUTXO) => {
            return new UTXO(utxo);
        });
    }

    /**
     * Get a transaction by its hash or hash id.
     * @description This method is used to get a transaction by its hash or hash id.
     * @param {string} txHash The transaction hash
     * @returns {Promise<TransactionBase<OPNetTransactionTypes>>} The requested transaction
     * @example await getTransaction('63e77ba9fa4262b3d4d0d9d97fa8a7359534606c3f3af096284662e3f619f374');
     * @throws {Error} If something went wrong while fetching the transaction
     */
    public async getTransaction(txHash: string): Promise<TransactionBase<OPNetTransactionTypes>> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload('btc_getTransactionByHash', [
            txHash,
        ]);

        const rawTransaction: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: ITransaction = rawTransaction.result;

        return TransactionParser.parseTransaction(result);
    }

    /**
     * Get a transaction receipt by its hash.
     * @description This method is used to get a transaction receipt by its hash.
     * @param {string} txHash The transaction hash
     * @returns {Promise<ITransactionReceipt>} The requested transaction receipt
     * @example await getTransactionReceipt('63e77ba9fa4262b3d4d0d9d97fa8a7359534606c3f3af096284662e3f619f374');
     * @throws {Error} Something went wrong while fetching the transaction receipt
     */
    public async getTransactionReceipt(txHash: string): Promise<ITransactionReceipt> {
        const payload: JsonRpcPayload = this.buildJsonRpcPayload('btc_getTransactionReceipt', [
            txHash,
        ]);

        const rawTransaction: JsonRpcResult = await this.callPayloadSingle(payload);
        return new TransactionReceipt(rawTransaction.result);
    }

    /**
     * Get the current connected network type.
     * @description This method is used to get the current connected network type.
     * @returns {Promise<Network>} The current connected network type
     * @throws {Error} If the chain id is invalid
     */
    public async getNetwork(): Promise<Network> {
        const network = await this.provider.getNetwork();

        switch (network.chainId) {
            case 1n:
                return networks.bitcoin;
            case 2n:
                return networks.testnet;
            case 3n:
                return networks.regtest;

            default:
                throw new Error(`Invalid chain id: ${network.chainId}`);
        }
    }

    /**
     * Get the contract code of an address.
     * @description This method is used to get the contract code of an address.
     * @param {BitcoinAddressLike} address The address of the contract
     * @param {boolean} [onlyBytecode] Whether to return only the bytecode
     * @returns {Promise<ContractData | Buffer>} The contract data or bytecode
     * @example await getCode('tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a');
     * @throws {Error} If something went wrong while fetching the contract code
     */
    public async getCode(
        address: BitcoinAddressLike,
        onlyBytecode: boolean = false,
    ): Promise<ContractData | Buffer> {
        const addressStr: string = address.toString();
        const payload: JsonRpcPayload = this.buildJsonRpcPayload('btc_getCode', [
            addressStr,
            onlyBytecode,
        ]);

        const rawCode: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: IRawContract | { bytecode: string } = rawCode.result;

        if ('contractAddress' in result) {
            return new ContractData(result);
        } else {
            return Buffer.from(result.bytecode, 'base64');
        }
    }

    /**
     * Get the storage at a specific address and pointer.
     * @description This method is used to get the storage at a specific address and pointer.
     * @param {BitcoinAddressLike} address The address to get the storage from
     * @param {BigNumberish} rawPointer The pointer to get the storage from as base64 or bigint
     * @param {boolean} proofs Whether to send proofs or not
     * @param {BigNumberish} [height] The height to get the storage from
     * @returns {Promise<StoredValue>} The storage value
     * @example await getStorageAt('tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a', 'EXLK/QhEQMI5d9DrthLvozT+UcDQ7WuSPaz7g8GV3AQ=');
     * @throws {Error} If something went wrong while fetching the storage
     */
    public async getStorageAt(
        address: BitcoinAddressLike,
        rawPointer: bigint | string,
        proofs: boolean = true,
        height?: BigNumberish,
    ): Promise<StoredValue> {
        const addressStr: string = address.toString();
        const pointer: string =
            typeof rawPointer === 'string' ? rawPointer : this.bigintToBase64(rawPointer);

        const params: [string, string, boolean, string?] = [addressStr, pointer, proofs];

        if (height) {
            params.push(height.toString());
        }

        const payload: JsonRpcPayload = this.buildJsonRpcPayload('btc_getStorageAt', params);

        const rawStorage: JsonRpcResult = await this.callPayloadSingle(payload);
        const result: IStorageValue = rawStorage.result;

        return new StoredValue(result);
    }

    /**
     * Call a contract function with a given calldata.
     * @description This method is used to call a contract function with a given calldata.
     * @param {BitcoinAddressLike} to The address of the contract
     * @param {Buffer} data The calldata of the contract function
     * @param {BitcoinAddressLike} [from] The address to call the contract from
     * @param {BigNumberish} [height] The height to call the contract from
     * @returns {Promise<CallResult>} The result of the contract function call
     * @example await call('tb1pth90usc4f528aqphpjrfkkdm4vy8hxnt5gps6aau2nva6pxeshtqqzlt3a', Buffer.from('0x12345678'));
     * @throws {Error} If something went wrong while calling the contract
     */
    public async call(
        to: BitcoinAddressLike,
        data: Buffer | string,
        from?: BitcoinAddressLike,
        height?: BigNumberish,
    ): Promise<CallResult | ICallRequestError> {
        const toStr: string = to.toString();
        const fromStr: string | null = from ? from.toString() : null;

        let dataStr: string = Buffer.isBuffer(data) ? this.bufferToHex(data) : data;
        if (dataStr.startsWith('0x')) {
            dataStr = dataStr.slice(2);
        }

        const params: [string, string, string?, string?] = [toStr, dataStr];
        if (fromStr) {
            params.push(fromStr);
        }

        if (height) {
            params.push(height.toString());
        }

        const payload: JsonRpcPayload = this.buildJsonRpcPayload('btc_call', params);
        const rawCall: JsonRpcResult = await this.callPayloadSingle(payload);
        
        const result: ICallResult = rawCall.result;
        if ('error' in result) {
            return result;
        }

        return new CallResult(result);
    }

    protected abstract providerUrl(url: string): string;

    private bufferToHex(buffer: Buffer): string {
        return buffer.toString('hex');
    }

    private bigintToBase64(bigint: bigint): string {
        return Buffer.from(BufferHelper.pointerToUint8Array(bigint)).toString('base64');
    }

    /**
     * Send a single payload. This method is used to send a single payload.
     * @param {JsonRpcPayload} payload The payload to send
     * @returns {Promise<JsonRpcResult>} The result of the payload
     * @throws {Error} If no data is returned
     * @private
     */
    private async callPayloadSingle(payload: JsonRpcPayload): Promise<JsonRpcResult> {
        const rawData: JsonRpcCallResult = await this.provider._send(payload);
        if (rawData.length !== 1) {
            throw new Error(`Unexpected response length for get block request: ${rawData.length}`);
        }

        const data = rawData.shift();
        if (!data) {
            throw new Error('Block not found');
        }

        if ('error' in data) {
            throw new Error(`Something went wrong while fetching: ${data.error.message}`);
        }

        return data;
    }

    private buildJsonRpcPayload(method: string, params: unknown[]): JsonRpcPayload {
        return {
            method: method,
            params: params,
            id: this.nextId++,
            jsonrpc: '2.0',
        };
    }
}
