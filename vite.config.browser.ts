import { resolve } from 'path';
import { defineConfig, Plugin, TerserOptions } from 'vite';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Strip unused bip39 wordlists (keep only English) - saves ~150KB
function stripBip39Wordlists(): Plugin {
    return {
        name: 'strip-bip39-wordlists',
        resolveId(source, importer) {
            // Match ./wordlists/*.json except english.json
            if (
                importer?.includes('bip39') &&
                source.includes('/wordlists/') &&
                !source.includes('english')
            ) {
                return { id: 'empty-wordlist', external: false };
            }
            return null;
        },
        load(id) {
            if (id === 'empty-wordlist') {
                return 'export default []';
            }
            return null;
        },
    };
}

export default defineConfig({
    build: {
        outDir: 'browser',
        emptyOutDir: true,
        target: 'esnext',
        minify: false,
        terserOptions: {
            compress: {
                sequences: false,
                conditionals: false,
            },
            mangle: true,
        } as TerserOptions,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: () => 'index.js',
        },
        rollupOptions: {
            output: {
                chunkFileNames: '[name].js',
                manualChunks: (id) => {
                    if (
                        id.includes('node_modules') ||
                        id.includes('@btc-vision/bitcoin') ||
                        id.includes('/bitcoin/build/')
                    ) {
                        // Noble crypto - isolated, no circular deps
                        if (id.includes('@noble/curves')) return 'noble-curves';
                        if (id.includes('@noble/hashes')) return 'noble-hashes';
                        // Protobuf - isolated
                        if (id.includes('protobufjs')) return 'protobuf';
                        // Validation - isolated
                        if (id.includes('valibot')) return 'valibot';
                        // Everything else in vendors to avoid circular deps
                        return 'vendors';
                    }
                },
            },
        },
    },
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
            'protobufjs/full': resolve(__dirname, 'node_modules/protobufjs/dist/protobuf.min.js'),
            '@protobufjs/inquire': resolve(__dirname, 'src/shims/inquire-browser.js'),
            protobufjs: resolve(__dirname, 'src/shims/protobuf-browser.js'),
            // Use source versions for proper tree-shaking (not browser bundles)
            '@btc-vision/transaction': resolve(
                __dirname,
                'node_modules/@btc-vision/transaction/build/index.js',
            ),
            '@btc-vision/bitcoin': resolve(
                __dirname,
                'node_modules/@btc-vision/bitcoin/build/index.js',
            ),
            '@btc-vision/bip32': resolve(
                __dirname,
                'node_modules/@btc-vision/bip32/src/cjs/index.cjs',
            ),
        },
        mainFields: ['module', 'main'],
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        global: 'globalThis',
    },
    plugins: [
        stripBip39Wordlists(),
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
            overrides: {
                crypto: 'crypto-browserify',
                zlib: 'pako',
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
        dts({
            outDir: 'browser',
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
            insertTypesEntry: true,
        }),
    ],
});
