import { ParseError } from './ParseError';

export const saldoToNumber = (saldo: string): number => {
  const parts = saldo.split('.');
  if (parts.length < 2)
    throw new ParseError(`Saldo ${saldo} does not contain decimal places`);

  const whole = Number(parts[0]);
  if (isNaN(whole))
    throw new ParseError(`Whole part ${parts[0]} is not a number`);

  // In a case such as '12.', we want to throw an error
  if (parts[1].length == 0)
    throw new ParseError(`Decimal part for saldo ${saldo} is empty`);

  // In a case such as '1.2', we want to assume that '.2' means '.20'
  if (parts[1].length < 2) parts[1] = `${parts[1]}0`;

  const decimals = Number(parts[1]);
  if (isNaN(decimals))
    throw new ParseError(`Decimal part ${parts[1]} is not a number`);

  return whole * 100 + decimals;
};

export const REGEX_DATE = '(?<Date>\\d{4}-\\d{2}-\\d{2})';
export const REGEX_TIME = '(?<Time>\\d{2}:\\d{2}:\\d{2})';
export const REGEX_STRING = (name: string) => `(?<${name}>.*)`;
export const REGEX_NAME = REGEX_STRING('Name');
export const REGEX_ITEM = REGEX_STRING('Item');
export const REGEX_SALDO = (name: string) => `(?<${name}>-?(\\d{1,}\\.\\d{2}))`;
