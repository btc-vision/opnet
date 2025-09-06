import { Network } from '@btc-vision/bitcoin';
import Agent from 'undici/types/agent.js';
import { Response } from 'undici/types/fetch';

import getFetcher from '../fetch/fetch.js';
import { Fetcher } from '../fetch/fetcher-type.js';
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
        network: Network,
        private readonly timeout: number = 20_000,
        private readonly fetcherConfigurations: Agent.Options = {
            keepAliveTimeout: 30_000, // how long sockets stay open
            keepAliveTimeoutThreshold: 30_000, // threshold before closing keep-alive sockets
            connections: 128, // max connections per server
            pipelining: 2, // max pipelining per server
        },
        private useRESTAPI: boolean = true,
    ) {
        super(network);

        this.url = this.providerUrl(url);
    }

    private _fetcher: Fetcher | undefined;

    private get fetcher(): Fetcher {
        if (!this._fetcher) {
            this._fetcher = getFetcher(this.fetcherConfigurations);
        }

        return this._fetcher;
    }

    /**
     * @description Sets the fetch mode to use REST API or not.
     * @param {boolean} useRESTAPI - Whether to use REST API or not
     * @returns {void}
     */
    public setFetchMode(useRESTAPI: boolean) {
        this.useRESTAPI = useRESTAPI;
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
                //'Accept-Encoding': 'gzip, deflate, br',
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
            const resp: Response = await this.fetcher(this.url, params);
            if (!resp.ok) {
                throw new Error(`Failed to fetch: ${resp.statusText}`);
            }

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
        } finally {
            clearTimeout(timeoutId);
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
