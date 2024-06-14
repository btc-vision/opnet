import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JsonRpcCallResult } from './interfaces/JSONRpcResult.js';
export declare class JSONRpcProvider extends AbstractRpcProvider {
    private readonly url;
    constructor(url: string);
    _send(payload: JsonRpcPayload): Promise<JsonRpcCallResult>;
    protected providerUrl(url: string): string;
}
