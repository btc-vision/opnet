import pLimit from 'p-limit';
import { Agent, fetch as undiciFetch, Response, setGlobalDispatcher } from 'undici';
import { Fetcher } from './fetcher-type.js';

export function getFetcher(configs: Agent.Options): Fetcher {
    const agent = new Agent(configs);

    setGlobalDispatcher(agent);

    const limit = pLimit(500);

    async function limitedFetch(...args: Parameters<typeof undiciFetch>): Promise<Response> {
        return limit(() => undiciFetch(...args));
    }

    return limitedFetch;
}

export default getFetcher;
