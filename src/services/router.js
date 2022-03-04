import { createRouter, createWebHashHistory } from 'vue-router';
import { auth } from '../firebase/config';


// if user redirect to home, otherwise continue to original route
const requireSignedOut = (to, from, next) => (auth.currentUser && auth.currentUser.emailVerified)
  ? next({ name: 'Home' }) : next();
const requireSignedIn = (to, from, next) => !auth.currentUser ? next({ name: 'Login' }) : next();

//route guard functions
const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    name: 'Home',
    path: '/',
    base: '/',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home/Home.vue')
  },
  {
    name: 'Query',
    path: '/Query/',
    base: '/',
    component: () => import (/* webpackChunkName: "Query" */ '../views/Query/Query.vue')
    // beforeEnter: requireSignedIn
  },
  {
    name: 'Registration',
    path: '/register',
    base: '/',
    component: () =>
      import (/* webpackChunkName: "Registration" */ '../views/Registration/Registration.vue'),
    beforeEnter: requireSignedOut
  },
  {
    name: 'Password Reset',
    path: '/reset',
    base: '/',
    component: () =>
      import (/* webpackChunkName: "PasswordReset" */ '../views/PassReset/PassReset.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import (/* webpackChunkName: "Login" */ '../views/Login/Login.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/experimental-data',
    name: 'ExperimentalData',
    component: () =>
      import (/* webpackChunkName: "ExperimentalData" */ '../views/ExperimentalData/ExperimentalData.vue'),
    beforeEnter: requireSignedIn
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () =>
      import (/* webpackChunkName: "Profile" */ '../views/UserProfile/UserProfile.vue'),
    beforeEnter: requireSignedIn
  },
  {
    path: '/help',
    name: 'Help',
    component: () =>
      import(/* webpackChunkName: "Help" */ '../views/Help/Help.vue')
  },
  // no route, route:
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }]
});

export default router;
