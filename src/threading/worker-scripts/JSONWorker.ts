import { WorkerScript } from '../interfaces/IThread.js';

export const jsonWorkerScript: WorkerScript = `
    (async () => {
        let parentPort = null;
        let isBrowser = typeof self !== 'undefined' && typeof self.onmessage !== 'undefined';
        
        if (!isBrowser) {
            const wt = await import('node:worker_threads');
            parentPort = wt.parentPort;
        }
        
        const send = (msg) => {
            if (isBrowser) {
                postMessage(msg);
            } else if (parentPort) {
                parentPort.postMessage(msg);
            } else {
                console.error('[JsonWorker] No way to send message:', msg);
            }
        };
        
        const handler = (e) => {
            // Node: e is the message directly
            // Browser: e is MessageEvent, e.data is the message
            const msg = isBrowser ? e.data : e;
                        
            // Handle raw ArrayBuffer (shouldn't happen but defensive)
            if (msg instanceof ArrayBuffer) {
                console.error('[JsonWorker] Received raw ArrayBuffer instead of message object. Length:', msg.byteLength);
                return;
            }
            
            const { id, op, data } = msg ?? {};
            
            if (typeof id !== 'number') {
                console.error('[JsonWorker] Invalid message, missing id. Got:', msg);
                return;
            }
            
            try {
                let result;
                if (op === 'parse') {
                    if (data === undefined || data === null) {
                        throw new Error('No data provided for parse operation');
                    }
                    const text = data instanceof ArrayBuffer 
                        ? new TextDecoder().decode(data) 
                        : data;
                    result = JSON.parse(text);
                } else if (op === 'stringify') {
                    result = JSON.stringify(data);
                } else {
                    throw new Error('Unknown operation: ' + op);
                }
                send({ id, result });
            } catch (err) {
                const error = err instanceof Error ? err.message : String(err);
                console.error('[JsonWorker] Error processing task ' + id + ':', error);
                send({ id, error });
            }
        };
        
        if (isBrowser) {
            self.onmessage = handler;
            self.onerror = (err) => {
                console.error('[JsonWorker] Uncaught error:', err);
            };
        } else if (parentPort) {
            parentPort.on('message', handler);
            parentPort.on('error', (err) => {
                console.error('[JsonWorker] Uncaught error:', err);
            });
        } else {
            console.error('[JsonWorker] No parentPort and not browser - worker cannot receive messages');
        }
    })();
`;
