import pLimit from 'p-limit';
import { Agent, fetch as undiciFetch, RequestInit, Response } from 'undici';
import { FetcherWithCleanup } from './fetcher-type.js';

export function getFetcher(configs: Agent.Options): FetcherWithCleanup {
    const agent = new Agent(configs);
    const limit = pLimit(500);

    async function limitedFetch(
        input: Parameters<typeof undiciFetch>[0],
        init?: RequestInit,
    ): Promise<Response> {
        return limit(() => undiciFetch(input, { ...init, dispatcher: agent }));
    }

    return {
        fetch: limitedFetch,
        close: async () => {
            await agent.close();
        },
    };
}

export default getFetcher;
