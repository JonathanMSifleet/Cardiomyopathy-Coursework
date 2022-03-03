import firebaseDetails from '../constants/firebaseDetails';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const app = initializeApp(firebaseDetails);
const auth = getAuth();

export { auth, app };

