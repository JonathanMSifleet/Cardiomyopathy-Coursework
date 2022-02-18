import { collection, getDocs } from 'firebase/firestore';
import store from '../services/store';

const fetchDocuments = async () =>
  extractResults(await getDocs(collection(await store.database, 'hcmData')));

const extractResults = (results) => {
  const documents = [];
  results.forEach((doc) => documents.push(doc.data()));

  return documents;
};

export default fetchDocuments;
