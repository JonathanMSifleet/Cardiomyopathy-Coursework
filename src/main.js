import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/main.module.css';
// import axios from 'axios';

const app = createApp(App);
app.use(router);
// app.use(axios);
app.mount('#app');
