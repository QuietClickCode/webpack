/**
 * @file client entry
 */

import { createApp } from '@/main.js';
import pageRouter from './router';

const { app, router } = createApp(pageRouter);

router.onReady(() => app.$mount('#app'));
