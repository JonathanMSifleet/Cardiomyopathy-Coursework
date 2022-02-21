import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../../firebase/config.js';

//route guard functions

const requireSignedOut = (to, from, next) =>{
  let user = auth.currentUser;
  if (user){
    //redirect to home
    next({ name: 'Home'});
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
    path: '/',
    name: 'Home',
    component: () => import('../../views/Home/Home.vue')
  },
  {
    path: '/',
    name: 'Query',
    component: () => import('../../views/Home/Home.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "register" */ '../../components/Authentication/Registration.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/reset',
    name: 'PasswordReset',
    component: () =>
      import(/* webpackChunkName: "reset" */ '../../components/Authentication/PassReset.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../../views/Home/Login.vue'),
    beforeEnter: requireSignedOut
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
