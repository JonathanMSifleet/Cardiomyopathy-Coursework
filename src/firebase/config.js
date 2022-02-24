import { initializeApp } from 'firebase/app';
//firebase authentification function
import { getAuth } from 'firebase/auth';

const firebaseConfig = require('../constants/firebaseDetails');

// Initialize Firebase
const app = initializeApp(firebaseConfig.details);
const auth = getAuth();

export { auth, app };

