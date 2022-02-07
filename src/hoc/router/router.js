import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../../views/Home/Home.vue')
  },
  {
    path: '/',
    name: 'Query',
    component: () => import('../../views/Home/Home.vue')
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
