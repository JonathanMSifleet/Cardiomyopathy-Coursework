import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseDetails from '../constants/firebaseDetails';
import { collection, query, getDocs } from 'firebase/firestore';

const generateQuery = async () => {
  // get all:
  initializeApp(firebaseDetails.details);
  const db = getFirestore();

  const results = [];

  // const q = query(collection(db, "cities"), where("capital", "==", true));
  const querySnapshot = await getDocs(query(collection(db, 'hcmData')));

  querySnapshot.forEach((doc) => {
    results.push({id: doc.id, data: doc.data()});
  });

  return results;
};

export default generateQuery;
