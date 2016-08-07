var config = require('./main'),
    p = require('path'),
    namespace = function (path) {
        return path ? p.join(config.namespace, path) : config.namespace
    },
    root = function(path) {
        return path ? p.join(config.root, path) : config.root
    }

/**
 * import aliases for use within the application
 */
module.exports = {
    scss: config.scss,
    [namespace()]: root()
}