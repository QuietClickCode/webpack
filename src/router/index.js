import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/pages/Hello'
import Skeleton from '@/Skeleton.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Hello',
            component: Hello
        },
        // 插入骨架屏路由
        {
            path: '/skeleton',
            name: 'skeleton',
            component: Skeleton
        }
    ]
})
