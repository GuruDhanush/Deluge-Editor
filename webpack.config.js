const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');



module.exports = {
    entry: {
        "app": './src/main.ts',
        "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: './dist'
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    sourceMap: true,
                    compress: {
                        drop_console: true,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        dead_code: true,
                        if_return: true,
                        join_vars: true,
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: devMode,
                        },
                    },
                    'css-loader',
                ],
            },
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                loader: "ts-loader",
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!worker.js', '!main.css'],
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new HtmlWebpackPlugin({
            template: 'src\\index.html',
            excludeChunks: ['editor.worker'],
            favicon: 'src/assets/icon.png'
        }),
        new WebpackPwaManifest({
            name: "Deluge Editor",  
            short_name: "Deluge",
            start_url: ".",
            display: "standalone",
            background_color: "#fff",
            description: "Deluge Online code editor",
            theme_color: "blue",
            icons: [
                {
                    src: path.resolve('src/assets/icon.png'),
                    sizes: [48, 192, 256 ]
                }
            ],
            inject: true,
            ios: true
        }),
        new HtmlWebpackInlineSVGPlugin({
            runPreEmit: true,
        }),
        new GenerateSW({
            importWorkboxFrom: 'cdn',
            clientsClaim: true,
            skipWaiting: true
        })
    ]
};