import pLimit from 'p-limit';
import { Agent, fetch as undiciFetch, Response, setGlobalDispatcher } from 'undici';

const agent = new Agent({
    keepAliveTimeout: 30_000, // how long sockets stay open
    keepAliveTimeoutThreshold: 30_000, // threshold before closing keep-alive sockets
    connections: 150, // max connections per server
    pipelining: 1, // max pipelining per server
});

setGlobalDispatcher(agent);

const limit = pLimit(200);

async function limitedFetch(...args: Parameters<typeof undiciFetch>): Promise<Response> {
    return limit(() => undiciFetch(...args));
}

/*async function limitedFetch(url: RequestInfo, options: BasicFetchOptions = {}): Promise<Response> {
    return limit(() => fetchTest(url, options));
}*/

export default limitedFetch;
export { limitedFetch as fetch };
