import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseDetails from '../constants/firebaseDetails';

const getDatabase = async () => {
  const db = getFirestore(initializeApp(firebaseDetails.details));
  if (process.env.DEVELOPMENT) await enableIndexedDbPersistence(db);

  return db;
};

export default getDatabase;
