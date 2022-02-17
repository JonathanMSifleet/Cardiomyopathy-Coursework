import { createRouter, createWebHistory } from 'vue-router';

// const requireSignedOut = (to, from, next) =>{
//   let user = auth.currentUser;

//   // if logged in redirect to home, else continue to original route:
//   user ? next({ name: 'Home' }) : next();
// };

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
  // {
  //   path: '/register',
  //   name: 'Registration',
  //   component: () =>
  //     import(/* webpackChunkName: "register" */ '../components/Registration.vue'),
  //   beforeEnter: requireSignedOut
  // },
  // {
  //   path: '/reset',
  //   name: 'Password Reset',
  //   component: () =>
  //     import(/* webpackChunkName: "reset" */ '../components/PassReset.vue'),
  //   beforeEnter: requireSignedOut

  // },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('../views/Login.vue'),
  //   beforeEnter: requireSignedOut
  // },
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
