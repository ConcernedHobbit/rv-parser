import { Temporal } from '@js-temporal/polyfill';
import { ParseError } from './ParseError';
import { parseBuyEvent, parseDeposit } from './Parser';
import { BuyEvent, Deposit } from './types';

type DepositTestData = [string, Deposit];
type BuyEventTestData = [string, BuyEvent];

describe('parseDeposit', () => {
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

  const invalidDeposits: string[] = [
    '1980-01-02 03:40:50 person deposited 99.99 EUR (saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited 99.99 EUR (saldo: 0.00 -> 99.99 EUR.',
    '1980-01-02 03:40:50 person deposited 99.99 EUR (saldo: 0.00 -> 99.99).',
    '1980-01-02 03:40:50 person deposited 99.99 EUR (saldo: 0.00 -> 99. EUR).',
    '1980-01-02 03:40:50 person deposited 99.99 EUR (saldo: 0.00 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited 99.99 EUR (saldo: 0. -> 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited 99.99 EUR (0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited 99.99 EUR saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited 99.99 (saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited 99. EUR (saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited .99 EUR (saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 person deposited some EUR (saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 person 99.99 EUR (saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40:50 deposited 99.99 EUR (saldo: 0.00 -> 99.99 EUR).',
    '1980-01-02 03:40: person deposited 99.99 EUR (saldo: 0.00 -> 99.99 EUR).',
    '1980-01- 03:40:50 person deposited 99.99 EUR (saldo: 0.00 -> 99.99 EUR).',
    ''
  ];

  test.each(depositEvents)('"%s" works', (input, expected) => {
    expect(parseDeposit(input)).toEqual(expected);
  });

  test.each(invalidDeposits)('"%s" throws error', (input) => {
    expect(() => {
      parseDeposit(input);
    }).toThrow(ParseError);
  });
});

describe('parseBuyEvent', () => {
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

  const invalidBuyEvents: string[] = [
    '1980-01-02 03:40:50:00 person bought things for 12.34',
    '1980-01-02 03:40:50:00 person bought things for 12. EUR',
    '1980-01-02 03:40:50:00 person bought things for .34 EUR',
    '1980-01-02 03:40:50:00 person bought things 12.34 EUR',
    '1980-01-02 03:40:50:00 person bought things 4 12.34 EUR',
    '1980-01-02 03:40:50:00 person bought for 12.34 EUR',
    '1980-01-02 03:40:50:00 person bought things for 12.34 EUR',
    '1980-01-02 03:40:50:00 person things for 12.34 EUR',
    '1980-01-02 03:40:50:00 bought things for 12.34 EUR',
    '1980-01-02 03:40:50: person bought things for 12.34 EUR',
    '1980-01- 03:40:50:00 person bought things for 12.34 EUR',
    ''
  ];

  test.each(buyEvents)('"%s" works', (input, expected) => {
    expect(parseBuyEvent(input)).toEqual(expected);
  });

  test.each(invalidBuyEvents)('"%s" throws error', (input) => {
    expect(() => {
      parseBuyEvent(input);
    }).toThrow(ParseError);
  });
});
