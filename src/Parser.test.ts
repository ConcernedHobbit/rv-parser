import { Temporal } from '@js-temporal/polyfill';
import { parseBuyEvent, parseDeposit } from './Parser';
import { BuyEvent, Deposit } from './types';

type DepositTestData = [string, Deposit];
type BuyEventTestData = [string, BuyEvent];

const depositEvents: DepositTestData[] = [
  [
    '1980-01-01 01:02:03 person deposited 99.99 EUR (saldo: 0.00 -> 99.99 EUR).',
    {
      time: Temporal.PlainDateTime.from({
        year: 1980,
        month: 1,
        day: 1,
        hour: 1,
        minute: 2,
        second: 3
      }),
      username: 'person',
      amount: 9999,
      initialSaldo: 0,
      endSaldo: 9999,
      currency: 'EUR'
    }
  ]
];

const buyEvents: BuyEventTestData[] = [
  [
    '1980-01-01 01:02:03 person bought things for 12.34 EUR.',
    {
      time: Temporal.PlainDateTime.from({
        year: 1980,
        month: 1,
        day: 1,
        hour: 1,
        minute: 2,
        second: 3
      }),
      username: 'person',
      item: 'things',
      price: 1234,
      currency: 'EUR'
    }
  ]
];

test.each(depositEvents)('parseDeposit("%s")', (input, expected) => {
  expect(parseDeposit(input)).toEqual(expected);
});

test.each(buyEvents)('parseBuyEvent("%s")', (input, expected) => {
  expect(parseBuyEvent(input)).toEqual(expected);
});
