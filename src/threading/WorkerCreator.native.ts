/**
 * React Native worker creator using worklets.
 *
 * @packageDocumentation
 */

import { ResultMessage, TaskMessage, UniversalWorker, WorkerScript } from './interfaces/IThread.js';
import { createSequentialWorker } from './SequentialWorker.js';

export const isNode = false;
export const isReactNative = true;
export const isBrowser = false;

export function detectRuntime(): 'node' | 'browser' | 'react-native' | 'unknown' {
    return 'react-native';
}

interface WorkletRuntime {
    readonly name: string;
}

interface WorkletsModule {
    createWorkletRuntime(name: string): WorkletRuntime;
    runOnRuntime<T>(runtime: WorkletRuntime, fn: () => T): Promise<T>;
}

let workletsModule: WorkletsModule | null = null;
let workletsLoadFailed = false;
let runtimeCounter = 0;

async function getWorklets(): Promise<WorkletsModule | null> {
    if (workletsModule) return workletsModule;
    if (workletsLoadFailed) return null;

    try {
        workletsModule = (await import('react-native-worklets' as string)) as WorkletsModule;
        return workletsModule;
    } catch {
        workletsLoadFailed = true;
        return null;
    }
}

export async function createWorker<TOp extends string, TData, TResult>(
    _workerScript: WorkerScript,
): Promise<UniversalWorker<TOp, TData, TResult>> {
    const worklets = await getWorklets();

    if (worklets) {
        return createWorkletWorker<TOp, TData, TResult>(worklets);
    }

    return createSequentialWorker<TOp, TData, TResult>();
}

function createWorkletWorker<TOp extends string, TData, TResult>(
    worklets: WorkletsModule,
): UniversalWorker<TOp, TData, TResult> {
    const runtime = worklets.createWorkletRuntime(`worker-${runtimeCounter++}`);
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

                        result = await worklets.runOnRuntime<TResult>(runtime, () => {
                            'worklet';
                            return JSON.parse(text) as TResult;
                        });
                    } else if (op === 'stringify') {
                        const toStringify = data;
                        result = await worklets.runOnRuntime<TResult>(runtime, () => {
                            'worklet';
                            return JSON.stringify(toStringify) as TResult;
                        });
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

                            const text = await resp.text();
                            result = await worklets.runOnRuntime<TResult>(runtime, () => {
                                'worklet';
                                return JSON.parse(text) as TResult;
                            });
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
