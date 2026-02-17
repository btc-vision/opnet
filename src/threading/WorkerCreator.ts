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
    !isNode && !isReactNative && typeof window !== 'undefined' && typeof Worker !== 'undefined';

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
 */
export async function createWorker<TOp extends string, TData, TResult>(
    workerScript: WorkerScript,
): Promise<UniversalWorker<TOp, TData, TResult>> {
    if (isNode) {
        return createNodeWorker<TOp, TData, TResult>(workerScript);
    }

    return createBrowserWorker<TOp, TData, TResult>(workerScript);
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
