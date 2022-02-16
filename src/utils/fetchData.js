import { collection, getDocs } from 'firebase/firestore';
import store from '../services/store';

const fetchData = async () => {
  const results = await getDocs(collection(await store.database, 'hcmData'));

  return extractResults(results);
};

const extractResults = (results) => {
  const documents = [];
  results.forEach((doc) => documents.push(doc.data()));

  console.log('🚀 ~ file: fetchData.js ~ line 16 ~ extractResults ~ documents', documents);

  return documents;
};

export default fetchData;
