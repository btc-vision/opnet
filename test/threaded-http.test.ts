import fs from 'fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { FetchRequest } from '../src/threading/interfaces/IJsonThreader.js';
import { JsonThreader } from '../src/threading/JSONThreader.js';

describe('Threaded HTTP - Worker Script Analysis', () => {
    let workerScript: string;

    beforeEach(async () => {
        const { jsonWorkerScript } = await import('../src/threading/worker-scripts/JSONWorker.js');
        workerScript = jsonWorkerScript;
    });

    describe('browser compatibility', () => {
        it('should detect browser environment correctly', () => {
            expect(workerScript).toContain('isBrowser');
            expect(workerScript).toContain("typeof self !== 'undefined'");
            expect(workerScript).toContain("typeof self.onmessage !== 'undefined'");
        });

        it('should use postMessage for browser communication', () => {
            expect(workerScript).toContain('if (isBrowser)');
            expect(workerScript).toContain('postMessage(msg)');
        });

        it('should use parentPort for Node.js communication', () => {
            expect(workerScript).toContain('parentPort.postMessage(msg)');
            expect(workerScript).toContain("import('node:worker_threads')");
        });

        it('should set up message handlers for both environments', () => {
            expect(workerScript).toContain('self.onmessage = handler');
            expect(workerScript).toContain("parentPort.on('message', handler)");
        });
    });

    describe('fetch operation implementation', () => {
        it('should have fetch operation handler', () => {
            expect(workerScript).toContain("op === 'fetch'");
        });

        it('should extract request parameters correctly', () => {
            expect(workerScript).toContain('const { url, payload, timeout, headers } = data');
        });

        it('should create AbortController for timeout', () => {
            expect(workerScript).toContain('const controller = new AbortController()');
            expect(workerScript).toContain('setTimeout(() => controller.abort()');
        });

        it('should use default timeout of 20000ms', () => {
            expect(workerScript).toContain('timeout || 20000');
        });

        it('should make POST request with correct configuration', () => {
            expect(workerScript).toContain('await fetch(url');
            expect(workerScript).toContain("method: 'POST'");
            expect(workerScript).toContain('signal: controller.signal');
        });

        it('should stringify payload as body', () => {
            expect(workerScript).toContain('body: JSON.stringify(payload)');
        });

        it('should use provided headers or defaults', () => {
            expect(workerScript).toContain('headers: headers ||');
            expect(workerScript).toContain("'Content-Type': 'application/json'");
            expect(workerScript).toContain("'Accept': 'application/json'");
        });

        it('should check response status', () => {
            expect(workerScript).toContain('if (!resp.ok)');
            expect(workerScript).toContain("'HTTP ' + resp.status");
        });

        it('should parse response as JSON', () => {
            expect(workerScript).toContain('await resp.text()');
            expect(workerScript).toContain('result = JSON.parse(text)');
        });

        it('should handle abort errors', () => {
            expect(workerScript).toContain("err.name === 'AbortError'");
            expect(workerScript).toContain("'Request timed out after '");
        });

        it('should clear timeout on completion', () => {
            expect(workerScript).toContain('clearTimeout(timeoutId)');
        });
    });

    describe('existing operations preserved', () => {
        it('should still support parse operation', () => {
            expect(workerScript).toContain("op === 'parse'");
            expect(workerScript).toContain('JSON.parse(text)');
        });

        it('should still support stringify operation', () => {
            expect(workerScript).toContain("op === 'stringify'");
            expect(workerScript).toContain('JSON.stringify(data)');
        });

        it('should handle ArrayBuffer input for parse', () => {
            expect(workerScript).toContain('data instanceof ArrayBuffer');
            expect(workerScript).toContain('new TextDecoder().decode(data)');
        });
    });

    describe('error handling', () => {
        it('should catch and report errors', () => {
            expect(workerScript).toContain('} catch (err) {');
            expect(workerScript).toContain('send({ id, error })');
        });

        it('should handle unknown operations', () => {
            expect(workerScript).toContain("throw new Error('Unknown operation: '");
        });

        it('should validate message format', () => {
            expect(workerScript).toContain("typeof id !== 'number'");
            expect(workerScript).toContain('Invalid message, missing id');
        });
    });
});

describe('Threaded HTTP - JSONThreader.fetch() Method', () => {
    let source: string;
    let interfaceSource: string;

    beforeEach(() => {
        source = fs.readFileSync('./src/threading/JSONThreader.ts', 'utf-8');
        interfaceSource = fs.readFileSync('./src/threading/interfaces/IJsonThreader.ts', 'utf-8');
    });

    describe('fetch method implementation', () => {
        it('should export FetchRequest interface', () => {
            expect(interfaceSource).toContain('export interface FetchRequest');
            expect(interfaceSource).toContain('url: string');
            expect(interfaceSource).toContain('payload: JsonValue');
            expect(interfaceSource).toContain('timeout?: number');
            expect(interfaceSource).toContain('headers?: Record<string, string>');
        });

        it('should have fetch operation type', () => {
            expect(source).toContain("type JsonOp = 'parse' | 'stringify' | 'fetch'");
        });

        it('should have fetch method with generic return type', () => {
            expect(source).toContain(
                'public async fetch<T = JsonValue>(request: FetchRequest): Promise<T>',
            );
        });

        it('should have service worker fallback', () => {
            expect(source).toContain('if (isServiceWorker)');
            expect(source).toContain('// Fallback to main thread fetch in service worker context');
        });

        it('should use worker for non-service-worker context', () => {
            expect(source).toContain("await this.run('fetch', request)");
        });
    });

    describe('service worker detection', () => {
        it('should detect __IS_SERVICE_WORKER__ global', () => {
            expect(source).toContain('__IS_SERVICE_WORKER__');
        });

        it('should detect ServiceWorkerGlobalScope', () => {
            expect(source).toContain('ServiceWorkerGlobalScope');
            expect(source).toContain('self instanceof ServiceWorkerGlobalScope');
        });

        it('should cache service worker check result', () => {
            expect(source).toContain('_isServiceWorker !== null');
        });
    });

    describe('service worker fallback implementation', () => {
        it('should use AbortController in fallback', () => {
            // Check that the fetch method contains AbortController for service worker fallback
            expect(source).toContain('public async fetch<T = JsonValue>');
            expect(source).toContain('if (isServiceWorker)');
            expect(source).toContain('const controller = new AbortController()');
        });

        it('should use setTimeout for timeout in fallback', () => {
            expect(source).toContain('setTimeout(');
            expect(source).toContain('controller.abort()');
        });

        it('should clear timeout in fallback', () => {
            expect(source).toContain('clearTimeout(timeoutId)');
        });
    });
});

describe('Threaded HTTP - JSONRpcProvider Integration', () => {
    let source: string;

    beforeEach(() => {
        source = fs.readFileSync('./src/providers/JSONRpcProvider.ts', 'utf-8');
    });

    describe('constructor options', () => {
        it('should have useThreadedHttp parameter', () => {
            expect(source).toContain('useThreadedHttp: boolean');
        });

        it('should default useThreadedHttp to false', () => {
            expect(source).toContain('config.useThreadedHttp ?? false');
        });
    });

    describe('_send method', () => {
        it('should check useThreadedHttp flag', () => {
            expect(source).toContain('if (this.useThreadedHttp)');
        });

        it('should use jsonThreader.fetch when threaded HTTP enabled', () => {
            expect(source).toContain('await jsonThreader.fetch<JsonRpcResult | JsonRpcError>');
        });

        it('should pass url to fetch request', () => {
            expect(source).toContain('url: this.url');
        });

        it('should pass payload to fetch request', () => {
            expect(source).toContain('payload: payload as unknown as JsonValue');
        });

        it('should pass timeout to fetch request', () => {
            expect(source).toContain('timeout: this.timeout');
        });

        it('should pass headers to fetch request', () => {
            expect(source).toContain("'Content-Type': 'application/json'");
            expect(source).toContain("'User-Agent': 'OPNET/1.0'");
            expect(source).toContain("Accept: 'application/json'");
        });

        it('should have fallback when useThreadedHttp is false', () => {
            expect(source).toContain(
                '// Fallback: main thread HTTP with optional threaded JSON parsing',
            );
        });

        it('should keep original fetcher logic in fallback', () => {
            expect(source).toContain('await this.fetcher(this.url, params)');
        });
    });

    describe('imports', () => {
        it('should import jsonThreader from JSONThreader', () => {
            expect(source).toContain('import { jsonThreader }');
        });

        it('should import JsonValue from interfaces', () => {
            expect(source).toContain("from '../threading/interfaces/IJsonThreader.js'");
        });
    });
});

describe('Threaded HTTP - Worker Pool Integration', () => {
    let threader: JsonThreader;

    beforeEach(() => {
        // Use threshold of 0 to force all operations through workers
        threader = new JsonThreader({ poolSize: 2, threadingThreshold: 0 });
    });

    afterEach(async () => {
        await threader.terminate();
    });

    describe('worker initialization', () => {
        it('should create workers with specified pool size', async () => {
            // Trigger worker initialization by running a simple operation
            // Use a large enough string to bypass threshold (or threshold=0)
            await threader.parse('{"test": true}');

            const stats = threader.stats;
            expect(stats.total).toBe(2);
        });

        it('should track available workers', async () => {
            await threader.parse('{"test": true}');

            const stats = threader.stats;
            expect(stats.available).toBeLessThanOrEqual(stats.total);
        });
    });

    describe('stats tracking', () => {
        it('should track processed count', async () => {
            await threader.parse('{"a": 1}');
            await threader.parse('{"b": 2}');
            await threader.parse('{"c": 3}');

            const stats = threader.stats;
            expect(stats.processed).toBeGreaterThanOrEqual(3);
        });

        it('should track failed count', async () => {
            const initialStats = threader.stats;

            try {
                // Force through worker by using large invalid JSON
                const largeInvalidJson = 'invalid json {{{' + 'x'.repeat(20000);
                await threader.parse(largeInvalidJson);
            } catch {
                // Expected to fail
            }

            const finalStats = threader.stats;
            expect(finalStats.failed).toBeGreaterThan(initialStats.failed);
        });
    });

    describe('termination', () => {
        it('should terminate cleanly', async () => {
            await threader.parse('{"test": true}');
            await threader.terminate();

            const stats = threader.stats;
            expect(stats.total).toBe(0);
            expect(stats.available).toBe(0);
        });
    });
});

describe('Threaded HTTP - Live Integration Test', () => {
    let threader: JsonThreader;

    beforeEach(() => {
        threader = new JsonThreader({ poolSize: 4 });
    });

    afterEach(async () => {
        await threader.terminate();
    });

    it('should perform real HTTP request through worker', async () => {
        // Use a real public API endpoint for testing
        const request: FetchRequest = {
            url: 'https://regtest.opnet.org/api/v1/json-rpc',
            payload: {
                jsonrpc: '2.0',
                method: 'btc_blockNumber',
                params: [],
                id: 1,
            },
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        const result = await threader.fetch<{
            jsonrpc: string;
            result?: string;
            error?: { code: number; message: string };
            id: number;
        }>(request);

        expect(result).toBeDefined();
        expect(result.jsonrpc).toBe('2.0');
        expect(result.id).toBe(1);

        // Should have either result or error
        expect(result.result !== undefined || result.error !== undefined).toBe(true);
    }, 15000);

    it('should handle multiple concurrent HTTP requests', async () => {
        const requests = Array.from({ length: 5 }, (_, i) => ({
            url: 'https://regtest.opnet.org/api/v1/json-rpc',
            payload: {
                jsonrpc: '2.0',
                method: 'btc_blockNumber',
                params: [],
                id: i + 1,
            },
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        }));

        const results = await Promise.all(requests.map((req) => threader.fetch(req)));

        expect(results).toHaveLength(5);
        results.forEach((result: unknown, i) => {
            const typedResult = result as { jsonrpc: string; id: number };
            expect(typedResult.jsonrpc).toBe('2.0');
            expect(typedResult.id).toBe(i + 1);
        });
    }, 20000);

    it('should handle HTTP errors correctly', async () => {
        const request: FetchRequest = {
            url: 'https://regtest.opnet.org/api/v1/nonexistent-endpoint',
            payload: { test: true },
            timeout: 10000,
        };

        await expect(threader.fetch(request)).rejects.toThrow(/HTTP/);
    }, 15000);

    it('should handle timeout correctly', async () => {
        // Use a very short timeout
        const request: FetchRequest = {
            url: 'https://regtest.opnet.org/api/v1/json-rpc',
            payload: {
                jsonrpc: '2.0',
                method: 'btc_blockNumber',
                params: [],
                id: 1,
            },
            timeout: 1, // 1ms timeout - should fail
        };

        await expect(threader.fetch(request)).rejects.toThrow(/timed out/i);
    }, 10000);
});

describe('Threaded HTTP - JSONRpcProvider Live Test', () => {
    it('should work with threaded HTTP enabled', async () => {
        const { JSONRpcProvider } = await import('../src/providers/JSONRpcProvider.js');
        const { networks } = await import('@btc-vision/bitcoin');

        const provider = new JSONRpcProvider({
            url: 'https://regtest.opnet.org',
            network: networks.regtest,
            timeout: 10000,
            useThreadedParsing: true,
            useThreadedHttp: true,
        });

        try {
            const blockNumber = await provider.getBlockNumber();
            expect(typeof blockNumber).toBe('bigint');
            expect(blockNumber).toBeGreaterThanOrEqual(0n);
        } finally {
            await provider.close();
        }
    }, 15000);

    it('should work with threaded HTTP disabled (fallback)', async () => {
        const { JSONRpcProvider } = await import('../src/providers/JSONRpcProvider.js');
        const { networks } = await import('@btc-vision/bitcoin');

        const provider = new JSONRpcProvider({
            url: 'https://regtest.opnet.org',
            network: networks.regtest,
            timeout: 10000,
            useThreadedParsing: true,
            useThreadedHttp: false,
        });

        try {
            const blockNumber = await provider.getBlockNumber();
            expect(typeof blockNumber).toBe('bigint');
            expect(blockNumber).toBeGreaterThanOrEqual(0n);
        } finally {
            await provider.close();
        }
    }, 15000);

    it('should produce same results with both modes', async () => {
        const { JSONRpcProvider } = await import('../src/providers/JSONRpcProvider.js');
        const { networks } = await import('@btc-vision/bitcoin');

        const providerThreaded = new JSONRpcProvider({
            url: 'https://regtest.opnet.org',
            network: networks.regtest,
            timeout: 10000,
            useThreadedParsing: true,
            useThreadedHttp: true,
        });

        const providerFallback = new JSONRpcProvider({
            url: 'https://regtest.opnet.org',
            network: networks.regtest,
            timeout: 10000,
            useThreadedParsing: true,
            useThreadedHttp: false,
        });

        try {
            const [blockThreaded, blockFallback] = await Promise.all([
                providerThreaded.getBlockNumber(),
                providerFallback.getBlockNumber(),
            ]);

            // Block numbers should be very close (could differ by 1 if a new block came in)
            const diff =
                blockThreaded > blockFallback
                    ? blockThreaded - blockFallback
                    : blockFallback - blockThreaded;
            expect(diff).toBeLessThanOrEqual(1n);
        } finally {
            await Promise.all([providerThreaded.close(), providerFallback.close()]);
        }
    }, 20000);
});
