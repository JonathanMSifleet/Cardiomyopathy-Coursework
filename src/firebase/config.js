import { initializeApp } from 'firebase/app';
//firebase authentification function
import { getAuth } from 'firebase/auth';
//firebase firestore
import { getFirestore } from 'firebase/firestore';


//Firebase configuration
//details currently stored in .env,
//change to .env.local file for .gitignore to work
// const firebaseConfig = {
//   apiKey: process.env.VUE_APP_API_KEY,
//   authDomain: process.env.VUE_APP_AUTH_DOMAIN,
//   projectId: process.env.VUE_APP_PROJECT_ID,
//   storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
//   appId: process.env.VUE_APP_APP_ID
// };

const firebaseConfig = require('../constants/firebaseDetails');

// Initialize Firebase
const app = initializeApp(firebaseConfig.details);
const auth = getAuth();
const db = getFirestore();

export { auth, app, db };
