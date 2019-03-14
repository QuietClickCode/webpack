/**
 * @file vue-loader 配置文件
 */

'use strict';

const utils = require('./utils');
const config = require('../config');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: isProduction
            // 是否为生产构建生成源映射
            ? config.build.productionSourceMap
            // cssSourceMap
            : config.dev.cssSourceMap,
        // extract: isProduction
        extract: true
    })
}
