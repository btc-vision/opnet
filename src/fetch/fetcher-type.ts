import { RequestInfo, RequestInit, Response } from 'undici';

export type Fetcher = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface FetcherWithCleanup {
    fetch: Fetcher;
    close: () => Promise<void>;
}
