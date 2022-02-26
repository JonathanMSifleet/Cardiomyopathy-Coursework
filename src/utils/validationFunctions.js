import isNumber from 'is-number';
import { validate } from 'email-validator';

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
  // eslint-disable-next-line no-useless-escape
  if(!validateRegex(input, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/))
    valMessages.push('Password must contain at least one special character');

  return valMessages;
};

export const validatePhoneNumber = (input) => {
  const valMessages = [];

  if(!validateRegex(input,
    /^((\+44)|(0)) ?\d{4} ?\d{6}$/)) valMessages.push('Phone number must be a valid UK phone number');

  return valMessages;
};

// to do:
// Address line 1
// Address line 2
// City
// Postcode

// login

// display messages on the screen

const validateRegex = (input, regex) => regex.test(input);

const validateLength = (input, min, max) => input.length <= max && input.length >= min;

