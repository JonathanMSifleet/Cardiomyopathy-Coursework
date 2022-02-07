import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    name: 'Home',
    path: '/',
    base: '/',
    component: () => import('../views/Home/Home.vue')
  },
  {
    name: 'Query',
    path: '/Query',
    base: '/',
    component: () => import('../views/Query/Query.vue')
  },
  // no route, route:
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
