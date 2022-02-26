import { initializeApp } from 'firebase/app';
//firebase authentification function
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAbdO1kL8ot43XdNmQgdrTCHyijn9-j-Fw',
  authDomain: 'cardiomyopathy-mmu.firebaseapp.com',
  projectId: 'cardiomyopathy-mmu',
  storageBucket: 'cardiomyopathy-mmu.appspot.com',
  messagingSenderId: '561426653443',
  appId: '1:561426653443:web:69fda27182fad45f2e0936'
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { auth, app };

