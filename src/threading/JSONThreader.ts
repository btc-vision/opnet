/**
 * Worker-based JSON threader for Node.js and browsers.
 *
 * Uses Web Workers (browser) or worker_threads (Node.js) for parallel
 * JSON operations. React Native automatically uses WorkletJsonThreader
 * when react-native-worklets is available, otherwise falls back to
 * SequentialJsonThreader.
 *
 * @packageDocumentation
 */

import { ThreaderOptions, WorkerScript } from './interfaces/IThread.js';
import { BaseThreader } from './SharedThreader.js';
import { isReactNative } from './WorkerCreator.js';
import { jsonWorkerScript } from './worker-scripts/JSONWorker.js';

import type { JsonValue, FetchRequest, IJsonThreader } from './interfaces/IJsonThreader.js';

type JsonOp = 'parse' | 'stringify' | 'fetch';
type JsonInput = string | JsonValue | ArrayBuffer | FetchRequest;
type JsonOutput = string | JsonValue;

declare const __IS_SERVICE_WORKER__: boolean | undefined;

let _isServiceWorker: boolean | null = null;

/**
 * Checks if we're running in a Service Worker context.
 */
function checkIsServiceWorker(): boolean {
    if (_isServiceWorker !== null) return _isServiceWorker;

    if (typeof __IS_SERVICE_WORKER__ !== 'undefined' && __IS_SERVICE_WORKER__) {
        _isServiceWorker = true;
        return true;
    }

    if (
        typeof ServiceWorkerGlobalScope !== 'undefined' &&
        self instanceof ServiceWorkerGlobalScope
    ) {
        _isServiceWorker = true;
        return true;
    }

    _isServiceWorker = false;
    return false;
}

const isServiceWorker: boolean = checkIsServiceWorker();

/**
 * Worker-based JSON threader for Node.js and browsers.
 *
 * Provides parallel JSON parsing, stringification, and HTTP fetch
 * using worker threads.
 *
 * @example
 * ```typescript
 * import { JsonThreader } from 'opnet';
 *
 * const threader = new JsonThreader({ poolSize: 4 });
 * const data = await threader.parse(largeJsonString);
 * await threader.terminate();
 * ```
 */
export class JsonThreader
    extends BaseThreader<JsonOp, JsonInput, JsonOutput>
    implements IJsonThreader
{
    protected readonly workerScript: WorkerScript = jsonWorkerScript;
    private readonly threadingThreshold: number;

    public constructor(options: ThreaderOptions & { threadingThreshold?: number } = {}) {
        super(options);
        this.threadingThreshold = options.threadingThreshold ?? 16_384;
    }

    public async parse<T = JsonValue>(json: string): Promise<T> {
        if (isServiceWorker || json.length < this.threadingThreshold) {
            return JSON.parse(json) as T;
        }
        const result = await this.run('parse', json);
        return result as T;
    }

    public async parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T> {
        if (isServiceWorker || buffer.byteLength <= this.threadingThreshold) {
            const text = new TextDecoder().decode(buffer);
            return JSON.parse(text) as T;
        }

        const result = await this.runWithTransfer('parse', buffer, [buffer]);
        return result as T;
    }

    public async stringify(data: JsonValue): Promise<string> {
        const result = JSON.stringify(data);
        if (isServiceWorker || result.length < this.threadingThreshold) {
            return result;
        }
        return (await this.run('stringify', data)) as string;
    }

    public async fetch<T = JsonValue>(request: FetchRequest): Promise<T> {
        if (isServiceWorker) {
            // Fallback to main thread fetch in service worker context
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                request.timeout || 20_000,
            );

            try {
                const resp = await fetch(request.url, {
                    method: 'POST',
                    headers: request.headers || {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(request.payload),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
                }

                return (await resp.json()) as T;
            } catch (err) {
                clearTimeout(timeoutId);
                if ((err as Error).name === 'AbortError') {
                    throw new Error(`Request timed out after ${request.timeout || 20_000}ms`);
                }
                throw err;
            }
        }

        const result = await this.run('fetch', request);
        return result as T;
    }
}

// Global singleton with lazy initialization
const GLOBAL_KEY = Symbol.for('opnet.jsonThreader');
const INIT_KEY = Symbol.for('opnet.jsonThreader.init');
const globalObj = (typeof globalThis !== 'undefined' ? globalThis : global) as Record<
    symbol,
    IJsonThreader | Promise<IJsonThreader> | undefined
>;

/**
 * Creates the appropriate threader for the current runtime.
 * - React Native: WorkletJsonThreader (with worklets) or SequentialJsonThreader (fallback)
 * - Browser/Node: JsonThreader (worker-based)
 */
async function createThreader(): Promise<IJsonThreader> {
    if (isReactNative) {
        // Try WorkletJsonThreader first (requires react-native-worklets)
        try {
            const { WorkletJsonThreader } = await import('./JSONThreader.worklet.js');
            return WorkletJsonThreader.getInstance();
        } catch {
            // Fall back to sequential if worklets not available
            const { SequentialJsonThreader } = await import('./JSONThreader.sequential.js');
            return SequentialJsonThreader.getInstance();
        }
    }

    return new JsonThreader();
}

/**
 * Initializes and returns the global JSON threader instance.
 *
 * Automatically selects the best implementation:
 * - Node.js/Browser: Worker-based threading
 * - React Native: Worklet-based threading (or sequential fallback)
 */
export async function initJsonThreader(): Promise<IJsonThreader> {
    if (globalObj[GLOBAL_KEY]) {
        return globalObj[GLOBAL_KEY] as IJsonThreader;
    }

    if (globalObj[INIT_KEY]) {
        return globalObj[INIT_KEY] as Promise<IJsonThreader>;
    }

    const initPromise = createThreader().then((threader) => {
        globalObj[GLOBAL_KEY] = threader;
        globalObj[INIT_KEY] = undefined;
        return threader;
    });

    globalObj[INIT_KEY] = initPromise;
    return initPromise;
}

// For non-React-Native environments, create sync singleton for backward compatibility
// React Native users should call initJsonThreader() before using
if (!isReactNative && !globalObj[GLOBAL_KEY]) {
    globalObj[GLOBAL_KEY] = new JsonThreader();
}

/**
 * Global JSON threader instance.
 *
 * For React Native, call initJsonThreader() first to ensure proper initialization.
 * For Node.js/Browser, this is ready to use immediately.
 */
export const jsonThreader: IJsonThreader = (globalObj[GLOBAL_KEY] as IJsonThreader) ?? {
    // Proxy that defers to initialized instance for React Native
    get stats() {
        throw new Error('Call initJsonThreader() before using jsonThreader in React Native');
    },
    async parse<T>(json: string): Promise<T> {
        const t = await initJsonThreader();
        return t.parse<T>(json);
    },
    async parseBuffer<T>(buffer: ArrayBuffer): Promise<T> {
        const t = await initJsonThreader();
        return t.parseBuffer<T>(buffer);
    },
    async stringify(data: JsonValue): Promise<string> {
        const t = await initJsonThreader();
        return t.stringify(data);
    },
    async fetch<T>(request: FetchRequest): Promise<T> {
        const t = await initJsonThreader();
        return t.fetch<T>(request);
    },
    async terminate(): Promise<void> {
        const t = await initJsonThreader();
        return t.terminate();
    },
};
