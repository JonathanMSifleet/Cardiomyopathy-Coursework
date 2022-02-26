//firebase authentification function
import { getAuth } from 'firebase/auth';
import store from '../services/store';

// Initialize Firebase
const app = store.app;

const auth = getAuth();

export { auth, app };

