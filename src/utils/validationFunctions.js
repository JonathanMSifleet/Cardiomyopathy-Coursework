import isNumber from 'is-number';

export const isValid = (value = value.trim()) => {
  return value.toLowerCase() === 'false' ||  value.toLowerCase() === 'true' || isNumber(value);
};
