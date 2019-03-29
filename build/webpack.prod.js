// https://markus.oberlehner.net/blog/setting-up-a-vue-project-with-webpack-4-and-babel-7/

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const MultipageWebpackPlugin = require('./multipage-webpack-plugin');

const { useWorkbox } = require('../.ivue/workbox');
const SWRegisterWebpackPlugin = require('../.ivue/sw-register-webpack-plugin');
const { copyWorkboxLibraries } = require('workbox-build');

const env = require('../config/prod.env');

// 别名路径
function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

const webpackConfig = merge(baseWebpackConfig, {
    mode: "production",
    module: {
        rules: utils.styleLoaders({
            // 是否为生产构建生成源映射
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    // 完整的SourceMap作为单独的文件发出
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
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
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    compress: {
                        // 在UglifyJs删除没有用到的代码时不输出警告
                        warnings: false,
                        // 删除所有的 `console` 语句，可以兼容ie浏览器
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true,
                    },
                    output: {
                        // 最紧凑的输出
                        beautify: false,
                        // 删除所有的注释
                        comments: false,
                    }
                }
            }),
        ],
        splitChunks: {
            chunks: 'async',   // initial、async和all
            name: true,
            // minSize: 30000,   // 形成一个新代码块最小的体积
            // maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
            // maxInitialRequests: 3,   // 最大初始化请求数
            // automaticNameDelimiter: '~',   // 打包分割符
            cacheGroups: {
                common: {
                    name: 'common',
                    chunks: 'initial',
                    minChunks: 2
                },
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/
                }
            }
        }
    },
    plugins: [
        // short-circuits all Vue.js warning code
        new webpack.DefinePlugin({
            'process.env': env,
        }),

        // 将css提取到自己的文件中
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            allChunks: true
        }),

        // inject skeleton content(DOM & CSS) into HTML
        new SkeletonWebpackPlugin({
            webpackConfig: require('./webpack.skeleton'),
            quiet: true
        }),

        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        // 多页面 html 生成
        new MultipageWebpackPlugin({
            bootstrapFilename: utils.assetsPath('js/manifest.[chunkhash].js'),
            templateFilename: '[name].html',
            templatePath: config.build.assetsRoot,
            htmlTemplatePath: resolve('src/pages/[name]/index.html'),
            htmlWebpackPluginOptions: {
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'auto'
            }
        })
    ]
});

// 是否开启 gzip压缩
if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
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
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

// serviceWorker 配置
const serviceWorker = config.serviceWorker;

if (serviceWorker && serviceWorker.enable !== false) {
    // Use workbox@3.x in prod mode.
    useWorkbox(webpackConfig, config);

    // 在useWorkbox之后，serviceWorker.enable可能会更改
    if (serviceWorker.enable !== false) {
        async function _copyWorkboxLibraries () {
            webpackConfig.plugins.push(new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, '../static'),
                    // 输出root如果 from 是file或dir，则解析的glob路径如果 from 是glob。
                    // static
                    to: config.build.assetsSubDirectory,
                    // 要忽略这种模式的Globs。
                    ignore: ['.*']
                }
            ]))

            copyWorkboxLibraries('dist/');

            // 将服务工作者的注册码注入HTML
            webpackConfig.plugins.push(new SWRegisterWebpackPlugin({
                filePath: path.resolve(__dirname, '../.ivue/sw-register.js'),
                prefix: (serviceWorker && serviceWorker.swPath) || config.build.assetsPublicPath
            }));
        }

        _copyWorkboxLibraries();
    }

}

module.exports = webpackConfig;
