import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/templates' },
        { path: '/templates', component: () => import('./pages/Templates.vue') },
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
});

createApp(App).use(router).mount('#app');
