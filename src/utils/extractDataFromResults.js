const extractDataFromResults = (results, keyName) => {
  let data = {};
  let type;

  switch(typeof(results[0][keyName])) {
    case 'boolean':
      type = 'pie';
      break;
    case 'number':
      type = 'bar';
      break;
    case 'string':
      type = 'pie';
      break;
  }

  let counter = 0;
  results.forEach((doc) => {
    const keyValue = doc[keyName];

    switch (typeof keyValue) {
      case 'boolean':
        // add key to object if it doesn't exist
        if (!data[keyValue]) data[keyValue] = [];

        data[keyValue] = ++data[keyValue];
        break;
      case 'number':
        if (!data[counter]) data[counter] = [];

        data[counter] = keyValue;
        counter++;
        break;
      case 'string':
        if (!data[keyValue]) data[keyValue] = 0;

        data[keyValue] = ++data[keyValue];
        break;
    }
  });

  return { data: Object.entries(data), type };
};

export default extractDataFromResults;
