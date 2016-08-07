/**
 * Import libraries to use during development
 */
var express = require('express'),
    server = express(),
    args = require('minimist')(process.argv),
    opts = require('./config/main'),
    module = require(opts.server),
    _ = require('lodash'),
    path = require('path'),
    env = require('dotenv').config({path: path.join(__dirname, '../.env'), silent: true}),
    fs = require('fs'),
    cheerio = require('cheerio')

/**
 * Set a process variable
 */
var setEnv = function (val) {
    return process.env[opts.variables.ENVIRONMENT.env] = val
}

/**
 * Set the current environment to production during a bundle
 */
if (args.bundle) {
    setEnv('production')
}

/**
 * Add the current process variables to the running process
 */
opts.variables = _.mapValues(opts.variables, function (variable) {
    return process.env[variable.env] || variable.value
})
opts.args = args

/**
 * Specify the static files location that express can serve from
 */
server.use('/resources', express.static(opts.static))

/**
 * Generate the html file to output in bundle or send to browser
 *
 * @returns html
 */
function makeIndex() {
    var production = opts.variables.ENVIRONMENT == 'production',
        index = fs.readFileSync(opts.index, 'utf8'),
        injector = cheerio.load(index)

    var js = `<script src="${opts.fileName}.js"></script>`,
        variables = `<script>window.env = ${JSON.stringify(opts.variables)}</script>`

    if (production) {
        var css = `    <link rel="stylesheet" href="${opts.fileName}.css">`
        injector('head').append(`${css}\n`)
    } else {
        js = `<script src="${opts.js.substring(opts.js.lastIndexOf('/'))}"></script>`
    }

    injector('head').append(`    <link rel="stylesheet" href="resources/lato.css">\n`)
    injector('head').append(`    <link rel="stylesheet" href="resources/icomoon/style.css">\n`)
    injector('head').append(`    <link rel="stylesheet" href="resources/cursor.css">\n`)

    injector('body').append(`${variables}\n`)
    injector('body').append(`${js}\n`)

    return injector.html()
}

/**
 * Initialize webpack either to bundle or to serve
 */
module(server, opts, makeIndex)

/**
 * Send off an html index file when running the web server
 */
server.get('*', function (req, res) {
    res.send(makeIndex())
})

/**
 * If not bundling, start the web server to listen on localhost:3000
 */
if (opts.run) {
    server.listen(opts.port, function () {
        console.log(`Server listening at http://localhost:3000/`)
    })
}
