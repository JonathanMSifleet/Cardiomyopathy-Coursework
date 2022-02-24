// must go first:
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/global.scss';
import App from './App.vue';
import router from './services/router.js';
import { createApp } from 'vue';

const app = createApp(App);

if(!process.env.DEVELOPMENT) {
  app.config.errorHandler = () => null;
  app.config.warnHandler = () => null;
}

app.use(router);
app.mount('#app');
