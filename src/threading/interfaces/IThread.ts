export interface TaskMessage<TOp extends string = string, TData = unknown> {
    id: number;
    op: TOp;
    data: TData;
}

export interface ResultMessage<TResult = unknown> {
    id: number;
    result?: TResult;
    error?: string;
}

export interface PendingTask<TResult = unknown> {
    resolve: (value: TResult) => void;
    reject: (error: Error) => void;
}

export interface QueuedTask<
    TOp extends string = string,
    TData = unknown,
    TResult = unknown,
> extends PendingTask<TResult> {
    op: TOp;
    data: TData;
    transferables?: ArrayBuffer[];
}

export interface ThreaderOptions {
    poolSize?: number;
}

export interface UniversalWorker<TOp extends string = string, TData = unknown, TResult = unknown> {
    postMessage(msg: TaskMessage<TOp, TData>, transferables?: readonly Transferable[]): void;
    onMessage(callback: (msg: ResultMessage<TResult>) => void): void;
    terminate(): void | Promise<void>;
}

export type WorkerScript = string;
