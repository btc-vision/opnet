import { ResultMessage, TaskMessage, UniversalWorker, WorkerScript } from './interfaces/IThread.js';

/**
 * Runtime detection utilities.
 */
export const isNode =
    typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export const isReactNative =
    typeof navigator !== 'undefined' &&
    (navigator as { product?: string }).product === 'ReactNative';

export const isBrowser =
    !isNode &&
    !isReactNative &&
    typeof window !== 'undefined' &&
    typeof Worker !== 'undefined';

/**
 * Detects the current runtime environment.
 */
export function detectRuntime(): 'node' | 'browser' | 'react-native' | 'unknown' {
    if (isReactNative) return 'react-native';
    if (isNode) return 'node';
    if (isBrowser) return 'browser';
    return 'unknown';
}

/**
 * Creates a worker appropriate for the current runtime.
 *
 * - Node.js: Uses worker_threads
 * - Browser: Uses Web Workers with Blob URLs
 * - React Native: Uses sequential (main-thread) execution
 */
export async function createWorker<TOp extends string, TData, TResult>(
    workerScript: WorkerScript,
): Promise<UniversalWorker<TOp, TData, TResult>> {
    if (isNode) {
        return createNodeWorker<TOp, TData, TResult>(workerScript);
    } else if (isReactNative) {
        return createSequentialWorker<TOp, TData, TResult>();
    } else {
        return createBrowserWorker<TOp, TData, TResult>(workerScript);
    }
}

/**
 * Creates a Node.js worker using worker_threads.
 */
async function createNodeWorker<TOp extends string, TData, TResult>(
    workerScript: WorkerScript,
): Promise<UniversalWorker<TOp, TData, TResult>> {
    const { Worker } = await import('worker_threads');
    const worker = new Worker(workerScript, { eval: true });

    worker.on('error', (err) => {
        console.error('[WorkerCreator] Worker error:', err);
    });

    let messageCallback: ((msg: ResultMessage<TResult>) => void) | null = null;

    worker.on('message', (msg: ResultMessage<TResult>) => {
        if (messageCallback) messageCallback(msg);
    });

    // unref AFTER all listeners are set up
    worker.unref();

    return {
        postMessage: (msg: TaskMessage<TOp, TData>, transferables?: ArrayBuffer[]) => {
            if (transferables && transferables.length > 0) {
                worker.postMessage(msg, transferables);
            } else {
                worker.postMessage(msg);
            }
        },
        onMessage: (callback: (msg: ResultMessage<TResult>) => void) => {
            messageCallback = callback;
        },
        terminate: async () => {
            await worker.terminate();
        },
    };
}

/**
 * Creates a browser worker using Web Workers and Blob URLs.
 */
function createBrowserWorker<TOp extends string, TData, TResult>(
    workerScript: WorkerScript,
): UniversalWorker<TOp, TData, TResult> {
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    worker.onerror = (err) => {
        console.error('[WorkerCreator] Worker error:', err);
    };

    return {
        postMessage: (msg: TaskMessage<TOp, TData>, transferables?: ArrayBuffer[]) => {
            if (transferables && transferables.length > 0) {
                worker.postMessage(msg, transferables);
            } else {
                worker.postMessage(msg);
            }
        },
        onMessage: (callback: (msg: ResultMessage<TResult>) => void) => {
            worker.onmessage = (e: MessageEvent<ResultMessage<TResult>>) => callback(e.data);
        },
        terminate: () => {
            worker.terminate();
            URL.revokeObjectURL(url);
        },
    };
}

/**
 * Creates a sequential "worker" for React Native.
 *
 * Executes tasks on the main thread since Web Workers
 * and Blob URLs are not available in React Native.
 *
 * Uses setTimeout(0) to match the async message-passing pattern of real workers.
 */
function createSequentialWorker<TOp extends string, TData, TResult>(): UniversalWorker<
    TOp,
    TData,
    TResult
> {
    let messageCallback: ((msg: ResultMessage<TResult>) => void) | null = null;
    let terminated = false;

    return {
        postMessage: (msg: TaskMessage<TOp, TData>) => {
            if (terminated) return;

            // Process async to match worker behavior
            setTimeout(async () => {
                if (terminated || !messageCallback) return;

                const { id, op, data } = msg;

                try {
                    let result: TResult;

                    if (op === 'parse') {
                        const text =
                            data instanceof ArrayBuffer
                                ? new TextDecoder().decode(data)
                                : (data as string);
                        result = JSON.parse(text) as TResult;
                    } else if (op === 'stringify') {
                        result = JSON.stringify(data) as TResult;
                    } else if (op === 'fetch') {
                        const { url, payload, timeout, headers } = data as {
                            url: string;
                            payload: unknown;
                            timeout?: number;
                            headers?: Record<string, string>;
                        };

                        const controller = new AbortController();
                        const timeoutId = setTimeout(
                            () => controller.abort(),
                            timeout || 20000,
                        );

                        try {
                            const resp = await fetch(url, {
                                method: 'POST',
                                headers: headers || {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                },
                                body: JSON.stringify(payload),
                                signal: controller.signal,
                            });

                            clearTimeout(timeoutId);

                            if (!resp.ok) {
                                throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
                            }

                            const text = await resp.text();
                            result = JSON.parse(text) as TResult;
                        } catch (err) {
                            clearTimeout(timeoutId);
                            if ((err as Error).name === 'AbortError') {
                                throw new Error(
                                    `Request timed out after ${timeout || 20000}ms`,
                                );
                            }
                            throw err;
                        }
                    } else {
                        throw new Error(`Unknown operation: ${op}`);
                    }

                    messageCallback({ id, result });
                } catch (err) {
                    const error = err instanceof Error ? err.message : String(err);
                    messageCallback({ id, error });
                }
            }, 0);
        },
        onMessage: (callback: (msg: ResultMessage<TResult>) => void) => {
            messageCallback = callback;
        },
        terminate: () => {
            terminated = true;
            messageCallback = null;
        },
    };
}
