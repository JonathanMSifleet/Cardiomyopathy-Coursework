// must go first:
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/global.scss';
import App from './App.vue';
import router from './services/router.js';
import { createApp } from 'vue';

const app = createApp(App);
app.use(router);
app.mount('#app');
