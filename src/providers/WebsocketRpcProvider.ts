import { Network } from '@btc-vision/bitcoin';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JsonRpcCallResult } from './interfaces/JSONRpcResult.js';

/**
 * @description This class is used to provide a WebSocket RPC provider.
 * @class WebSocketRpcProvider
 * @category Providers
 */
export class WebSocketRpcProvider extends AbstractRpcProvider {
    private readonly wsUrl: string;

    constructor(url: string, network: Network) {
        super(network);

        this.wsUrl = this.providerUrl(url);
    }

    public _send(payload: JsonRpcPayload): Promise<JsonRpcCallResult> {
        throw new Error('Method not implemented.');
    }

    protected providerUrl(url: string): string {
        url = url.trim();

        if (url.endsWith('/')) {
            return url.slice(0, -1);
        }

        if (url.includes('api/v1/json-rpc-ws')) {
            return url;
        } else {
            return `${url}/api/v1/json-rpc-ws`;
        }
    }
}
