import { ParseError } from './ParseError';
import { REGEX_DATE, REGEX_STRING, saldoToNumber } from './util';

describe('saldoToNumber', () => {
  const correctInputs: [string, number][] = [
    ['12.34', 1234],
    ['00.00', 0],
    ['0.0', 0],
    ['12.3', 1230],
    ['1.2', 120]
  ];

  test.each(correctInputs)('"%s" returns %d', (input, expected) => {
    expect(saldoToNumber(input)).toBe(expected);
  });

  const errorInputs = ['12', 'aa.00', '12.aa', '12.', 'aa.'];

  test.each(errorInputs)('"%s" throws error', (input) => {
    expect(() => {
      saldoToNumber(input);
    }).toThrow(ParseError);
  });
});

test('regex string creator works', () => {
  expect(REGEX_STRING('Test')).toEqual('(?<Test>.*)');
});

describe('regex date', () => {
  let regexDate: RegExp;
  beforeAll(() => {
    regexDate = new RegExp(REGEX_DATE);
  });

  test('matches date', () => {
    expect(regexDate.test('2020-01-02')).toBe(true);
    expect(regexDate.test('0000-00-00')).toBe(true);
    expect(regexDate.test('9999-99-99')).toBe(true);
  });

  test('does not match invalid date', () => {
    expect(regexDate.test('1920-01-0')).toBe(false);
    expect(regexDate.test('192-01-02')).toBe(false);
    expect(regexDate.test('1920-1-02')).toBe(false);

    expect(regexDate.test('1920.01.02')).toBe(false);
    expect(regexDate.test('1920/01/02')).toBe(false);
  });
});
