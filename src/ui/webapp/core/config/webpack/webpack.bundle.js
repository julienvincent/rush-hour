var path = require('path');
var webpack = require('webpack');
var aliases = require('../aliases')

module.exports = function (opts) {
    return {
        entry: [
            'babel-polyfill',
            opts.js
        ],
        output: {
            path: opts.output,
            filename: `${opts.fileName}.js`
        },
        plugins: [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production'),
                    'MODELIZR_CHEAP_MOCK': JSON.stringify(!opts.variables.MOCK)
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            })
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ['babel'],
                    exclude: /node_modules/
                }
            ]
        },

        resolve: {
            alias: aliases
        }
    }
}