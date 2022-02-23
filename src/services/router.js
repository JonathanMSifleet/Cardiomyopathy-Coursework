import { createRouter, createWebHashHistory } from 'vue-router';
import { auth } from '../firebase/config';

//route guard functions

const requireSignedOut = (to, from, next) =>{
  let user = auth.currentUser;
  if (user){
    //redirect to home
    next({ name: 'Home' });
  }
  else{
    //continue to original route
    next();
  }
};

// const requireSignedIn = (to, from, next) =>{
//   let user = auth.currentUser;
//   if (!user){
//     //redirect to login
//     next({ name: 'Login'})
//   }
//   else{
//     //continue to original route
//     next()
//   }
// }


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
  // no route, route:
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  {
    path: '/register',
    name: 'Registration',
    component: () =>
      import(/* webpackChunkName: "register" */ '../components/Registration.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/reset',
    name: 'Password Reset',
    component: () =>
      import(/* webpackChunkName: "reset" */ '../components/PassReset.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: requireSignedOut
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
