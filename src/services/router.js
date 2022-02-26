import { createRouter, createWebHashHistory } from 'vue-router';
import { auth } from '../firebase/config';

//route guard functions

const requireSignedOut = (to, from, next) =>{
  let user = auth.currentUser;

  // if user redirect to home, otherwise continue to original route
  user ? next({ name: 'Home' }) : next();
};

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
  {
    name: 'Registration',
    path: '/register',
    base: '/',
    component: () => import('../views/Registration/Registration.vue'),
    beforeEnter: requireSignedOut
  },
  {
    name: 'Password Reset',
    path: '/reset',
    base: '/',
    component: () => import('../views/PassReset/PassReset.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue'),
    beforeEnter: requireSignedOut
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
