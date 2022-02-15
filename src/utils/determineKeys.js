const determineKeys = (data) => {
  const localKeys = [];
  data.forEach((curDoc) => {
    Object.keys(curDoc).forEach((key) => localKeys[key] = false);
  });

  return localKeys;
};

export default determineKeys;
