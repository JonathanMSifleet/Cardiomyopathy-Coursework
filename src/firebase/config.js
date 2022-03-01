import { initializeApp } from 'firebase/app';
//firebase authentification function
import { getAuth } from 'firebase/auth';

let firebaseConfig = require('../constants/firebaseDetails');
console.log(firebaseConfig);
firebaseConfig = {
  apiKey: 'AIzaSyAbdO1kL8ot43XdNmQgdrTCHyijn9-j-Fw',
  appId: '1:561426653443:web:69fda27182fad45f2e0936',
  authDomain: 'cardiomyopathy-mmu.firebaseapp.com',
  messagingSenderId: '561426653443',
  projectId: 'cardiomyopathy-mmu',
  storageBucket: 'cardiomyopathy-mmu.appspot.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { auth, app };

