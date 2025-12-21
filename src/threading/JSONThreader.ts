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

declare const __IS_SERVICE_WORKER__: boolean | undefined;

let _isServiceWorker: boolean | null = null;

function checkIsServiceWorker(): boolean {
    if (_isServiceWorker !== null) return _isServiceWorker;

    if (typeof __IS_SERVICE_WORKER__ !== 'undefined' && __IS_SERVICE_WORKER__) {
        _isServiceWorker = true;
        return true;
    }

    if (
        typeof ServiceWorkerGlobalScope !== 'undefined' &&
        self instanceof ServiceWorkerGlobalScope
    ) {
        _isServiceWorker = true;
        return true;
    }

    _isServiceWorker = false;
    return false;
}

const isServiceWorker: boolean = checkIsServiceWorker();

export class JsonThreader extends BaseThreader<JsonOp, JsonInput, JsonOutput> {
    protected readonly workerScript: WorkerScript = jsonWorkerScript;
    private readonly threadingThreshold: number;

    public constructor(options: ThreaderOptions & { threadingThreshold?: number } = {}) {
        super(options);
        this.threadingThreshold = options.threadingThreshold ?? 16_384;
    }

    public async parse<T = JsonValue>(json: string): Promise<T> {
        if (isServiceWorker || json.length < this.threadingThreshold) {
            return JSON.parse(json) as T;
        }
        const result = await this.run('parse', json);
        return result as T;
    }

    public async parseBuffer<T = JsonValue>(buffer: ArrayBuffer): Promise<T> {
        if (isServiceWorker || buffer.byteLength <= this.threadingThreshold) {
            const text = new TextDecoder().decode(buffer);
            return JSON.parse(text) as T;
        }

        const result = await this.runWithTransfer('parse', buffer, [buffer]);
        return result as T;
    }

    public async stringify(data: JsonValue): Promise<string> {
        const result = JSON.stringify(data);
        if (isServiceWorker || result.length < this.threadingThreshold) {
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
