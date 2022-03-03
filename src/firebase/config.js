//firebase authentification function
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseDetails from '../constants/firebaseDetails';

// Initialize Firebase
const app = initializeApp(firebaseDetails);
const auth = getAuth();

export { auth, app };

