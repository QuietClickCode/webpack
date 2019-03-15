const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpackConfig = require('./webpack.config');
const utils = require('./utils');
const config = require('../config');

let _webpackConfig = merge(webpackConfig, {
    mode: "production",
    module: {
        rules: utils.styleLoaders({
            // 是否为生产构建生成源映射
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    // 完整的SourceMap作为单独的文件发出
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    // 将编译后的文件写入磁盘
    output: {
        // 输出目录作为绝对路径
        // path.resolve(__dirname, '../dist')
        path: config.build.assetsRoot,
        // 确定每个输出包的名称
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        // 确定非条目块文件的名称
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    optimization: {
        minimizer: [
            // 删除的“未使用代码(dead code)”
            // "mode" 配置选项轻松切换到压缩输出
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                // set to true if you want JS source maps
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                }
            }),
            // 最大限度地减少生产
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    safe: true
                }
            })
        ],
        splitChunks: {
            // 拆分块的名称
            name: 'manifest',
            // 在将模块移入commons块之前需要包含模块的最小块数。
            // 数字必须大于或等于2且小于或等于块数。
            // 传递`Infinity`只会创建公共块，但不会移动任何模块。
            // 通过提供`function`，您可以添加自定义逻辑。 （默认为块数）
            minChunks: 2,
            chunks: 'all'
        }
    },
    plugins: [
        // 清理 /dist 文件夹
        new CleanWebpackPlugin(),
        // short-circuits all Vue.js warning code
        new webpack.DefinePlugin({
            'process.env': config.build.env,
        }),


        // 将css提取到自己的文件中
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),

        // new MiniCssExtractPlugin({
        //     filename: 'style.css'
        // }),

        // 使用正确的资产哈希生成dist index.html以进行缓存。
        // 您可以通过编辑/index.html来自定义输出
        // 请参阅https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            // path.resolve(__dirname, '../dist/index.html')
            filename: config.build.index,
            // webpack需要模板的路径
            template: 'public/index.html',
            // 将所有资产注入给定template或templateContent。
            // 传递true或'body'所有javascript资源将被放置在body元素的底部。
            // 'head'将脚本放在head元素中
            inject: true,
            // 将html-minifier的选项作为对象来缩小输出
            minify: {
                // Strip HTML comments
                removeComments: true,
                // Collapse white space that contributes to text nodes in a document tree
                collapseWhitespace: true,
                // Remove quotes around attributes when possible
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // 允许控制在将块包含到HTML之前应如何对块进行排序
            chunksSortMode: 'dependency'
        }),

        // 复制自定义静态资产
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                // 输出root如果 from 是file或dir，则解析的glob路径如果 from 是glob。
                // static
                to: config.build.assetsSubDirectory,
                // 要忽略这种模式的Globs。
                ignore: ['.*']
            }
        ])
    ]
});

// 是否开启 gzip压缩
if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    _webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(''
                + '\\.('
                // ['js', 'css']
                + config.build.productionGzipExtensions.join('|')
                + ')$'
            ),
            // 仅处理大于此大小的资产。 以字节为单位
            threshold: 10240,
            // 仅处理压缩比此比率更好的资产（minRatio =压缩尺寸 / 原始尺寸）。
            // 示例：您拥有1024b大小的image.png文件，压缩版本的文件大小为768b，
            // 因此minRatio等于0.75。
            // 换句话说，当压缩大小/ 原始大小值减去minRatio值时，将处理资产。
            // 您可以使用1个值来处理所有资产。
            minRatio: 0.8
        })
    )
}

// 使用交互式可缩放树形图可视化webpack输出文件的大小。
if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    _webpackConfig.plugins.push(new BundleAnalyzerPlugin);
}

module.exports = _webpackConfig;
