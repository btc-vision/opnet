import webpack from 'webpack';

export default {
    //mode: 'production',
    mode: 'development',
    entry: './src/index.ts',
    watch: false,
    output: {
        filename: 'index.js',
        libraryTarget: 'commonjs',
        path: import.meta.dirname + '/browser',
    },
    target: 'web',
    node: {
        __dirname: false,
    },
    resolve: {
        extensionAlias: {
            '.js': ['.js', '.ts'],
        },
        modules: ['.', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
        fallback: {
            buffer: import.meta.resolve('buffer/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};
