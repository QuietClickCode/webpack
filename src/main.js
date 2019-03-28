
import Vue from 'vue'
import App from './App.vue'
import { IvueButton } from 'ivue-material';

// 创建路由
import { createRouter } from './router.js';

Vue.component('IvueButton', IvueButton);
Vue.config.productionTip = false
import 'ivue-material/dist/styles/ivue.css';


export function createApp (routerParams) {
    let router = createRouter(routerParams);

    const app = new Vue({
        router,
        ...App
    });

    return { app, router };
}
