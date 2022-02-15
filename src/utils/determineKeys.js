const determineKeys = (data) => {
  const localKeys = [];
  data.forEach((curDoc) => {
    Object.keys(curDoc).forEach((key) => localKeys.push(key));
  });

  // remove duplicate keys and insensitive sort:
  return [...new Set(localKeys)].sort(Intl.Collator().compare);
};

export default determineKeys;
