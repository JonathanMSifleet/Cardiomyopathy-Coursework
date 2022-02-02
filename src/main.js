import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/styles/main.module.css';
// import axios from "axios";
// import firebase from "firebase/app";

//will do firebase initialization later.
const app = createApp(App);
app.use(store);
app.use(router);
// app.use(axios);
app.mount('#app');
