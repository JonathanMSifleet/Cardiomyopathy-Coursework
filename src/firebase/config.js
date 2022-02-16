import { initializeApp } from 'firebase/app';
//firebase authentification function
import { getAuth } from 'firebase/auth';
//firebase firestore
import {getFirestore} from 'firebase/firestore';
// import { data } from '../../.env';

//Firebase configuration
//details currently stored in .env,
//change to .env.local file for .gitignore to work
const firebaseConfig = {
  apiKey: 'AIzaSyAbdO1kL8ot43XdNmQgdrTCHyijn9-j-Fw',
  appId: '1:561426653443:web:69fda27182fad45f2e0936',
  authDomain: 'cardiomyopathy-mmu.firebaseapp.com',
  messagingSenderId: '561426653443',
  projectId: 'cardiomyopathy-mmu',
  storageBucket: 'cardiomyopathy-mmu.appspot.com'
};

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
