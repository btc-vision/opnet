import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JsonRpcCallResult } from './interfaces/JSONRpcResult.js';

/**
 * @description This class is used to provide a JSON RPC provider.
 * @class JSONRpcProvider
 * @category Providers
 */
export class JSONRpcProvider extends AbstractRpcProvider {
    private readonly url: string;

    constructor(url: string) {
        super();

        this.url = this.providerUrl(url);
    }

    /**
     * @description Sends a JSON RPC payload to the provider.
     * @param {JsonRpcPayload} payload - The payload to send
     * @returns {Promise<JsonRpcCallResult>} - The result of the call
     */
    public async _send(payload: JsonRpcPayload): Promise<JsonRpcCallResult> {
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        const resp: Response = await fetch(this.url, params);
        if (!resp.ok) {
            throw new Error(`Failed to fetch: ${resp.statusText}`);
        }

        const fetchedData = await resp.json();
        if (!fetchedData) {
            throw new Error('No data fetched');
        }

        return [fetchedData];
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
