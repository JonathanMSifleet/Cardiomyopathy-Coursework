// must go first:
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/global.scss';
import App from './App.vue';
import router from './hoc/router/router.js';
import store from './hoc/store/store.js';
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { createApp } from 'vue';
// import axios from 'axios';

let app = null;

onAuthStateChanged(auth, ()=>{
  if (app == null){
    app = createApp(App)
    .use(store)
    .use(router)
    .mount('#app');
  }
});
//establishes user state (logged in/out) before rendering components

// app.use(axios);