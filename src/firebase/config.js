import { initializeApp } from 'firebase/app';
//firebase authentification function
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../constants/firebaseDetails';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { auth, app };

