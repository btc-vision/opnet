/**
 * React Native JSON threader entry point.
 *
 * Swapped in via package.json "react-native" field.
 * Uses BaseThreader + WorkerCreator.native.ts for worklet-based threading.
 *
 * @packageDocumentation
 */

import type { FetchRequest, IJsonThreader, JsonValue } from './interfaces/IJsonThreader.js';
import { ThreaderOptions, WorkerScript } from './interfaces/IThread.js';
import { BaseThreader } from './SharedThreader.js';
import { jsonWorkerScript } from './worker-scripts/JSONWorker.js';

// Re-export types
export type { JsonValue, FetchRequest, IJsonThreader };

type JsonOp = 'parse' | 'stringify' | 'fetch';
type JsonInput = string | JsonValue | ArrayBuffer | FetchRequest;
type JsonOutput = string | JsonValue;

/**
 * JSON threader for React Native.
 * Uses worklets via WorkerCreator.native.ts (swapped by package.json).
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
        if (json.length < this.threadingThreshold) {
            return JSON.parse(json) as T;
        }
        const result = await this.run('parse', json);
        return result as T;
    }

    public async parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T> {
        if (buffer.byteLength <= this.threadingThreshold) {
            const text = new TextDecoder().decode(buffer);
            return JSON.parse(text) as T;
        }
        const result = await this.runWithTransfer('parse', buffer, [buffer]);
        return result as T;
    }

    public async stringify(data: JsonValue): Promise<string> {
        const result = JSON.stringify(data);
        if (result.length < this.threadingThreshold) {
            return result;
        }
        return (await this.run('stringify', data)) as string;
    }

    public async fetch<T = JsonValue>(request: FetchRequest): Promise<T> {
        const result = await this.run('fetch', request);
        return result as T;
    }
}

// Global singleton
const GLOBAL_KEY = Symbol.for('opnet.jsonThreader');
const globalObj = (typeof globalThis !== 'undefined' ? globalThis : global) as Record<
    symbol,
    IJsonThreader
>;

if (!(GLOBAL_KEY in globalObj)) {
    globalObj[GLOBAL_KEY] = new JsonThreader();
}

/**
 * Initialize the JSON threader (for API compatibility).
 */
export function initJsonThreader(): Promise<IJsonThreader> {
    return Promise.resolve(globalObj[GLOBAL_KEY]);
}

/**
 * Global JSON threader instance.
 */
export const jsonThreader: IJsonThreader = globalObj[GLOBAL_KEY];
