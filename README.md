### 多页面模板

## npm 相关命令

``` bash
# 安装工程依赖
npm install

# 在本地启动调试 serve
npm run serve

# 构建线上生产环境产物
npm run build

```

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
