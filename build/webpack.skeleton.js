'use strict';

const webpack = require('webpack');
const config = require('../config');
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config')
const nodeExternals = require('webpack-node-externals')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = merge(baseWebpackConfig, {
    target: 'node',
    devtool: false,
    entry: {
        app: resolve('../src/entry-skeleton.js')
    },
    output: Object.assign({}, baseWebpackConfig.output, {
        filename: 'skeleton-bundle.js',
        libraryTarget: 'commonjs2'
    }),
    externals: nodeExternals({
        whitelist: /\.css$/
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.build.env
        }),

        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        })
    ]
})
