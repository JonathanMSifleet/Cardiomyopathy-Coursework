import { initializeApp } from 'firebase/app';
//firebase authentification function
import { getAuth } from 'firebase/auth';
//firebase firestore
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = require('../constants/firebaseDetails');

// Initialize Firebase
const app = initializeApp(firebaseConfig.details);
const auth = getAuth();
const db = getFirestore();

export { auth, app, db };
