var path = require('path'),
    webpack = require('webpack'),
    config = require('./webpack.dev'),
    fs = require('fs-extra'),
    postcss = require('postcss'),
    prefix = require('autoprefixer'),
    sass = require('node-sass'),
    express = require('express'),
    rimraf = require('rimraf')

/**
 * Webpack config. Uses either bundler (webpack.bundle) or dev server with HMR (webpack.dev)
 */
module.exports = function (server, opts, makeIndex) {
    if (opts.args.bundle) {
        rimraf(opts.output, function () {
            fs.mkdirsSync(opts.output)

            postcss([prefix({browsers: 'last 8 versions'})]).process(sass.renderSync({
                file: opts.scss,
                outputStyle: 'compressed',
                sourceMap: false
            }).css, {
                from: opts.scss,
                to: path.join(opts.output, 'app.css')
            }).then(function (result) {
                fs.writeFileSync(path.join(opts.output, 'app.css'), result.css);
                console.log('scss compiled')
            })

            config = require('./webpack.bundle')(opts)
            webpack(config).run(function (err) {
                console.log('js compiled')
                fs.copy(opts.output, path.join(opts.output, '../../../build/ui/bundle'), function (err) {
                    if (err) return console.error(err)
                    console.log('copied to build')
                })
            })

            fs.writeFile(path.join(opts.output, 'index.html'), makeIndex(), 'utf8')

            var copy = function (location) {
                fs.copy(location, `${opts.output}/${location.substring(location.lastIndexOf('/'))}`, {});
            }

            copy(opts.static)
            opts.copy.forEach(location => {
                copy(location)
            })
        })

        opts.run = false
    } else {
        config = config(opts)
        var compiler = webpack(config)

        server.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath
        }))

        server.use(require('webpack-hot-middleware')(compiler))
    }
}