import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/main.module.css';
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
// import axios from 'axios';

let app = null;

//establishes user state (logged in/out) before rendering components
onAuthStateChanged(auth, ()=>{
  if (app == null){
    app = createApp(App).use(router).mount('#app');
  }
})
// app.use(axios);


