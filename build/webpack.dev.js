/**
 * @file 开发环境 webpack 配置文件
 */

// 'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 识别某些类别的webpack错误，并清理，聚合和优先级，以提供更好的开发人员体验。
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const MultipageWebpackPlugin = require('./multipage-webpack-plugin');

const utils = require('./utils');
const config = require('../config');
const webpackConfig = require('./webpack.config');

// 别名路径
function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

// 将热重新加载相关代码添加到条目块
Object.keys(webpackConfig.entry).forEach(function (name) {
    webpackConfig.entry[name] = ['./build/dev-client'].concat(webpackConfig.entry[name]);
});

module.exports = merge(webpackConfig, {
    mode: "development",
    // cheap-module-eval-source-map 开发速度更快
    devtool: config.dev.devtool,
    module: {
        rules: utils.styleLoaders({
            hotReload: true,
            extract: true,
            sourceMap: config.dev.cssSourceMap,
            usePostCSS: true
        }).concat(SkeletonWebpackPlugin.loader({
            resource: resolve('src/router.js'),
            options: {
                entry: Object.keys(utils.getEntries('./src/pages')),
                importTemplate: 'import [nameHash] from \'@/pages/[name]/[nameCap].skeleton.vue\';'
            }
        }))
    },
    plugins: [
        // 允许您创建可在配置全局常量的编译时间
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),

        // 将css提取到自己的文件中
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].css')
        }),

        // 热重新加载模块
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        // 使用骨架屏插件
        // inject skeleton content(DOM & CSS) into HTML
        new SkeletonWebpackPlugin({
            webpackConfig: require('./webpack.skeleton'),
            quiet: true
        }),

        // 多页面HTML文件的创建
        new MultipageWebpackPlugin({
            bootstrapFilename: 'manifest',
            templateFilename: 'index.html',
            templatePath: '[name]',
            htmlTemplatePath: resolve('src/pages/[name]/index.html'),
            htmlWebpackPluginOptions: {
                inject: true
            }
        }),

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
});
