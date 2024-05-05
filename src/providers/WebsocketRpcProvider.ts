import { WebSocketProvider } from 'ethers';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';

/**
 * @description This class is used to provide a WebSocket RPC provider.
 * @class WebSocketRpcProvider
 * @category Providers
 */
export class WebSocketRpcProvider extends AbstractRpcProvider {
    private readonly wsUrl: string;

    protected readonly provider: WebSocketProvider;

    constructor(url: string) {
        super();

        this.wsUrl = this.providerUrl(url);
        this.provider = new WebSocketProvider(this.wsUrl);
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
