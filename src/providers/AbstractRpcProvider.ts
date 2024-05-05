import '../serialize/BigInt.js';

import { BlockTag, JsonRpcApiProvider, JsonRpcError, JsonRpcPayload, JsonRpcResult } from 'ethers';
import { Block } from '../block/Block.js';
import { IBlock } from '../block/interfaces/IBlock.js';

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

        const blockData: JsonRpcCallResult = await this.provider._send(payload);
        if (blockData.length !== 1) {
            throw new Error(
                `Unexpected response length for get block request: ${blockData.length}`,
            );
        }

        const block = blockData.shift();
        if (!block) {
            throw new Error('Block not found');
        }

        if ('error' in block) {
            throw new Error(`Something went wrong while fetching block: ${block.error.message}`);
        }

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

    protected abstract providerUrl(url: string): string;

    private buildJsonRpcPayload(method: string, params: unknown[]): JsonRpcPayload {
        return {
            method: method,
            params: params,
            id: this.nextId++,
            jsonrpc: '2.0',
        };
    }
}
