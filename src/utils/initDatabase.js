import { enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';

const initDatabase = async (app) => {
  const db = getFirestore(app);
  await enableMultiTabIndexedDbPersistence(db);

  return db;
};

export default initDatabase;
