
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.production.config.js');


const webpackConfig = merge(baseWebpackConfig, {
    entry: './app_boot/Boot_Main.ts',
    output: {
        path: __dirname + "/dist",
        filename: './bundle-b.js'
    },
});

module.exports = webpackConfig;
