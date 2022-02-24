import initDatabase from '../utils/initDatabase';
import { reactive } from 'vue';
import { initializeApp } from 'firebase/app';
import firebaseDetails from '../constants/firebaseDetails';

const store = reactive({
  app: (() => initializeApp(firebaseDetails.details))(),
  database: (async () => await initDatabase())()
});

export default store;
