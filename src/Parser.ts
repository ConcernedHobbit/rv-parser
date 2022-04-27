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

const BUY_REGEX = new RegExp(
  `${REGEX_DATE} ${REGEX_TIME} ${REGEX_NAME} ${PURCHASE_MARKER} ${REGEX_ITEM} for ${REGEX_SALDO(
    'Price'
  )} EUR`
);

const DEPOSIT_REGEX = new RegExp(
  `${REGEX_DATE} ${REGEX_TIME} ${REGEX_NAME} ${DEPOSIT_MARKER} ${REGEX_SALDO(
    'DepositSaldo'
  )} EUR \\(saldo: ${REGEX_SALDO(
    'InitialSaldo'
  )} ${SALDO_SEPERATOR} ${REGEX_SALDO('EndSaldo')} EUR\\)`,
  'g'
);

export const parseBuyEvent = (input: string): BuyEvent => {
  const result = BUY_REGEX.exec(input);

  if (!result || !result.groups) {
    throw new ParseError('Could not parse buy event');
  }

  return {
    time: Temporal.PlainDateTime.from(
      `${result.groups.Date} ${result.groups.Time}`
    ),
    username: result.groups.Name,
    item: result.groups.Item,
    price: saldoToNumber(result.groups.Price),
    currency: 'EUR'
  };
};

export const parseDeposit = (input: string): Deposit => {
  const result = DEPOSIT_REGEX.exec(input);

  if (!result || !result.groups) {
    throw new ParseError('Could not parse deposit');
  }

  return {
    time: Temporal.PlainDateTime.from(
      `${result.groups.Date} ${result.groups.Time}`
    ),
    username: result.groups.Name,
    amount: saldoToNumber(result.groups.DepositSaldo),
    initialSaldo: saldoToNumber(result.groups.InitialSaldo),
    endSaldo: saldoToNumber(result.groups.EndSaldo),
    currency: 'EUR'
  };
};
