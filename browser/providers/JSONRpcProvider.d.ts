import { BlockTag } from 'ethers';
import { Block } from '../block/Block.js';
export declare class JSONRpcProvider {
    private readonly provider;
    private readonly url;
    private nextId;
    constructor(url: string);
    private providerUrl;
    getBlockNumber(): Promise<number>;
    getBlock(blockNumber: BlockTag | string, prefetchTxs?: boolean): Promise<Block>;
    private buildJsonRpcPayload;
}
