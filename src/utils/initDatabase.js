import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';

const initDatabase = async (app) => {
  const db = getFirestore(app);
  if (process.env.DEVELOPMENT) await enableIndexedDbPersistence(db);

  return db;
};

export default initDatabase;
