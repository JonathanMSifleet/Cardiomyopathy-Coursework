// must go first:
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/global.scss';
import App from './App.vue';
import router from './hoc/router/router.js';
import store from './hoc/store/store.js';
import Vuex from 'vuex';
import { auth } from './firebase/config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { createApp } from 'vue';

let app = null;

onAuthStateChanged(auth, ()=>{
  if (app == null){
    app = createApp(App)
      .use(store)
      .use(Vuex)
      .use(router)
      .mount('#app');
  }
});
//establishes user state (logged in/out) before rendering components

// app.use(axios);

