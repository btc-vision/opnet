import webpack from 'webpack';

export default {
    mode: 'production',
    entry: './src/index.ts',
    watch: false,
    output: {
        filename: 'index.js',
        libraryTarget: 'this',
        path: import.meta.dirname + '/browser',
    },
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
                test: /\.([cm]?ts|tsx)$/,
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
