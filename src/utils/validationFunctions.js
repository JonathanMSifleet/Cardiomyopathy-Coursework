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

const validateRegex = (input, regex) => regex.test(input);

const validateLength = (input, min, max) => input.length <= max && input.length >= min;

