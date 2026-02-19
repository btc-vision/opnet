import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    resolve: {
        alias: {
            crypto: resolve(__dirname, 'src/crypto/crypto-browser.js'),
            undici: resolve(__dirname, 'src/fetch/fetch-browser.js'),
            'undici/types/agent.js': resolve(__dirname, 'src/fetch/fetch-browser.js'),
            'undici/types/fetch': resolve(__dirname, 'src/fetch/fetch-browser.js'),
            zlib: resolve(__dirname, 'src/shims/zlib-browser.js'),
            worker_threads: resolve(__dirname, 'src/shims/worker_threads-browser.js'),
            vm: resolve(__dirname, 'src/shims/vm-browser.js'),
            stream: 'stream-browserify',
            buffer: 'buffer',
            '@btc-vision/transaction': resolve(
                __dirname,
                'node_modules/@btc-vision/transaction/build/index.js',
            ),
            '@btc-vision/bitcoin/workers': resolve(
                __dirname,
                'node_modules/@btc-vision/bitcoin/browser/workers/index.js',
            ),
            '@btc-vision/bitcoin': resolve(
                __dirname,
                'node_modules/@btc-vision/bitcoin/build/index.js',
            ),
            '@btc-vision/bip32': resolve(
                __dirname,
                'node_modules/@btc-vision/bip32/src/cjs/index.cjs',
            ),
            // Redirect build imports to source for browser resolution
            '../build/utils/StringToBuffer.js': resolve(__dirname, 'src/utils/StringToBuffer.ts'),
            '../build/contracts/ContractData.js': resolve(
                __dirname,
                'src/contracts/ContractData.ts',
            ),
            '../build/contracts/CallResult.js': resolve(
                __dirname,
                'src/contracts/CallResult.ts',
            ),
            '../build/contracts/CallResultSerializer.js': resolve(
                __dirname,
                'src/contracts/CallResultSerializer.ts',
            ),
            '../build/contracts/TransactionHelpper.js': resolve(
                __dirname,
                'src/contracts/TransactionHelpper.ts',
            ),
            '../build/contracts/interfaces/ICallResult.js': resolve(
                __dirname,
                'src/contracts/interfaces/ICallResult.ts',
            ),
            '../build/contracts/interfaces/IProviderForCallResult.js': resolve(
                __dirname,
                'src/contracts/interfaces/IProviderForCallResult.ts',
            ),
            '../build/contracts/interfaces/IAccessList.js': resolve(
                __dirname,
                'src/contracts/interfaces/IAccessList.ts',
            ),
            '../build/bitcoin/UTXOs.js': resolve(__dirname, 'src/bitcoin/UTXOs.ts'),
            '../build/block/BlockGasParameters.js': resolve(
                __dirname,
                'src/block/BlockGasParameters.ts',
            ),
        },
    },
    plugins: [
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
            exclude: [
                'crypto',
                'fs',
                'path',
                'os',
                'http',
                'https',
                'net',
                'tls',
                'dns',
                'child_process',
                'cluster',
                'dgram',
                'readline',
                'repl',
                'tty',
                'zlib',
                'vm',
            ],
        }),
    ],
    optimizeDeps: {
        include: [
            'vite-plugin-node-polyfills/shims/buffer',
            'vite-plugin-node-polyfills/shims/global',
            'vite-plugin-node-polyfills/shims/process',
        ],
        exclude: ['node:module'],
    },
    test: {
        globals: true,
        include: [
            // Browser-compatible tests (no fs, no node-only deps)
            'test/call-result-serializer.test.ts',
            'test/call-result-validation.test.ts',
            'test/hex-prefix-strip.test.ts',
            'test/transaction-helper.test.ts',
        ],
        exclude: [
            // Uses fs.readFileSync
            'test/threaded-http.test.ts',
            // Uses JSONRpcProvider (undici) for integration tests
            'test/utxos-manager.test.ts',
        ],
        testTimeout: 30000,
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
            screenshotFailures: false,
        },
    },
});
