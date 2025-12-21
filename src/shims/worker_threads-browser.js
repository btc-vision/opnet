// Browser shim for worker_threads - not used in browser context
// WorkerCreator.ts uses Web Workers directly in browser via isNode check

export class Worker {
    constructor() {
        throw new Error('worker_threads is not available in browser. Use Web Workers instead.');
    }
}

export const isMainThread = true;
export const parentPort = null;
export const workerData = null;

export default {
    Worker,
    isMainThread,
    parentPort,
    workerData,
};
