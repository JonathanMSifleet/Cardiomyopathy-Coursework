import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    name: 'Home',
    path: '/',
    base: '/',
    component: () => import('../views/Home/Home.vue')
  },
  {
    name: 'Query',
    path: '/Query/',
    base: '/',
    component: () => import('../views/Query/Query.vue')
  },
  {
    path: '/experimentalData',
    name: 'ExperimentalData',
    component: () => import('../views/ExperimentalData/ExperimentalData.vue')
  },
  // no route, route:
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
