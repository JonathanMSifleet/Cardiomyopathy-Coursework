export const isValid = (value) => {
  switch (true) {
    case 'false' || 'False':
      return true;
    case 'true' || 'True':
      return true;
    case value.search(/(\d+(?:\.\d+)?)/) !== -1:
      return true;
    default:
      return false;
  }
};
