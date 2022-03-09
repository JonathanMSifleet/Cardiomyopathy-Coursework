import isNumber from 'is-number';
import { validate } from 'email-validator';

// eslint-disable-next-line no-useless-escape
const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const operandIsValid = (value = value.trim()) => {
  return value.toLowerCase() === 'false' ||  value.toLowerCase() === 'true' || isNumber(value);
};

export const validateName = (name) => {
  const valMessages = [];

  if (!validateLength(name, 2, 32)) valMessages.push('Name must be between 2 and 32 characters');
  if (!validateRegex(name, /^[a-zA-Z0-9_]+$/)) valMessages.push('Name must only contain letters a-z and A-Z');

  return valMessages;
};

export const validateEmail = (input) => {
  const valMessages = [];

  if(!validateLength(input, 3, 320)) valMessages.push('Email must be between 3 and 320 characters');
  if(!validate(input)) valMessages.push('Email must be a valid email address');

  return valMessages;
};

export const validatePassword = (input) => {
  const valMessages = [];

  if(!validateLength(input, 8, 64)) valMessages.push('Password must be between 8 and 64 characters');
  if(!validateRegex(input, /[A-Z]/)) valMessages.push('Password must contain at least one uppercase letter');
  if(!validateRegex(input, /[a-z]/)) valMessages.push('Password must contain at least one lowercase letter');
  if(!validateRegex(input, specialCharRegex))
    valMessages.push('Password must contain at least one special character');

  return valMessages;
};

export const validatePhoneNumber = (input) => {
  const valMessages = [];

  if(!validateRegex(input,
    /^((\+44)|(0)) ?\d{4} ?\d{6}$/)) valMessages.push('Phone number must be a valid UK phone number');

  return valMessages;
};

export const validateAddressLineOne = (input) => {
  const valMessages = [];

  if(!validateLength(input, 4, 255)) valMessages.push('Address must be between 4 and 255 characters');
  //THE SPECIAL CHAR REGEX CHECK IS BROKEN, does not run
  //if(validateRegex(specialCharRegex)) valMessages.push('Address must not contain special characters');
  return valMessages;
};

export const validateAddressLineTwo = (input) => {
  if(input.length === 0) return [];
  const valMessages = [];

  if(!validateLength(input, 0, 255)) valMessages.push('Address must be between 4 and 255 characters');
  //THE SPECIAL CHAR REGEX CHECK IS BROKEN, does not run
  //if(validateRegex(specialCharRegex)) valMessages.push('Address must not contain special characters');
  return valMessages;
};

export const validateCity = (input) => {
  const valMessages = [];

  if(!validateRegex(input, /^[a-zA-Z0-9_]+$/)) valMessages.push('City must only contain letters a-z and A-Z');
  if(!validateLength(input, 4, 35)) valMessages.push('City must be between 4 and 35 characters');
  //THE SPECIAL CHAR REGEX CHECK IS BROKEN, does not run
  //if(validateRegex(specialCharRegex)) valMessages.push('Address must not contain special characters');

  return valMessages;
};

export const validatePostcode = (input) => {
  const valMessages = [];

  if(!validateRegex(input, /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/))
    valMessages.push('Postcode must be a valid UK postcode');

  return valMessages;
};

const validateRegex = (input, regex) => regex.test(input);

const validateLength = (input, min, max) => input.length <= max && input.length >= min;
