import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JsonRpcCallResult, JsonRpcError, JsonRpcResult } from './interfaces/JSONRpcResult.js';

/**
 * @description This class is used to provide a JSON RPC provider.
 * @class JSONRpcProvider
 * @category Providers
 */
export class JSONRpcProvider extends AbstractRpcProvider {
    public readonly url: string;

    constructor(
        url: string,
        private readonly timeout: number = 10_000,
    ) {
        super();

        this.url = this.providerUrl(url);
    }

    /**
     * @description Fetches the public key info for a given address.
     * @param {string} address - The public key or address to fetch the info for
     * @returns {Promise<IPublicKeyInfo | null>} - The public key info for the address
     * @throws {Error} - If the fetch fails
     * @example
     * ```typescript
     * const provider = new JSONRpcProvider('https://regtest.opnet.org');
     * const publicKeyInfo = await provider.getPublicKeyInfo('bcrt1pa0y4fd0sxma50kv9vgqtgll7fd9g3jrsveu4syrnu5s50eurw06sjk54s2');
     * console.log(publicKeyInfo);
     * ```
     */
    public async getPublicKeyInfo(address: string): Promise<IPublicKeyInfo | null> {
        const res = await fetch(
            `${this.url.replace('/api/v1/json-rpc', '')}/api/v1/address/public-key-info`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            },
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const data = (await res.json()) as IPublicKeyInfoData | null;
        if (!data) throw new Error('No data fetched');

        return data[address];
    }

    /**
     * @description Sends a JSON RPC payload to the provider.
     * @param {JsonRpcPayload | JsonRpcPayload[]} payload - The payload to send
     * @returns {Promise<JsonRpcCallResult>} - The result of the call
     */
    public async _send(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcCallResult> {
        // Create an AbortController instance
        const controller = new AbortController();
        const { signal } = controller;

        // Start a timer that will abort the fetch after the timeout period
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            timeout: this.timeout,
            signal: signal,
        };

        try {
            const resp: Response = await fetch(this.url, params);
            if (!resp.ok) {
                throw new Error(`Failed to fetch: ${resp.statusText}`);
            }

            clearTimeout(timeoutId);

            //const str = await resp.text();
            //fs.writeFileSync('response.json', str);

            const fetchedData = (await resp.json()) as JsonRpcResult | JsonRpcError;
            if (!fetchedData) {
                throw new Error('No data fetched');
            }

            return [fetchedData];
        } catch (e) {
            const error = e as Error;
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${this.timeout}ms`);
            }

            throw e;
        }
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
