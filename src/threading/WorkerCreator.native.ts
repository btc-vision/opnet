/**
 * React Native-specific worker creator.
 *
 * This file is used instead of WorkerCreator.ts in React Native environments.
 * It provides only sequential (main-thread) execution since worker_threads
 * and Web Workers are not available in React Native.
 *
 * @packageDocumentation
 */

import { ResultMessage, TaskMessage, UniversalWorker, WorkerScript } from './interfaces/IThread.js';

/**
 * Runtime detection utilities.
 */
export const isNode = false;
export const isReactNative = true;
export const isBrowser = false;

/**
 * Detects the current runtime environment.
 */
export function detectRuntime(): 'node' | 'browser' | 'react-native' | 'unknown' {
    return 'react-native';
}

/**
 * Creates a worker appropriate for React Native.
 *
 * Always returns a sequential (main-thread) worker since
 * worker_threads and Web Workers are not available in React Native.
 */
export function createWorker<TOp extends string, TData, TResult>(
    _workerScript: WorkerScript,
): Promise<UniversalWorker<TOp, TData, TResult>> {
    return Promise.resolve(createSequentialWorker<TOp, TData, TResult>());
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
