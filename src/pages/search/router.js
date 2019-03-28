/**
 * @file home router
 */

import Search from '@/pages/Search/Search.vue';

export default {
    routes: [
        {
            path: '/search',
            name: 'search',
            component: Search
        }
    ]
};
