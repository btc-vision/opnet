/**
 * Sequential worker fallback for environments without threading support.
 *
 * @packageDocumentation
 */

import { ResultMessage, TaskMessage, UniversalWorker } from './interfaces/IThread.js';

/**
 * Creates a sequential "worker" that executes tasks on the main thread.
 */
export function createSequentialWorker<TOp extends string, TData, TResult>(): UniversalWorker<
    TOp,
    TData,
    TResult
> {
    let messageCallback: ((msg: ResultMessage<TResult>) => void) | null = null;
    let terminated = false;

    return {
        postMessage: (msg: TaskMessage<TOp, TData>) => {
            if (terminated || !messageCallback) return;

            const { id, op, data } = msg;
            const callback = messageCallback;

            void (async () => {
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
                        const timeoutId = setTimeout(() => controller.abort(), timeout || 20000);

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

                            result = JSON.parse(await resp.text()) as TResult;
                        } catch (err) {
                            clearTimeout(timeoutId);
                            if ((err as Error).name === 'AbortError') {
                                throw new Error(`Request timed out after ${timeout || 20000}ms`, {
                                    cause: err,
                                });
                            }
                            throw err;
                        }
                    } else {
                        throw new Error(`Unknown operation: ${op}`);
                    }

                    if (!terminated) callback({ id, result });
                } catch (err) {
                    if (!terminated) {
                        callback({ id, error: err instanceof Error ? err.message : String(err) });
                    }
                }
            })();
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
