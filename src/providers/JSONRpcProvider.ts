import { Network } from '@btc-vision/bitcoin';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JsonRpcCallResult, JsonRpcError, JsonRpcResult } from './interfaces/JSONRpcResult.js';

import fetch from '../fetch/fetch.js';
import { Response } from 'undici/types/fetch';

/**
 * @description This class is used to provide a JSON RPC provider.
 * @class JSONRpcProvider
 * @category Providers
 */
export class JSONRpcProvider extends AbstractRpcProvider {
    public readonly url: string;

    constructor(
        url: string,
        network: Network,
        private readonly timeout: number = 20_000,
    ) {
        super(network);

        this.url = this.providerUrl(url);
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
                'User-Agent': 'OPNET/1.0',
                'Accept-Encoding': 'gzip, deflate, br',
                Accept: 'application/json',
                'Accept-Charset': 'utf-8',
                'Accept-Language': 'en-US',
                Connection: 'Keep-Alive',
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

            const fetchedData = (await resp.json()) as JsonRpcResult | JsonRpcError;
            if (!fetchedData) {
                throw new Error('No data fetched');
            }

            return [fetchedData];
        } catch (e) {
            console.log(e);
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
