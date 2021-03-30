const path = require('path')

module.exports = {
    mode: 'production',
    entry: './lib/index-node.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'supersets.js',
        library: 'Supersets',
        libraryTarget: 'window'
    }
}
