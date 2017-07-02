const webpack = require('webpack');

module.exports = {
    entry: './js/main.js',
    output: {
        path: __dirname + '/public',
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', { modules: false }]
                    ]
                }
            }]
        }],
    },
};
