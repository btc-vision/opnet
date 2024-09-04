import { AbstractRpcProvider } from './AbstractRpcProvider.js';
export class WebSocketRpcProvider extends AbstractRpcProvider {
    constructor(url) {
        super();
        this.wsUrl = this.providerUrl(url);
    }
    async _send(payload) {
        throw new Error('Method not implemented.');
    }
    providerUrl(url) {
        url = url.trim();
        if (url.endsWith('/')) {
            return url.slice(0, -1);
        }
        if (url.includes('api/v1/json-rpc-ws')) {
            return url;
        }
        else {
            return `${url}/api/v1/json-rpc-ws`;
        }
    }
}
