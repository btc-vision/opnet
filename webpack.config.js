import webpack from 'webpack';

export default {
    mode: 'production',
    target: 'web',
    entry: './src/index.ts',
    watch: false,
    output: {
        filename: 'index.js',
        path: import.meta.dirname + '/browser',
        libraryTarget: 'module',
    },
    node: {
        __dirname: false,
    },
    experiments: {
        outputModule: true,
        asyncWebAssembly: false,
        syncWebAssembly: true,
    },
    resolve: {
        extensionAlias: {
            '.js': ['.js', '.ts'],
        },
        modules: ['.', 'node_modules'],
        extensions: ['.*', '.js', '.jsx', '.tsx', '.ts', '.wasm'],
        fallback: {
            buffer: import.meta.resolve('buffer/'),

            assert: import.meta.resolve('assert/'),
            crypto: import.meta.resolve('./src/crypto/crypto-browser.js'),
            undici: import.meta.resolve('./src/fetch/fetch-browser.js'),
            http: import.meta.resolve('stream-http/'),
            https: import.meta.resolve('https-browserify/'),
            os: import.meta.resolve('os-browserify/browser/'),
            stream: import.meta.resolve('stream-browserify'),
            process: import.meta.resolve('process/browser'),
            'node:worker_threads': false,
            worker_threads: false,
        },
    },
    cache: false,
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                resolve: {
                    fullySpecified: false,
                },
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.webpack.json',
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        usedExports: true,
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
            stream: 'stream-browserify',
        }),
    ],
};
