/**
 * @file workbox.js
 */
const { basename, join } = require('path');
const { readFileSync, writeFileSync } = require('fs-extra');
// injectManifest：将资产注入到项目的预先缓存中
const { InjectManifest } = require('workbox-webpack-plugin');

/**
 * get workbox files
 *
 * @param {boolean} isProd 处于生产模式
 * @return {Array} files .js & .map
 */

/**
* use workbox-webpack-plugin
*
* @param {Object} webpackConfig webpack config
* @param {Object} userConfig user config
*/

exports.useWorkbox = function (webpackConfig, userConfig) {
    let {
        build: { assetsPublicPath },
        serviceWorker: workboxConfig
    } = userConfig;

    // workbox 参数
    let {
        swSrc,
        swDest = 'service-worker.js',
        disableGenerateNavigationRoute = false
    } = workboxConfig;

    // 默认参数 for workbox.InjectManifest
    let workboxInjectManifestConfig = {
        // https://developers.google.com/web/tools/workbox/modules/workbox-cli#injectmanifest
        // 有效值是'cdn'，'local'和'disabled。
        // 'disabled'将选择退出自动行为。您可以在首选URL上托管Workbox库的本地副本，并workbox-sw.js通过 importScripts配置选项传递正确的路径 。
        importWorkboxFrom: 'disabled',
        // 忽略列表
        exclude: [
            /\.map$/,
            /^manifest.*\.js(?:on)?$/,
            /\.hot-update\.js$/,
            /sw-register\.js/
        ]
    };

    // swDest必须是工作箱3.x中的相对路径
    swDest = basename(swDest);
    workboxConfig = Object.assign({}, workboxConfig, workboxInjectManifestConfig, {
        swDest
    });

    // 用户提供的service-worker
    let serviceWorkerContent = readFileSync(swSrc);
    if (serviceWorkerContent.indexOf('new WorkboxSW') !== -1) {
        console.warn('build', 'Your `service-worker.js` seems to be workbox 2.x');
        console.warn('build', 'But lavas-core-vue has upgraded to workbox 3.x from v1.2.0');
        console.warn('build', 'Service Worker is disabled to avoid errors\n');
        console.warn('build', 'If you want to get updated, visit https://github.com/lavas-project/lavas/issues/188');
        console.warn('build', 'Else keep using workbox 2.x by fixing version of lavas-core-vue to v1.1.13 \n');
        return;
    }

    // import workbox-sw
    let { version: workboxBuildVersion } = require('workbox-build/package.json');

    let importWorkboxClause = `
        importScripts('${assetsPublicPath}static/workbox-v${workboxBuildVersion}/workbox-sw.js');
        workbox.setConfig({
            modulePathPrefix: '${assetsPublicPath}static/workbox-v${workboxBuildVersion}/'
        });
    `;

    serviceWorkerContent = importWorkboxClause + serviceWorkerContent;

    // 最后注册导航
    if (!disableGenerateNavigationRoute) {
        let registerNavigationClause;
        // https://github.com/lavas-project/lavas/issues/128
        registerNavigationClause = `workbox.routing.registerNavigationRoute('${assetsPublicPath}index.html');`;

        // workbox预先注入点
        const WORKBOX_PRECACHE_REG = /workbox\.precaching\.precacheAndRoute\(self\.__precacheManifest\);/;

        if (WORKBOX_PRECACHE_REG.test(serviceWorkerContent)) {
            serviceWorkerContent = serviceWorkerContent.replace(WORKBOX_PRECACHE_REG,
                `workbox.precaching.precacheAndRoute(self.__precacheManifest);\n${registerNavigationClause}\n`);
        }
        else {
            serviceWorkerContent += registerNavigationClause;
        }
    }

    // write new service worker in config/sw.js
    let tempSwSrc = join(process.cwd(), './.ivue', 'sw-temp.js');
    writeFileSync(tempSwSrc, serviceWorkerContent, 'utf8');
    workboxConfig.swSrc = tempSwSrc;

    // delete some custom props such as `swPath` and `appshellUrls`, otherwise workbox will throw an error
    delete workboxConfig.enable;
    delete workboxConfig.swPath;
    delete workboxConfig.appshellUrls;
    delete workboxConfig.appshellUrl;
    delete workboxConfig.pathPrefix;
    delete workboxConfig.swName;
    delete workboxConfig.swRegisterName;
    delete workboxConfig.scope;
    delete workboxConfig.disableGenerateNavigationRoute;

    // use workbox-webpack-plugin@3.x
    webpackConfig.plugins.push(new InjectManifest(workboxConfig));
}
