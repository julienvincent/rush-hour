var path = require('path')
var webpack = require('webpack')
var aliases = require('../aliases')
var prefix = require('autoprefixer')

module.exports = function (opts) {
    return {
        devtool: 'cheap-module-source-map',
        entry: [
            'eventsource-polyfill',
            `webpack-hot-middleware/client?noInfo=${opts.noInfo}&reload=${opts.reload}$quiet=${opts.quiet}`,
            'babel-polyfill',
            opts.js
        ],
        output: {
            path: opts.output,
            filename: `${opts.fileName}.js`,
            publicPath: '/'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ['babel'],
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    loaders: [
                        "style",
                        "css",
                        "sass",
                        "postcss"
                    ]
                }
            ]
        },
        postcss: [prefix()],

        resolve: {
            alias: aliases
        }
    }
}