import { createApp } from 'vue';
import App from './App.vue';
//import router from './router';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/main.module.css';
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/global.scss';
import router from './services/router.js';
// import axios from 'axios';


// app.use(axios);


// must go first:




if(!process.env.DEVELOPMENT) {
  app.config.errorHandler = () => null;
  app.config.warnHandler = () => null;
}
let app = null;

//establishes user state (logged in/out) before rendering components
onAuthStateChanged(auth, ()=>{
  if (app == null){
    app = createApp(App).use(router).mount('#app');
  }
})


