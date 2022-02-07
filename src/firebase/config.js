// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
//import firebase authentification function
import { getAuth } from 'firebase/auth';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {auth, app};
