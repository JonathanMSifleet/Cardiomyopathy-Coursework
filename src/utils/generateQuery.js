import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseDetails from '../constants/firebaseDetails';

const generateQuery = async (whereClauses) => {
  const mappedWhereClauses = mapClausesToArray(whereClauses);

  const results = await executeQuery(getDatabase(), mappedWhereClauses);
  return extractResults(results);
};

const getDatabase = () => getFirestore(initializeApp(firebaseDetails.details));

const mapClausesToArray = (whereClauses) => whereClauses.map((curQuery) =>
  where(curQuery.fieldPath, curQuery.opStr, curQuery.value));

const executeQuery = async (db, whereClauses) => await getDocs(
  query(collection(db, 'hcmData'), ...whereClauses));

const extractResults = (results) => {
  const documents = [];
  results.forEach((doc) =>
    documents.push({id: doc.id, data: doc.data()}));

  return documents;
};

export default generateQuery;
