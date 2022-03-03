import firebaseDetails from '../constants/firebaseDetails';
import initDatabase from '../utils/initDatabase';
import { initializeApp } from 'firebase/app';
import { reactive } from 'vue';

const store = reactive({
  app: (() => initializeApp(firebaseDetails))(),
  database: (async () => await initDatabase())()
});

export default store;
