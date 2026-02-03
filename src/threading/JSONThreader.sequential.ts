/**
 * Sequential JSON threader for environments without worker support.
 *
 * Executes JSON operations on the main thread. Same API as JsonThreader
 * so consumers can swap transparently.
 *
 * @packageDocumentation
 */

import { Logger } from '@btc-vision/logger';
import { ThreaderOptions } from './interfaces/IThread.js';
import type { FetchRequest, IJsonThreader, JsonValue } from './interfaces/IJsonThreader.js';

/**
 * Sequential JSON threader — processes all operations on the main thread.
 *
 * Provides the same public API as JsonThreader but without any threading.
 * Intended for React Native or other environments where Web Workers
 * and worker_threads are unavailable.
 *
 * @example
 * ```typescript
 * import { SequentialJsonThreader } from 'opnet';
 *
 * const threader = SequentialJsonThreader.getInstance();
 * const data = await threader.parse(jsonString);
 * ```
 */
export class SequentialJsonThreader extends Logger implements IJsonThreader {
    static #instance: SequentialJsonThreader | null = null;

    public readonly logColor: string = '#FF5733';

    private readonly threadingThreshold: number;
    private tasksProcessed = 0;
    private tasksFailed = 0;

    private constructor(
        options: ThreaderOptions & { threadingThreshold?: number } = {},
    ) {
        super();
        this.threadingThreshold = options.threadingThreshold ?? 16_384;
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
            available: 0,
            total: 0,
            processed: this.tasksProcessed,
            failed: this.tasksFailed,
        };
    }

    /**
     * Gets the singleton instance.
     */
    public static getInstance(
        options?: ThreaderOptions & { threadingThreshold?: number },
    ): SequentialJsonThreader {
        if (!SequentialJsonThreader.#instance) {
            SequentialJsonThreader.#instance = new SequentialJsonThreader(options);
        }
        return SequentialJsonThreader.#instance;
    }

    /**
     * Resets the singleton instance (for testing).
     */
    public static resetInstance(): void {
        SequentialJsonThreader.#instance = null;
    }

    public parse<T = JsonValue>(json: string): Promise<T> {
        try {
            const result = JSON.parse(json) as T;
            this.tasksProcessed++;
            return Promise.resolve(result);
        } catch (err) {
            this.tasksFailed++;
            return Promise.reject(err instanceof Error ? err : new Error(String(err)));
        }
    }

    public parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T> {
        try {
            const text = new TextDecoder().decode(buffer);
            const result = JSON.parse(text) as T;
            this.tasksProcessed++;
            return Promise.resolve(result);
        } catch (err) {
            this.tasksFailed++;
            return Promise.reject(err instanceof Error ? err : new Error(String(err)));
        }
    }

    public stringify(data: JsonValue): Promise<string> {
        try {
            const result = JSON.stringify(data);
            this.tasksProcessed++;
            return Promise.resolve(result);
        } catch (err) {
            this.tasksFailed++;
            return Promise.reject(err instanceof Error ? err : new Error(String(err)));
        }
    }

    public async fetch<T = JsonValue>(request: FetchRequest): Promise<T> {
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

            const result = (await resp.json()) as T;
            this.tasksProcessed++;
            return result;
        } catch (err) {
            clearTimeout(timeoutId);
            this.tasksFailed++;

            if ((err as Error).name === 'AbortError') {
                throw new Error(
                    `Request timed out after ${request.timeout || 20_000}ms`,
                );
            }
            throw err;
        }
    }

    public async terminate(): Promise<void> {
        // No-op: nothing to terminate
    }
}
