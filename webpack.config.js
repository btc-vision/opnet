import webpack from 'webpack';
import WrapperPlugin from 'wrapper-webpack-plugin';

export default {
    mode: 'production',
    entry: './src/index.ts',
    watch: false,
    output: {
        filename: 'index.js',
        path: import.meta.dirname + '/browser',
        libraryTarget: 'commonjs2',
    },
    target: ['web', 'es6'],
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
        }),
        new WrapperPlugin({
            test: /\.js$/,
            header: (
                '(function umdWrapper(root, factory) {' +
                '  if(typeof exports === "object" && typeof module === "object")' +
                '    module.exports = factory().default;' +
                '  else if(typeof define === "function" && define.amd)' +
                '    define("NAME", [], function() { return factory().default; });' +
                '  else if(typeof exports === "object")' +
                '    exports["NAME"] = factory().default;' +
                '  else' +
                '    root["NAME"] = factory().default;' +
                '})(this, function() {' +
                'return '
            ).replace(/NAME/g, 'opnet'), // this is the name of the lib
            footer: '\n})',
        }),
    ],
};
