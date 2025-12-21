import { ResultMessage, TaskMessage, UniversalWorker, WorkerScript } from './interfaces/IThread.js';

export const isNode =
    typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export async function createWorker<TOp extends string, TData, TResult>(
    workerScript: WorkerScript,
): Promise<UniversalWorker<TOp, TData, TResult>> {
    if (isNode) {
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
    } else {
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
}
