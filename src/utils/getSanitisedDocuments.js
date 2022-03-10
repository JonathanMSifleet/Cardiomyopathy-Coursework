import determineKeys from './determineKeys';

const getSanitisedDocuments = (inputArray) => {
  let intermediateArray = determineKeys(inputArray);

  delete intermediateArray.userId;
  delete intermediateArray.createdAt;
  delete intermediateArray.deletedAt;

  return intermediateArray;
};

export default getSanitisedDocuments;
