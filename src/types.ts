import { Temporal } from '@js-temporal/polyfill';

export type Currency = 'EUR';
export type Deposit = {
  time: Temporal.PlainDateTime;
  username: string;
  amount: number;

  initialSaldo: number;
  endSaldo: number;
  currency: Currency;
};

export type BuyEvent = {
  time: Temporal.PlainDateTime;
  username: string;
  item: string;
  price: number;
  currency: Currency;
};

export type DepositRegexGroups = {
  Date: string;
  Time: string;
  Name: string;
  DepositSaldo: string;
  InitialSaldo: string;
  EndSaldo: string;
};

export type BuyEventRegexGroups = {
  Date: string;
  Time: string;
  Name: string;
  Item: string;
  Price: string;
};
