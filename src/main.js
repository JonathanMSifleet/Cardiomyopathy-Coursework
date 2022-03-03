import 'mdb-vue-ui-kit/css/mdb.min.css'; // must go first
import './assets/styles/global.scss';
import './assets/styles/main.module.css';
import App from './App.vue';
import router from './services/router.js';
import { auth } from './firebase/config';
import { createApp } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

let app;

//establishes user state (logged in/out) before rendering components
onAuthStateChanged(auth, () => {
  if (app) return;

  app = createApp(App);
  app.use(router);

  if (!process.env.DEVELOPMENT) {
    app.config.errorHandler = () => null;
    app.config.warnHandler = () => null;
  }
  app.mount('#app');
});
