import { Network } from '@btc-vision/bitcoin';
import Agent from 'undici/types/agent.js';
import { Response } from 'undici/types/fetch';

import getFetcher from '../fetch/fetch.js';
import { Fetcher, FetcherWithCleanup } from '../fetch/fetcher-type.js';
import type { JsonValue } from '../threading/interfaces/IJsonThreader.js';
import { jsonThreader } from '../threading/JSONThreader.js';
import { AbstractRpcProvider } from './AbstractRpcProvider.js';
import { JsonRpcPayload } from './interfaces/JSONRpc.js';
import { JsonRpcCallResult, JsonRpcError, JsonRpcResult } from './interfaces/JSONRpcResult.js';

/**
 * @description Configuration for the JSONRpcProvider.
 * @interface JSONRpcProviderConfig
 * @property {string} url - The URL of the JSON RPC provider
 * @property {Network} network - The network to connect to
 * @property {number} [timeout] - The timeout for requests in milliseconds (default: 20,000)
 * @property {Agent.Options} [fetcherConfigurations] - Optional configurations for the HTTP fetcher
 * @property {boolean} [useThreadedParsing] - Whether to use threaded JSON parsing (default: false)
 * @property {boolean} [useThreadedHttp] - Whether to use threaded HTTP requests (default: false)
 */
export interface JSONRpcProviderConfig {
    readonly url: string;
    readonly network: Network;
    readonly timeout?: number;
    readonly fetcherConfigurations?: Agent.Options;
    //readonly useRESTAPI?: false; // not supported yet, reserved for future use
    readonly useThreadedParsing?: boolean;
    readonly useThreadedHttp?: boolean;
}

/**
 * @description This class is used to provide a JSON RPC provider.
 * @class JSONRpcProvider
 * @category Providers
 */
export class JSONRpcProvider extends AbstractRpcProvider {
    public readonly url: string;

    private readonly timeout: number;
    private readonly fetcherConfigurations: Agent.Options;

    //private useRESTAPI: boolean;

    private readonly useThreadedParsing: boolean;
    private readonly useThreadedHttp: boolean;

    private _fetcherWithCleanup: FetcherWithCleanup | undefined;

    constructor(config: JSONRpcProviderConfig) {
        super(config.network);

        this.timeout = config.timeout ?? 20_000;

        this.fetcherConfigurations = config.fetcherConfigurations ?? {
            keepAliveTimeout: 30_000,
            keepAliveTimeoutThreshold: 30_000,
            connections: 128,
            pipelining: 2,
        };

        //this.useRESTAPI = config.useRESTAPI ?? true;
        this.useThreadedParsing = config.useThreadedParsing ?? false;
        this.useThreadedHttp = config.useThreadedHttp ?? false;

        this.url = this.providerUrl(config.url);
    }

    private get fetcher(): Fetcher {
        if (!this._fetcherWithCleanup) {
            this._fetcherWithCleanup = getFetcher(this.fetcherConfigurations);
        }
        return this._fetcherWithCleanup.fetch;
    }

    public async close(): Promise<void> {
        if (this._fetcherWithCleanup) {
            await this._fetcherWithCleanup.close();
            this._fetcherWithCleanup = undefined;
        }
    }

    /**
     * @description Sets the fetch mode to use REST API or not.
     * @param {boolean} useRESTAPI - Whether to use REST API or not
     * @returns {void}
     */
    /*public setFetchMode(useRESTAPI: boolean) {
        this.useRESTAPI = useRESTAPI;
    }*/

    /**
     * @description Sends a JSON RPC payload to the provider.
     * @param {JsonRpcPayload | JsonRpcPayload[]} payload - The payload to send
     * @returns {Promise<JsonRpcCallResult>} - The result of the call
     */
    public async _send(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcCallResult> {
        // Use threaded HTTP - full request runs in worker thread
        if (this.useThreadedHttp) {
            const fetchedData = await jsonThreader.fetch<JsonRpcResult | JsonRpcError>({
                url: this.url,
                payload: payload as unknown as JsonValue,
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'OPNET/1.0',
                    Accept: 'application/json',
                    'Accept-Charset': 'utf-8',
                    'Accept-Language': 'en-US',
                },
            });

            if (!fetchedData) {
                throw new Error('No data fetched');
            }

            return [fetchedData];
        }

        // Fallback: main thread HTTP with optional threaded JSON parsing
        const controller = new AbortController();
        const { signal } = controller;

        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'OPNET/1.0',
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

            const fetchedData = await this.parseResponse<JsonRpcResult | JsonRpcError>(resp);
            if (!fetchedData) {
                throw new Error('No data fetched');
            }

            return [fetchedData];
        } catch (e) {
            const error = e as Error;
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${this.timeout}ms`, { cause: e });
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

    private async parseResponse<T>(resp: Response): Promise<T> {
        if (this.useThreadedParsing) {
            const buffer = await resp.arrayBuffer();
            return jsonThreader.parseBuffer<T>(buffer);
        }

        return (await resp.json()) as Promise<T>;
    }
}
