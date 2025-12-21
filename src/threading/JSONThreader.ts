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
    private readonly threadingThreshold: number;

    public constructor(options: ThreaderOptions & { threadingThreshold?: number } = {}) {
        super(options);
        this.threadingThreshold = options.threadingThreshold ?? 16_384; // 16KB default
    }

    public async parse<T = JsonValue>(json: string): Promise<T> {
        if (json.length < this.threadingThreshold) {
            return JSON.parse(json) as T;
        }
        const result = await this.run('parse', json);
        return result as T;
    }

    public async parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T> {
        if (buffer.byteLength < this.threadingThreshold) {
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
}

const GLOBAL_KEY = Symbol.for('opnet.jsonThreader');
const globalObj = (typeof globalThis !== 'undefined' ? globalThis : global) as Record<
    symbol,
    JsonThreader
>;

if (!globalObj[GLOBAL_KEY]) {
    globalObj[GLOBAL_KEY] = new JsonThreader();
}

export const jsonThreader: JsonThreader = globalObj[GLOBAL_KEY];
