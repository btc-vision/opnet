import { AbstractRpcProvider } from './AbstractRpcProvider.js';
export class JSONRpcProvider extends AbstractRpcProvider {
    constructor(url, timeout = 10000) {
        super();
        this.timeout = timeout;
        this.url = this.providerUrl(url);
    }
    async _send(payload) {
        const controller = new AbortController();
        const { signal } = controller;
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            timeout: this.timeout,
            signal: signal
        };
        try {
            const resp = await fetch(this.url, params);
            if (!resp.ok) {
                throw new Error(`Failed to fetch: ${resp.statusText}`);
            }
            clearTimeout(timeoutId);
            const fetchedData = await resp.json();
            if (!fetchedData) {
                throw new Error('No data fetched');
            }
            return [fetchedData];
        }
        catch (e) {
            const error = e;
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${this.timeout}ms`);
            }
            throw e;
        }
    }
    providerUrl(url) {
        url = url.trim();
        if (url.endsWith('/')) {
            return url.slice(0, -1);
        }
        if (url.includes('api/v1/json-rpc')) {
            return url;
        }
        else {
            return `${url}/api/v1/json-rpc`;
        }
    }
}
