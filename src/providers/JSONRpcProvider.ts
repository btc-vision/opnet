import { JsonRpcProvider } from 'ethers';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';

/**
 * @description This class is used to provide a JSON RPC provider.
 * @class JSONRpcProvider
 * @category Providers
 */
export class JSONRpcProvider extends AbstractRpcProvider {
    private readonly url: string;

    protected readonly provider: JsonRpcProvider;

    constructor(url: string) {
        super();

        this.url = this.providerUrl(url);
        this.provider = new JsonRpcProvider(this.url);
    }

    protected providerUrl(url: string): string {
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
}
