// must go first:
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles/global.scss';
import App from './App.vue';
import router from './hoc/router/router';
import store from './hoc/store/store';
import { createApp } from 'vue';

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
