var path = require('path'),
    root = function(dir) {
        return path.join(__dirname, '../../', dir)
    }

/**
 * Group of config settings for the server and bundler
 */
module.exports = {

    /**
     * The server port
     */
    "port": 3000,

    /**
     * A namespace to be used within the app.
     * If you change this you will need to clean up all pre-written code to use the new namespace.
     */
    "namespace": "app",

    /**
     * File locations
     */
    "server": path.join(__dirname, 'webpack/index.js'),
    "static": root('resources'),
    "index": root('index.html'),
    "root": root('app'),
    "js": root('app/app.js'),
    "scss": root('app/app.scss'),

    /**
     * HRM settings
     */
    "reload": true,
    "noInfo": true,
    "quiet": false,

    /**
     * Bundle settings
     */

    // Build directory
    "output": root('../bundle'),
    // Output file name. Do not include extension name.
    "fileName": "app",
    // Files or directories to copy to build directory
    "copy": [
    ],

    /**
     * List of environment variables that get used by the server
     * and get injected into the applications `window` variable
     *
     * env      =>  The name of the environment variable to look for.
     *
     * value    =>  The default value if no environment variable
     *              is found
     */
    variables: {
        "ENVIRONMENT": {env: "NODE_ENV", value: 'development'}
    }
}