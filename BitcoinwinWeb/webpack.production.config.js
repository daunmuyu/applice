//使用：webpack -p --config webpack.production.config.js

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


const webpackConfig = merge(baseWebpackConfig, {
    watch: false,
    output: {
        path: __dirname + "/dist",
        filename: './bundle-p.js'
    },
    plugins:[],
    devtool: '',
    optimization: {
        minimizer: [new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    drop_debugger: true,
                    drop_console: true,
                }
            },
            cache: true,
            parallel:true,//多线程
        })],
    },
});

module.exports = webpackConfig;

//module.exports.plugins.push(
    //new UglifyJSPlugin({
    //    uglifyOptions: {
    //        compress: {
    //            drop_debugger: true,
    //            drop_console: true,
    //        },
    //        sourceMap: true
    //    }
    //})
//);
