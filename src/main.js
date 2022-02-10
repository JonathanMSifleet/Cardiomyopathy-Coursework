import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import firebase from 'firebase/compat/app';
import store from './store';
import './assets/styles/main.module.css';
// import axios from 'axios';
// import firebase from 'firebase/app';

//will do firebase initialization later.

firebase.initializeApp({
  apiKey: 'AIzaSyCHWE9w0W9Z3BO_mGQakqkm-GAs2jhZTUE',
  authDomain: 'adv-web-test.firebaseapp.com',
  projectId: 'adv-web-test',
  storageBucket: 'adv-web-test.appspot.com',
  messagingSenderId: '412829793841',
  appId: '1:412829793841:web:b1be5d7cf02a310f4b5f10'
});

const app = createApp(App);
app.use(router);
// app.use(axios);
app.mount('#app');
