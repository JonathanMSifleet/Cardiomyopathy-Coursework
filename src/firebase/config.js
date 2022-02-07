// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
//import firebase authentification function
import { getAuth } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDq7fveZpF0p5CXmUT5DT4yWJg8njPFpoc',
  authDomain: 'cardiomyopathy-mmu.firebaseapp.com',
  projectId: 'cardiomyopathy-mmu',
  storageBucket: 'cardiomyopathy-mmu.appspot.com',
  messagingSenderId: '561426653443',
  appId: '1:561426653443:web:69fda27182fad45f2e0936'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {auth, app};
