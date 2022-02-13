// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
//import firebase authentification function
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//details currently stored in .env, 
//change to .env.local file for .gitignore to work
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
}

//HUMZAHS FIREBASE INFO - replace info in .env file to use this
//firebase.initializeApp({
//apiKey: 'AIzaSyCHWE9w0W9Z3BO_mGQakqkm-GAs2jhZTUE',
// authDomain: 'adv-web-test.firebaseapp.com',
// projectId: 'adv-web-test',
// storageBucket: 'adv-web-test.appspot.com',
//messagingSenderId: '412829793841',
// appId: '1:412829793841:web:b1be5d7cf02a310f4b5f10'
//});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, app, db};
