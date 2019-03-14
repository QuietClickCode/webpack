const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');

module.exports = merge(webpackConfig, {

    mode: "production",
    plugins: [
        // 删除的“未使用代码(dead code)”
        // "mode" 配置选项轻松切换到压缩输出
        new UglifyJSPlugin({
            // 对调试源码(debug)和运行基准测试(benchmark tests)很有帮助
            sourceMap: true
        }),
        // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // 将公共的依赖模块提取到已有的入口 chunk 中
        new webpack.optimize.CommonsChunkPlugin({
            // 指定公共 bundle 的名称。
            name: 'common'
        })
    ]
})
