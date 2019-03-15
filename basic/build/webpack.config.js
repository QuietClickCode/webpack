/**
 * @file 基础 webpack 配置文件，开发环境和生产环境公用的
 */

'use strict';

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const config = require('../config');
const utils = require('./utils');
const vueLoader = require('./vue-loader');

// 别名路径
function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
        app: ['@babel/polyfill', './src/main.js']
    },
    output: {
        // 输出目录作为绝对路径。
        path: config.build.assetsRoot,
        // 此选项确定每个输出包的名称。捆绑包将写入该output.path选项指定的目录。
        filename: '[name].js',
        // path is '/'
        // 当使用按需加载或加载外部资源（如图像，文件等）时，这是一个重要选项
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    // 配置模块的解析方式
    resolve: {
        // 自动解决某些扩展。
        extensions: ['.js', '.vue', '.json'],
        // 别名
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoader
            },
            /// 它会应用到普通的 `.js` 文件
            // 以及 `.vue` 文件中的 `<script>` 块
            {
                test: /\.js?$/,
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                use: {
                    loader: 'babel-loader',
                }
            },
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'vue-style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    // static/img
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    // static/fonts
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        // 请确保引入这个插件来施展魔法
        new VueLoaderPlugin()
    ]
}
