import { collection, getDocs, query, where } from 'firebase/firestore';
import store from '../services/store';

const generateQuery = async(whereClauses) => {
  const mappedWhereClauses = mapClausesToArray(whereClauses);
  const results = await executeQuery(await store.database, mappedWhereClauses);

  return extractResults(results);
};

const mapClausesToArray = (whereClauses) => whereClauses.map((curQuery) =>
  where(curQuery.fieldPath, curQuery.opStr, curQuery.value));

const executeQuery = async(db, whereClauses) => await getDocs(
  query(collection(db, 'hcmData'), ...whereClauses));

const extractResults = (results) => {
  const documents = [];
  results.forEach((doc) => documents.push({ data: doc.data() }));

  return documents;
};

export default generateQuery;
