import { Temporal } from '@js-temporal/polyfill';
import { DEPOSIT_MARKER, PURCHASE_MARKER, SALDO_SEPERATOR } from './constants';
import { ParseError } from './ParseError';
import { BuyEvent, Deposit } from './types';
import {
  REGEX_DATE,
  REGEX_ITEM,
  REGEX_NAME,
  REGEX_SALDO,
  REGEX_TIME,
  saldoToNumber
} from './util';

// 2022-04-27 18:40:08 chobbit bought Can return for -0.15 EUR.
const BUY_REGEX = new RegExp(
  `${REGEX_DATE} ${REGEX_TIME} ${REGEX_NAME} ${PURCHASE_MARKER} ${REGEX_ITEM} for ${REGEX_SALDO(
    'Price'
  )} EUR`
);
type BuyEventRegexGroups = {
  Date: string;
  Time: string;
  Name: string;
  Item: string;
  Price: string;
};

const DEPOSIT_REGEX = new RegExp(
  `${REGEX_DATE} ${REGEX_TIME} ${REGEX_NAME} ${DEPOSIT_MARKER} ${REGEX_SALDO(
    'DepositSaldo'
  )} EUR \\(saldo: ${REGEX_SALDO(
    'InitialSaldo'
  )} ${SALDO_SEPERATOR} ${REGEX_SALDO('EndSaldo')} EUR\\)`,
  'g'
);
type DepositRegexGroups = {
  Date: string;
  Time: string;
  Name: string;
  DepositSaldo: string;
  InitialSaldo: string;
  EndSaldo: string;
};

export const parseBuyEvent = (input: string): BuyEvent => {
  const result = BUY_REGEX.exec(input);

  if (!result || !result.groups)
    throw new ParseError('Could not parse buy event');

  const groups: Partial<BuyEventRegexGroups> = result.groups;

  if (!groups.Date || !groups.Time)
    throw new ParseError('No datetime could be parsed from buy event');

  if (!groups.Name)
    throw new ParseError('No username could be parsed from buy event');

  if (!groups.Item)
    throw new ParseError('No item could be parsed from buy event');

  if (!groups.Price)
    throw new ParseError('No price could be parsed from buy event');

  return {
    time: Temporal.PlainDateTime.from(`${groups.Date} ${groups.Time}`),
    username: groups.Name,
    item: groups.Item,
    price: saldoToNumber(groups.Price),
    currency: 'EUR'
  };
};

export const parseDeposit = (input: string): Deposit => {
  const result = DEPOSIT_REGEX.exec(input);

  if (!result || !result.groups)
    throw new ParseError('Could not parse deposit');

  const groups: Partial<DepositRegexGroups> = result.groups;

  if (!groups.Date || !groups.Time)
    throw new ParseError('No datetime could be parsed from deposit');

  if (!groups.Name)
    throw new ParseError('No username could be parsed from deposit');

  if (!groups.DepositSaldo)
    throw new ParseError('No amount could be parsed from deposit');

  if (!groups.InitialSaldo)
    throw new ParseError('No initial saldo could be parsed from deposit');

  if (!groups.EndSaldo)
    throw new ParseError('No end saldo could be parsed from deposit');

  return {
    time: Temporal.PlainDateTime.from(`${groups.Date} ${groups.Time}`),
    username: groups.Name,
    amount: saldoToNumber(groups.DepositSaldo),
    initialSaldo: saldoToNumber(groups.InitialSaldo),
    endSaldo: saldoToNumber(groups.EndSaldo),
    currency: 'EUR'
  };
};
