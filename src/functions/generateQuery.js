import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseDetails from '../constants/firebaseDetails';

const generateQuery = async (queries) => {
  const app = initializeApp(firebaseDetails.details);
  const db = getFirestore(app);

  const queryRef = collection(db, 'hcmData');

  const generatedQueries = queries.map((query) => query = { ...query });


  generatedQueries.forEach((curQuery) => {
    q1 = query(queryRef, where(curQuery.fieldPath, curQuery.opStr, curQuery.value));
  });

  const querySnapshot = await getDocs(q1);

  const results = [];
  querySnapshot.forEach((doc) =>
    results.push({id: doc.id, data: doc.data()}));

  return results;
};

export default generateQuery;
