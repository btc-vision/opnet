import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JsonRpcCallResult } from './interfaces/JSONRpcResult.js';
export declare class JSONRpcProvider extends AbstractRpcProvider {
    private readonly timeout;
    private readonly url;
    constructor(url: string, timeout?: number);
    _send(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcCallResult>;
    protected providerUrl(url: string): string;
}
