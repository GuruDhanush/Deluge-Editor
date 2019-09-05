const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: {
        "app": './src/main.ts',
        // Package each language's worker and give these filenames in `getWorkerUrl`
        "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
        // "json.worker": './monaco-editor/esm/vs/language/json/json.worker',
        // "css.worker": './monaco-editor/esm/vs/language/css/css.worker',
        // "html.worker": './monaco-editor/esm/vs/language/html/html.worker',
        // "ts.worker": './monaco-editor/esm/vs/language/typescript/ts.worker',
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                loader: "ts-loader",
            }
        ]
    }
};