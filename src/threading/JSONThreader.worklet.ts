/**
 * Worklet-based JSON threader for React Native.
 *
 * Uses `react-native-worklets` for parallel JSON parsing/stringify.
 * Fetch operations fall back to main thread since worklets can't do network I/O.
 *
 * @packageDocumentation
 */

import { Logger } from '@btc-vision/logger';
import { ThreaderOptions } from './interfaces/IThread.js';
import type { FetchRequest, IJsonThreader, JsonValue } from './interfaces/IJsonThreader.js';

/**
 * Minimal interface for react-native-worklets runtime.
 */
interface WorkletRuntime {
    readonly name: string;
}

/**
 * Minimal interface for the react-native-worklets module.
 */
interface WorkletsModule {
    createWorkletRuntime(name: string): WorkletRuntime;
    runOnRuntime<T>(runtime: WorkletRuntime, fn: () => T): Promise<T>;
}

/**
 * Internal runtime wrapper for pool management.
 */
interface PooledRuntime {
    readonly id: number;
    runtime: WorkletRuntime;
}

/**
 * Worklet-based JSON threader for React Native.
 *
 * Provides parallel JSON parsing and stringification using
 * react-native-worklets runtimes.
 */
export class WorkletJsonThreader extends Logger implements IJsonThreader {
    static #instance: WorkletJsonThreader | null = null;

    public readonly logColor: string = '#FF5733';

    private runtimes: PooledRuntime[] = [];
    private available: PooledRuntime[] = [];
    private readonly poolSize: number;
    private readonly threadingThreshold: number;
    private initialized = false;
    private initializing: Promise<void> | null = null;

    private workletsModule: WorkletsModule | null = null;
    private nextRuntimeId = 0;

    private tasksProcessed = 0;
    private tasksFailed = 0;

    private constructor(
        options: ThreaderOptions & { threadingThreshold?: number } = {},
    ) {
        super();
        this.poolSize = options.poolSize ?? 4;
        this.threadingThreshold = options.threadingThreshold ?? 16_384;
    }

    /**
     * Gets the singleton instance.
     */
    public static getInstance(
        options?: ThreaderOptions & { threadingThreshold?: number },
    ): WorkletJsonThreader {
        if (!WorkletJsonThreader.#instance) {
            WorkletJsonThreader.#instance = new WorkletJsonThreader(options);
        }
        return WorkletJsonThreader.#instance;
    }

    /**
     * Resets the singleton instance (for testing).
     */
    public static resetInstance(): void {
        if (WorkletJsonThreader.#instance) {
            WorkletJsonThreader.#instance.terminate().catch(() => {});
            WorkletJsonThreader.#instance = null;
        }
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
            pending: 0,
            queued: 0,
            available: this.available.length,
            total: this.runtimes.length,
            processed: this.tasksProcessed,
            failed: this.tasksFailed,
        };
    }

    public terminate(): Promise<void> {
        this.runtimes = [];
        this.available = [];
        this.initialized = false;
        this.initializing = null;
        this.workletsModule = null;
        return Promise.resolve();
    }

    public async parse<T = JsonValue>(json: string): Promise<T> {
        if (json.length < this.threadingThreshold) {
            return JSON.parse(json) as T;
        }

        await this.init();
        return this.runOnWorklet<T>('parse', json);
    }

    public async parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T> {
        if (buffer.byteLength <= this.threadingThreshold) {
            const text = new TextDecoder().decode(buffer);
            return JSON.parse(text) as T;
        }

        // Worklets may not handle ArrayBuffer well, decode first
        const text = new TextDecoder().decode(buffer);
        await this.init();
        return this.runOnWorklet<T>('parse', text);
    }

    public async stringify(data: JsonValue): Promise<string> {
        const result = JSON.stringify(data);
        if (result.length < this.threadingThreshold) {
            return result;
        }

        await this.init();
        return this.runOnWorklet<string>('stringify', data);
    }

    public async fetch<T = JsonValue>(request: FetchRequest): Promise<T> {
        // Worklets can't do network I/O, execute on main thread
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            request.timeout || 20_000,
        );

        try {
            const resp = await globalThis.fetch(request.url, {
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

            const text = await resp.text();

            // Parse response in worklet if large enough
            if (text.length >= this.threadingThreshold) {
                await this.init();
                return await this.runOnWorklet<T>('parse', text);
            }

            return JSON.parse(text) as T;
        } catch (err) {
            clearTimeout(timeoutId);
            if ((err as Error).name === 'AbortError') {
                throw new Error(
                    `Request timed out after ${request.timeout || 20_000}ms`,
                );
            }
            throw err;
        }
    }

    private async init(): Promise<void> {
        if (this.initialized) return;
        if (this.initializing) return this.initializing;

        this.initializing = (async () => {
            // Dynamic import of react-native-worklets
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const worklets: WorkletsModule = await import(
                'react-native-worklets' as string
            );
            this.workletsModule = worklets;

            // Create runtimes
            for (let i = 0; i < this.poolSize; i++) {
                this.createRuntime();
            }

            this.initialized = true;
        })();

        return this.initializing;
    }

    private createRuntime(): PooledRuntime {
        if (!this.workletsModule) {
            throw new Error('Worklets module not loaded');
        }

        const id = this.nextRuntimeId++;
        const runtime = this.workletsModule.createWorkletRuntime(
            `json-worklet-${id}`,
        );

        const pooled: PooledRuntime = { id, runtime };
        this.runtimes.push(pooled);
        this.available.push(pooled);
        return pooled;
    }

    private async runOnWorklet<T>(
        op: 'parse' | 'stringify',
        data: string | JsonValue,
    ): Promise<T> {
        if (!this.workletsModule) {
            throw new Error('Worklets module not initialized');
        }

        // Get an available runtime (round-robin if none available)
        let pooled = this.available.pop();
        if (!pooled) {
            pooled = this.runtimes[this.tasksProcessed % this.runtimes.length];
        }

        if (!pooled) {
            throw new Error('No worklet runtimes available');
        }

        try {
            const result = (await this.workletsModule.runOnRuntime<unknown>(
                pooled.runtime,
                () => {
                    'worklet';
                    if (op === 'parse') {
                        return JSON.parse(data as string);
                    } else {
                        return JSON.stringify(data);
                    }
                },
            )) as T;

            this.tasksProcessed++;
            return result;
        } catch (err) {
            this.tasksFailed++;
            throw err;
        } finally {
            // Return runtime to pool
            this.available.push(pooled);
        }
    }
}
