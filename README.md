### 基础模板

## npm 相关命令

``` bash
# 安装工程依赖
npm install

# 在本地启动调试 serve
npm run serve

# 构建线上生产环境产物
npm run build

```

Skeleton 骨架屏使用

### SkeletonWebpackPlugin 参数说明

- webpackConfig *必填*，渲染 skeleton 的 webpack 配置对象
- insertAfter *选填*，渲染 DOM 结果插入位置，默认值为字符串 `'<div id="app">'`
    - 也可以传入 `Function`，方法签名为 `insertAfter(entryKey: string): string`，返回值为挂载点字符串
- quiet *选填*，在服务端渲染时是否需要输出信息到控制台
- router *选填* SPA 下配置各个路由路径对应的 Skeleton
    - mode *选填* 路由模式，两个有效值 `history|hash`
    - routes *选填* 路由数组，其中每个路由对象包含两个属性：
        - path 路由路径 `string|RegExp`
        - skeletonId Skeleton DOM 的 id `string`
- minimize *选填* SPA 下是否需要压缩注入 HTML 的 JS 代码

[详情见](https://github.com/lavas-project/vue-skeleton-webpack-plugin)

### Service Worker 配置项 config.serviceWorker

* enable

是否启用 Service Worker，默认为 true。

* swSrc

生成 service-worker.js 所需的模板文件所在位置，后续会详细提及

* swDest

生成的 service-worker.js 的存放位置。例子中放在了整体构建目录 (/dist) 的下面，即 /dist/service-worker.js

* swPath

生成的 service-worker.js 在 sw-register.js 中默认会使用 publicPath 进行完整可访问路径拼接，如果您需要指定一个专有的 service-worker.js 文件的可访问 path，可以通过 swPath 配置指定，该配置字段默认不开启。


更多关于 Service Worker 配置请查看[Workbox官网](https://developers.google.com/web/tools/workbox/guides/get-started)

### 预缓存文件列表

```workbox-webpack-plugin@3.x``` 会自动把 webpack 处理的 **所有静态文件** 列为预缓存文件。在构建完成后会单独保存在一个 precacheList 文件中，以 JSON 的格式。

如果想对这些文件进行进一步的控制（例如增加额外的，或者删除无用的）需要使用一些高级的配置项，可以查阅 workbox 官网的这篇文档

通过这些配置，WorkboxWebpackPlugin 能够根据这些静态文件的信息生成 service-worker.js 并包含符合条件的预缓存文件。如果要实现动态缓存和 appshell，还需要 Service Worker 模板来进一步实现。

### Service Worker 模板

Service Worker 的模板位于 ```/src/service-worker.js``` 。观察初始状态下的代码，如下：

```javascript
workbox.core.setCacheNameDetails({
    prefix: 'ivue-cache',
    suffix: 'v1',
    precache: 'install-time',
    runtime: 'run-time',
    googleAnalytics: 'ga'
});
workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

```

* prefix

指定应用的缓存前缀，同时应用于预缓存和动态缓存的名称，拼接在最前面。

* suffix

指定应用的缓存后缀，同时应用于预缓存和动态缓存的名称，拼接在最后面。

* precache

指明预缓存使用的缓存名称

* runtime

指定动态缓存使用的缓存名称

* googleAnalytics

workbox-google-analytics 使用的缓存名称。关于 workbox 和 google analytics 之间的配合，可以[查阅这里](https://developers.google.com/web/tools/workbox/modules/workbox-google-analytics)


第二段的两句 (```workbox.skipWaiting()```; 和 ```workbox.clientsClaim()```;) 一般共同使用，使得 Service Worker 可以在 activate 阶段让所有没被控制的页面受控，让 Service Worker 在下载完成后立即生效

第三段的 ```workbox.precaching.precacheAndRoute(self.__precacheManifest || [])```; 使用到的 self.__precacheManifest 是定义在单独的一个预缓存文件列表中。如前所述，这个列表包含 webpack 构建过程中的所有静态文件。而这里就是告诉 workbox 把这些文件预缓存起来。

[更多详细信息请查看](https://lavas.baidu.com/guide/v2/advanced/router)

多页面构建说明

multipage-webpack-plugin

为多页面Web应用程序构建webpack配置，管理所有资产和入口点有许多要求。

* 在多页面应用程序中，每个呈现的页面都对应一个webpack入口点。

* 每个入口点都有某种index.html文件或 MVC框架特定的服务器模板（部分），它呈现给html内容。

* 可能有不同的路径，甚至可能不在与入口点相同的目录中。
* 应仅包含该条目捆绑的资产。
* You would have to create essentially a html-webpack-plugin for each entry however posses extra configuration challenges:

```javascript
const templatesFn = (modules, twigRoot, assetsRoot, shared) => {
  return Object.keys(modules).map((entryName) => {
    return new HtmlWebpackPlugin({
      template: `${assetsRoot}/webpack.template.hbs`, //path.resolve(__dirname, "./assets/webpack.template.hbs"),
      filename: `${twigRoot}/webpack-bundles/${entryName}.twig`,
      chunks: ['inline', 'vendors', entryName, `${shared}`]
    })
  });
}
```
