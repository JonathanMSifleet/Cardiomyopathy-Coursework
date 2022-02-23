import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import { auth } from '../firebase/config'

//route guard functions

const requireSignedOut = (to, from, next) =>{
  let user = auth.currentUser;
  if (user){
    //redirect to home
    next({ name: 'Home'})
  }
  else{
    //continue to original route
    next()
  }
}

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
    component: Home
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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: requireSignedOut
  },
  {
    path: '/externalData',
    name: 'externalData',
    component: () => import('../views/ExternalData.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
