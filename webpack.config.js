import webpack from 'webpack';

export default {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        libraryTarget: 'this',
        path: import.meta.dirname + '/browser',
    },
    devtool: 'source-map',
    resolve: {
        extensionAlias: {
            '.js': ['.js', '.ts'],
        },
        modules: ['.', 'node_modules'],
        extensions: ['.js', '.webpack.js', '.web.js', '.d.ts', '.ts', '.tsx'],
        fallback: {
            buffer: import.meta.resolve('buffer/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: [/node_modules/],
                loader: 'ts-loader',
                resolve: {
                    fullySpecified: false,
                },
                options: {
                    configFile: 'tsconfig.webpack.json',
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
