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

        const handler = async (e) => {
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
                } else if (op === 'fetch') {
                    const { url, payload, timeout, headers } = data;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), timeout || 20000);

                    try {
                        const resp = await fetch(url, {
                            method: 'POST',
                            headers: headers || {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(payload),
                            signal: controller.signal,
                        });

                        clearTimeout(timeoutId);

                        if (!resp.ok) {
                            throw new Error('HTTP ' + resp.status + ': ' + resp.statusText);
                        }

                        const text = await resp.text();
                        result = JSON.parse(text);
                    } catch (err) {
                        clearTimeout(timeoutId);
                        if (err.name === 'AbortError') {
                            throw new Error('Request timed out after ' + (timeout || 20000) + 'ms');
                        }
                        throw err;
                    }
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
