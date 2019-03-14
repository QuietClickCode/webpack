/**
 * @file 工具包
 */
'use strict';

const path = require('path');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (newPath) {
    // static
    let assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory;

    // 拼接路径
    return path.posix.join(assetsSubDirectory, newPath)
}

exports.cssLoaders = function (options) {
    options = options || {};

    let cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    };

    // 生成与提取文本插件一起使用的加载器字符串
    function generateLoaders (loader, loaderOptions) {
        let loaders = [cssLoader];

        if (loaders) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        // 指定该选项时提取CSS
        //（在生产构建期间就是这种情况）
        if (options.extract) {
            return [
                process.env.NODE_ENV !== 'production'
                    ? 'vue-style-loader'
                    : MiniCssExtractPlugin.loader,
                'css-loader'
            ];
        }

        return ['vue-style-loader'].concat(loaders);
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('scss'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}
