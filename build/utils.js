/**
 * @file 工具包
 */
'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

const config = require('../config');

exports.assetsPath = function (newPath) {
    // assetsSubDirectory =  static
    let assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory;

    // 拼接路径 static + newPath
    return path.posix.join(assetsSubDirectory, newPath)
}

exports.cssLoaders = function (options) {
    options = options || {};

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // 生成与提取文本插件一起使用的加载器字符串
    function generateLoaders (loader, loaderOptions) {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

        // if (loaders && loader) {
        if (loader) {
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
            // return process.env.NODE_ENV !== 'production'
            //     ? 'vue-style-loader'
            //     : MiniCssExtractPlugin.loader,
            //     loaders;
            loaders.unshift(MiniCssExtractPlugin.loader)
        }
        else {
            loaders.unshift('vue-style-loader');
        }

        if (options.hotReload) {
            return ['css-hot-loader'].concat(loaders);
        } else {
            return loaders;
        }

        // return ['vue-style-loader'].concat(loaders);
    }
    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        // less: generateLoaders('less'),
        // sass: generateLoaders('sass', { indentedSyntax: true }),
        // scss: generateLoaders('scss'),
        // stylus: generateLoaders('stylus'),
        // styl: generateLoaders('stylus')
    }
}

// 为独立样式文件生成加载器（.vue之外）
exports.styleLoaders = function (options) {
    let output = [];
    let loaders = exports.cssLoaders(options);

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }

    return output;
}

/**
 * 在pageDir中寻找各个页面入口
 *
 * pageDir 路径
 * entryPath 文件名
 */
exports.getEntries = function (pageDir, entryPath) {
    const entry = {};
    const pageDirPath = path.join(__dirname, '..', pageDir);

    // 读取文件
    fs.readdirSync(pageDirPath)
        // 发现文件夹，就认为是页面模板
        .filter((f) => {
            // 如果 fs.Stats 对象描述文件系统目录，则返回 true
            return fs.statSync(path.join(pageDirPath, f)).isDirectory();
        })
        .forEach((f) => {
            // basename 方法返回 path 的最后一部分，类似于 Unix 的 basename 命令。 尾部的目录分隔符将被忽略
            entry[path.basename(f)] = [pageDir, f, entryPath].join('/');
        });

    return entry;
}
