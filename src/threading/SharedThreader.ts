import { Logger } from '@btc-vision/logger';
import {
    PendingTask,
    QueuedTask,
    ResultMessage,
    ThreaderOptions,
    UniversalWorker,
    WorkerScript,
} from './interfaces/IThread.js';

import { createWorker, isNode, isReactNative } from './WorkerCreator.js';

export abstract class BaseThreader<TOp extends string, TData, TResult> extends Logger {
    public readonly logColor: string = '#FF5733';

    protected abstract readonly workerScript: WorkerScript;

    private workers: UniversalWorker<TOp, TData, TResult>[] = [];
    private available: UniversalWorker<TOp, TData, TResult>[] = [];
    private pending = new Map<number, PendingTask<TResult>>();

    private queue: QueuedTask<TOp, TData, TResult>[] = [];
    private idCounter: number = 0;

    private initialized: boolean = false;
    private initializing: Promise<void> | null = null;

    private tasksProcessed: number = 0;
    private tasksFailed: number = 0;
    private lastStatsLog: number = 0;

    private readonly poolSize: number;
    private readonly statsInterval: number = 30_000;

    private cleanupBound: boolean = false;

    protected constructor(options: ThreaderOptions = {}) {
        super();

        this.poolSize =
            options.poolSize ??
            (isNode
                ? 6
                : Math.max(Math.max(1, Math.ceil((navigator?.hardwareConcurrency ?? 8) / 2)), 6));
    }

    public get stats(): {
        pending: number;
        queued: number;
        available: number;
        total: number;
        processed: number;
        failed: number;
    } {
        return {
            pending: this.pending.size,
            queued: this.queue.length,
            available: this.available.length,
            total: this.workers.length,
            processed: this.tasksProcessed,
            failed: this.tasksFailed,
        };
    }

    public async terminate(): Promise<void> {
        if (!this.initialized && !this.initializing) return;

        const queuedCount = this.queue.length;
        const pendingCount = this.pending.size;

        for (const task of this.queue) {
            task.reject(new Error('Threader terminated'));
        }

        for (const [, handler] of this.pending) {
            handler.reject(new Error('Threader terminated'));
        }

        for (const worker of this.workers) {
            await worker.terminate();
        }

        this.queue = [];
        this.pending.clear();
        this.workers = [];
        this.available = [];
        this.initialized = false;
        this.initializing = null;

        if (queuedCount > 0 || pendingCount > 0) {
            this.info(
                `Terminated. Rejected ${queuedCount} queued and ${pendingCount} pending tasks. Total processed: ${this.tasksProcessed}, failed: ${this.tasksFailed}`,
            );
        }
    }

    public async drain(): Promise<void> {
        if (!this.initialized) return;

        const queuedCount = this.queue.length;
        const pendingCount = this.pending.size;

        this.info(
            `Draining. Rejecting ${queuedCount} queued, waiting for ${pendingCount} pending...`,
        );

        for (const task of this.queue) {
            task.reject(new Error('Threader draining'));
        }
        this.queue = [];

        if (this.pending.size > 0) {
            await new Promise<void>((resolve) => {
                const checkDone = () => {
                    if (this.pending.size === 0) {
                        resolve();
                    }
                };

                const originalPending = new Map(this.pending);
                for (const [id, handler] of originalPending) {
                    const origResolve = handler.resolve;
                    const origReject = handler.reject;

                    handler.resolve = (v) => {
                        origResolve(v);
                        checkDone();
                    };

                    handler.reject = (e) => {
                        origReject(e);
                        checkDone();
                    };

                    this.pending.set(id, handler);
                }

                checkDone();
            });
        }

        await this.terminate();
    }

    protected runWithTransfer(
        op: TOp,
        data: TData,
        transferables: ArrayBuffer[],
    ): Promise<TResult> {
        return new Promise(async (resolve, reject) => {
            await this.init();

            this.queue.push({ resolve, reject, op, data, transferables });
            this.processQueue();
        });
    }

    protected run(op: TOp, data: TData): Promise<TResult> {
        return new Promise(async (resolve, reject) => {
            await this.init();

            this.queue.push({ resolve, reject, op, data });
            this.processQueue();
        });
    }

    private bindCleanupHandlers(): void {
        if (this.cleanupBound) return;
        this.cleanupBound = true;

        const cleanup = () => {
            this.terminate().catch(() => {});
        };

        if (isNode) {
            process.once('beforeExit', cleanup);
            process.once('SIGINT', cleanup);
            process.once('SIGTERM', cleanup);
        } else if (isReactNative) {
            // React Native: No cleanup handlers needed.
            // App lifecycle is handled differently (AppState API).
        } else if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener('beforeunload', cleanup);
            window.addEventListener('unload', cleanup);
        } else if (typeof self !== 'undefined' && typeof self.addEventListener === 'function') {
            self.addEventListener('beforeunload', cleanup);
        }
    }

    private async init(): Promise<void> {
        if (this.initialized) return;
        if (this.initializing) return this.initializing;

        this.bindCleanupHandlers();

        this.initializing = (async () => {
            const startTime = Date.now();

            const workers = await Promise.all(
                Array.from({ length: this.poolSize }, () =>
                    createWorker<TOp, TData, TResult>(this.workerScript),
                ),
            );

            for (const worker of workers) {
                worker.onMessage((msg: ResultMessage<TResult>) => {
                    const handler = this.pending.get(msg.id);
                    if (handler) {
                        this.pending.delete(msg.id);

                        if (msg.error) {
                            this.tasksFailed++;
                            handler.reject(new Error(msg.error));
                        } else {
                            this.tasksProcessed++;

                            handler.resolve(msg.result as TResult);
                        }
                    }

                    this.available.push(worker);
                    this.logStatsIfNeeded();
                    this.processQueue();
                });

                this.workers.push(worker);
                this.available.push(worker);
            }

            this.initialized = true;
        })();

        return this.initializing;
    }

    private logStatsIfNeeded(): void {
        const now = Date.now();
        if (now - this.lastStatsLog < this.statsInterval) return;

        this.lastStatsLog = now;
        /*const s = this.stats;
        this.debug(
            `Stats: ${s.processed} processed, ${s.failed} failed, ${s.pending} pending, ${s.queued} queued, ${s.available}/${s.total} workers available`,
        );*/
    }

    private processQueue(): void {
        if (this.queue.length > 100 && this.available.length === 0) {
            this.warn(`Queue backing up: ${this.queue.length} tasks waiting, no workers available`);
        }

        while (this.queue.length > 0 && this.available.length > 0) {
            const task = this.queue.shift();
            if (!task) break;

            const worker = this.available.pop();
            if (!worker) break;

            const id = this.idCounter++;
            this.pending.set(id, task);

            worker.postMessage({ id, op: task.op, data: task.data }, task.transferables);
        }
    }
}
