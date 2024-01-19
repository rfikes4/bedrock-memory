/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
const webpack = require('webpack');
const path = require('path');
const configuration = require('./config.json');

configuration.browsers = configuration.browsers || '> 1%';

module.exports = {
    mode: 'development',
    externals: {
        playcanvas: 'pc',
    },
    entry: {
        main: './src/index.ts',
    },
    optimization: {
        splitChunks: false,
    },
    output: {
        path: path.resolve(__dirname, 'build', 'scripts'),
        filename: '[name].build.js',
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build',
        hot: true,
        disableHostCheck: true,
        overlay: true,
        inline: true,
        open: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
    resolve: {
        alias: {
            process: 'process/browser',
        },
        fallback: {
            assert: false,
            buffer: require.resolve('buffer/'),
            crypto: 'crypto-browserify',
            stream: false,
            os: 'os-browserify',
            fs: 'browserify-fs',
            path: 'path-browserify',
            http: false,
            net: false,
            tls: false,
            child_process: false,
            hiredis: false,
            events: false
        },
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js', '.jsx', 'glsl', 'vs', 'fs'],
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [path.resolve(__dirname, 'pcconfig.json'), path.resolve(__dirname, 'config.json')],
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            { test: /\.(glsl|vs|fs)$/, loader: 'ts-shader-loader' },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            icon: true,
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'cleanupListOfValues',
                                        active: false,
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|jpg|png|)$/,
                use: {
                    loader: 'url-loader',
                },
            },
        ],
    },
};
