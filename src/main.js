
import Vue from 'vue'
import App from './App.vue'
import { IvueButton, IvueLoadingBar, IvueIcon } from 'ivue-material';
import store from './store';

// 创建路由
import { createRouter } from './router.js';
import 'ivue-material/dist/styles/ivue.css';

Vue.component('IvueIcon', IvueIcon);
Vue.component('IvueButton', IvueButton);
Vue.component('IvueLoadingBar', IvueLoadingBar);

Vue.config.productionTip = false;

Vue.mixin({
    // 当复用的路由组件参数发生变化时，例如/detail/1 => /detail/2
    beforeRouteUpdate (to, from, next) {
        // asyncData方法中包含异步数据请求
        let asyncData = this.$options.asyncData;

        if (asyncData) {
            IvueLoadingBar.start();
            asyncData.call(this, {
                store: this.$store,
                route: to
            }).then(() => {
                IvueLoadingBar.finish();
                next();
            }).catch(next);
        }
        else {
            next();
        }
    }
});

export function createApp (routerParams) {
    let router = createRouter(routerParams);

    // 此时异步组件已经加载完成
    router.beforeResolve((to, from, next) => {
        let matched = router.getMatchedComponents(to);
        let prevMatched = router.getMatchedComponents(from);

        // [a, b]
        // [a, b, c, d]
        // => [c, d]
        let diffed = false;
        let activated = matched.filter((c, i) => {
            let ret = diffed || (diffed = (prevMatched[i] !== c));

            return ret;
        });

        if (!activated.length) {
            return next();
        }

        IvueLoadingBar.start();

        Promise.all(activated.map(c => {

            /**
             * 两种情况下执行asyncData:
             * 1. 非keep-alive组件每次都需要执行
             * 2. keep-alive组件首次执行，执行后添加标志
             */
            if (c.asyncData && (!c.asyncDataFetched || to.meta.notKeepAlive)) {
                return c.asyncData.call(c, {
                    store,
                    route: to
                }).then(() => {
                    c.asyncDataFetched = true;
                });
            }
        })).then(() => {
            IvueLoadingBar.finish();
            next();
        }).catch(next);
    });

    const app = new Vue({
        router,
        store,
        ...App
    });

    return { app, router, store };
}
