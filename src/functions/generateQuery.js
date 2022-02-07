import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseDetails from '../constants/firebaseDetails';

const generateQuery = async (whereClauses) => {
  const app = initializeApp(firebaseDetails.details);
  const db = getFirestore(app);

  const queryRef = collection(db, 'hcmData');

  const whereArray = [];
  whereClauses.forEach((curQuery) => {
    whereArray.push(where(curQuery.fieldPath, curQuery.opStr, curQuery.value));
  });

  const querySnapshot = await getDocs(query(queryRef, ...whereArray));

  const results = [];
  querySnapshot.forEach((doc) =>
    results.push({id: doc.id, data: doc.data()}));

  return results;
};

export default generateQuery;
