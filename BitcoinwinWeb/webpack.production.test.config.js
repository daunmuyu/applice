
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.production.config.js');


const webpackConfig = merge(baseWebpackConfig, {
    entry: './MainTest.ts',
});

module.exports = webpackConfig;
