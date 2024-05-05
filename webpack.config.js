import webpack from 'webpack';

export default {
    mode: 'production',
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
        asyncWebAssembly: true,
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
            http: import.meta.resolve('stream-http/'),
            https: import.meta.resolve('https-browserify/'),
            os: import.meta.resolve('os-browserify/browser/'),
            stream: import.meta.resolve('stream-browserify'),
            process: import.meta.resolve('process/browser'),
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
