import { BlockTag, JsonRpcPayload, JsonRpcProvider, JsonRpcResult } from 'ethers';
import { Block } from '../block/Block.js';
import { IBlock } from '../interfaces/blocks/IBlock.js';

export class JSONRpcProvider {
    private readonly provider: JsonRpcProvider;
    private readonly url: string;

    private nextId: number = 0;

    constructor(url: string) {
        this.url = this.providerUrl(url);

        this.provider = new JsonRpcProvider(this.url);
    }

    private providerUrl(url: string): string {
        url = url.trim();

        if (url.endsWith('/')) {
            return url.slice(0, -1);
        }

        if (url.includes('api/v1/json-rpc')) {
            return url;
        } else {
            return `${url}/api/v1/json-rpc`;
        }
    }

    public async getBlockNumber(): Promise<number> {
        return await this.provider.getBlockNumber();
    }

    public async getBlock(
        blockNumber: BlockTag | string,
        prefetchTxs: boolean = false,
    ): Promise<Block> {
        const method =
            typeof blockNumber === 'string' ? 'btc_getBlockByHash' : 'btc_getBlockByNumber';

        const payload: JsonRpcPayload = this.buildJsonRpcPayload(method, [
            blockNumber,
            prefetchTxs,
        ]);

        const blockData: JsonRpcResult[] = await this.provider._send(payload);
        const block = blockData.shift();

        if (!block) {
            throw new Error('Block not found');
        }

        const result: IBlock = block.result;
        return new Block(result);
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
