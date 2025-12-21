import { ThreaderOptions, WorkerScript } from './interfaces/IThread.js';
import { BaseThreader } from './SharedThreader.js';
import { jsonWorkerScript } from './worker-scripts/JSONWorker.js';

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

type JsonOp = 'parse' | 'stringify';
type JsonInput = string | JsonValue | ArrayBuffer;
type JsonOutput = string | JsonValue;

export class JsonThreader extends BaseThreader<JsonOp, JsonInput, JsonOutput> {
    protected readonly workerScript: WorkerScript = jsonWorkerScript;

    public constructor(options: ThreaderOptions = {}) {
        super(options);
    }

    public async parse<T = JsonValue>(json: string): Promise<T> {
        const result = await this.run('parse', json);
        return result as T;
    }

    public async parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T> {
        const result = await this.runWithTransfer('parse', buffer, [buffer]);
        return result as T;
    }

    public async stringify(data: JsonValue): Promise<string> {
        const result = await this.run('stringify', data);
        return result as string;
    }
}

// Global singleton, survives multiple imports
const GLOBAL_KEY = Symbol.for('opnet.jsonThreader');
const globalObj = (typeof globalThis !== 'undefined' ? globalThis : global) as Record<
    symbol,
    JsonThreader
>;

if (!globalObj[GLOBAL_KEY]) {
    globalObj[GLOBAL_KEY] = new JsonThreader();
}

export const jsonThreader: JsonThreader = globalObj[GLOBAL_KEY];
