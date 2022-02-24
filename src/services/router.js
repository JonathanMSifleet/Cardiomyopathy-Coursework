import { createRouter, createWebHashHistory } from 'vue-router';

// leave comments in import
const routes = [
  {
    name: 'Home',
    path: '/',
    base: '/',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home/Home.vue')
  },
  {
    name: 'Query',
    path: '/Query/',
    base: '/',
    component: () => import(/* webpackChunkName: "Query" */ '../views/Query/Query.vue')
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
