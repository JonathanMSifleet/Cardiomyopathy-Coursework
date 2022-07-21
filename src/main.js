import 'mdb-vue-ui-kit/css/mdb.min.css'; // must go first
import '@fontsource/roboto';
import './assets/styles/global.scss';
import './assets/styles/main.module.css';
import 'animate.css';
import App from './App.vue';
import router from './services/router';
import { auth } from './firebase/config';
import { createApp } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

let app;

//establishes user state (logged in/out) before rendering components
onAuthStateChanged(auth, () => {
  if (app) return;

  app = createApp(App);
  app.use(router);

  if (!import.meta.env.VITE_DEVELOPMENT) {
    app.config.errorHandler = () => null;
    app.config.warnHandler = () => null;
  }
  app.mount('#app');
});
