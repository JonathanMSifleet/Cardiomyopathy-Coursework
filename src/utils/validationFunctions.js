export const isNotEmpty = (value) => {
  return value.length !== 0 ? true : 'Field is required';
};

export const isValid = (value) => {
  switch (true) {
    case 'false' || 'False':
      return null;
    case 'true' || 'True':
      return null;
    case value.search(/(\d+(?:\.\d+)?)/) !== -1:
      return null;
    default:
      return 'Value must be equal to true or false or a number';
  }
};
